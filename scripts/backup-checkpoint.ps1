[CmdletBinding()]
param(
    [string]$ProjectRoot = "",
    [string]$BackupDir = "",
    [ValidateRange(1, 10000)]
    [int]$RetentionCount = 24
)

$ErrorActionPreference = "Stop"

function Test-PathWithin {
    param([string]$Child, [string]$Parent)
    $parentPath = $Parent.TrimEnd('\', '/')
    $childPath = $Child.TrimEnd('\', '/')
    return $childPath.Equals($parentPath, [StringComparison]::OrdinalIgnoreCase) -or
        $childPath.StartsWith($parentPath + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
}

function Assert-NoReparseAncestors {
    param([string]$Path)
    $full = [IO.Path]::GetFullPath($Path)
    $current = [IO.Path]::GetPathRoot($full)
    foreach ($segment in ($full.Substring($current.Length) -split '[\\/]')) {
        if (-not $segment) { continue }
        $current = Join-Path $current $segment
        if (Test-Path -LiteralPath $current) {
            $attributes = [IO.File]::GetAttributes($current)
            if (($attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
                throw "Reparse-point path is not allowed: $current"
            }
        }
    }
}

function Test-ExcludedFile {
    param([string]$Name)
    $patterns = @(
        ".env*", ".npmrc", ".netrc", ".git-credentials", "credentials*", "*secret*",
        "*token*", "id_rsa*", "id_ed25519*", "*.pem", "*.key", "*.pfx", "*.p12",
        "*.cert", "*.crt", "*.jks", "*.kdbx", "*.sqlite", "*.sqlite3", "*.db",
        "*.db-*", "*.log", "*.tsbuildinfo", "*.pyc", "*.swp", "*.tmp"
    )
    foreach ($pattern in $patterns) {
        if ($Name -like $pattern) { return $true }
    }
    return $false
}

function Test-SuccessfulPair {
    param([IO.FileInfo]$Zip, [string]$ManifestPath, [string]$ExpectedRoot)
    if (-not (Test-Path -LiteralPath $ManifestPath -PathType Leaf)) { return $false }
    Assert-NoReparseAncestors $Zip.FullName
    Assert-NoReparseAncestors $ManifestPath
    try {
        $sidecar = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
        if ($sidecar.SchemaVersion -ne 1 -or -not $sidecar.Success -or
            $sidecar.SnapshotName -ne $Zip.BaseName -or
            $sidecar.ProjectRoot -ine $ExpectedRoot -or
            -not $sidecar.ArchiveSha256) { return $false }
        $actualHash = (Get-FileHash -LiteralPath $Zip.FullName -Algorithm SHA256).Hash
        if ($actualHash -ne $sidecar.ArchiveSha256) { return $false }
        $stream = [IO.File]::OpenRead($Zip.FullName)
        try {
            $archive = New-Object IO.Compression.ZipArchive($stream, [IO.Compression.ZipArchiveMode]::Read, $true)
            try {
                $entry = $archive.GetEntry("__devos_manifest.json")
                if (-not $entry) { return $false }
                $reader = New-Object IO.StreamReader($entry.Open(), [Text.Encoding]::UTF8)
                try {
                    $internal = $reader.ReadToEnd() | ConvertFrom-Json
                } finally {
                    $reader.Dispose()
                }
                return ($internal.SchemaVersion -eq 1 -and
                    $internal.SnapshotName -eq $Zip.BaseName -and
                    $internal.ProjectRoot -ieq $ExpectedRoot -and
                    @($internal.Files).Count -eq [int]$sidecar.FileCount -and
                    $archive.Entries.Count -eq ([int]$sidecar.FileCount + 1))
            } finally {
                $archive.Dispose()
            }
        } finally {
            $stream.Dispose()
        }
    } catch {
        return $false
    }
}

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = Join-Path $PSScriptRoot ".."
}
if ([string]::IsNullOrWhiteSpace($BackupDir)) {
    $BackupDir = Join-Path $env:USERPROFILE ".dev_os_backups"
}

$ProjectRoot = [IO.Path]::GetFullPath($ProjectRoot)
$BackupDir = [IO.Path]::GetFullPath($BackupDir)
Assert-NoReparseAncestors $ProjectRoot
Assert-NoReparseAncestors $BackupDir
if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) {
    throw "Project directory does not exist: $ProjectRoot"
}
if ((Test-PathWithin $BackupDir $ProjectRoot) -or (Test-PathWithin $ProjectRoot $BackupDir)) {
    throw "Backup directory and project directory must be separate."
}
[void][IO.Directory]::CreateDirectory($BackupDir)
Assert-NoReparseAncestors $BackupDir

# A held file handle prevents a second process from writing to this destination.
$lockPath = Join-Path $BackupDir ".snapshot.lock"
Assert-NoReparseAncestors $lockPath
try {
    $lock = [IO.File]::Open($lockPath, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
} catch {
    throw "Another backup is already running for $BackupDir."
}

$zipPath = $null
$partialPath = $null
$sidecarPath = $null
try {
    Add-Type -AssemblyName System.IO.Compression
    $rootHash = [Security.Cryptography.SHA256]::Create()
    try {
        $rootBytes = [Text.Encoding]::UTF8.GetBytes($ProjectRoot.ToLowerInvariant())
        $projectId = ([BitConverter]::ToString($rootHash.ComputeHash($rootBytes))).Replace("-", "").Substring(0, 10)
    } finally {
        $rootHash.Dispose()
    }

    $stamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssfffZ")
    $snapshotName = "dev-os-$projectId-$stamp-$([Guid]::NewGuid().ToString('N').Substring(0, 8))"
    $partialPath = Join-Path $BackupDir "$snapshotName.partial"
    $zipPath = Join-Path $BackupDir "$snapshotName.zip"
    $sidecarPath = Join-Path $BackupDir "$snapshotName.manifest.json"
    Assert-NoReparseAncestors $partialPath
    Assert-NoReparseAncestors $zipPath
    Assert-NoReparseAncestors $sidecarPath

    $excludeDirs = @(
        ".git", "node_modules", ".next", "out", "build", "dist", "coverage",
        ".turbo", ".cache", ".vercel", ".pnpm-store", ".yarn", "__pycache__",
        "test-results", "playwright-report", "backups", ".backups", "temp_restore",
        "_restore_test", ".ssh", ".aws", ".secrets", "secrets", "credentials"
    )
    $files = New-Object System.Collections.Generic.List[object]
    $pending = New-Object System.Collections.Stack
    $pending.Push($ProjectRoot)
    while ($pending.Count -gt 0) {
        $directory = [string]$pending.Pop()
        foreach ($item in (Get-ChildItem -LiteralPath $directory -Force)) {
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) { continue }
            if ($item.PSIsContainer) {
                if ($excludeDirs -notcontains $item.Name) { $pending.Push($item.FullName) }
                continue
            }
            if (Test-ExcludedFile $item.Name) { continue }
            $relative = $item.FullName.Substring($ProjectRoot.TrimEnd('\', '/').Length).TrimStart('\', '/').Replace('\', '/')
            if ($relative -eq "__devos_manifest.json") {
                throw "Project contains reserved archive path __devos_manifest.json."
            }
            $files.Add([PSCustomObject]@{ Source = $item.FullName; Relative = $relative })
        }
    }
    $files = @($files | Sort-Object Relative)

    $gitCommit = "unknown"
    try {
        $candidate = & git -C $ProjectRoot rev-parse HEAD 2>$null
        if ($LASTEXITCODE -eq 0 -and $candidate) { $gitCommit = [string]$candidate }
    } catch { }

    $manifestFiles = New-Object System.Collections.Generic.List[object]
    $archiveStream = [IO.File]::Open($partialPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    try {
        $archive = New-Object IO.Compression.ZipArchive($archiveStream, [IO.Compression.ZipArchiveMode]::Create, $true)
        try {
            foreach ($file in $files) {
                $entry = $archive.CreateEntry($file.Relative, [IO.Compression.CompressionLevel]::Optimal)
                $sourceStream = [IO.File]::OpenRead($file.Source)
                $entryStream = $entry.Open()
                $sha = [Security.Cryptography.SHA256]::Create()
                $length = [long]0
                try {
                    $buffer = New-Object byte[] 65536
                    while (($read = $sourceStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                        $entryStream.Write($buffer, 0, $read)
                        [void]$sha.TransformBlock($buffer, 0, $read, $buffer, 0)
                        $length += $read
                    }
                    [void]$sha.TransformFinalBlock([byte[]]@(), 0, 0)
                    $digest = ([BitConverter]::ToString($sha.Hash)).Replace("-", "")
                } finally {
                    $sha.Dispose()
                    $entryStream.Dispose()
                    $sourceStream.Dispose()
                }
                $manifestFiles.Add([PSCustomObject]@{
                    Path = $file.Relative
                    Length = $length
                    Sha256 = $digest
                })
            }

            $manifest = [PSCustomObject]@{
                SchemaVersion = 1
                SnapshotName = $snapshotName
                CreatedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
                ProjectRoot = $ProjectRoot
                GitCommit = $gitCommit
                Files = $manifestFiles.ToArray()
            }
            $manifestBytes = [Text.Encoding]::UTF8.GetBytes(($manifest | ConvertTo-Json -Depth 8))
            $manifestEntry = $archive.CreateEntry("__devos_manifest.json", [IO.Compression.CompressionLevel]::Optimal)
            $manifestStream = $manifestEntry.Open()
            try {
                $manifestStream.Write($manifestBytes, 0, $manifestBytes.Length)
            } finally {
                $manifestStream.Dispose()
            }
        } finally {
            $archive.Dispose()
        }
    } finally {
        $archiveStream.Dispose()
    }

    $archiveHash = (Get-FileHash -LiteralPath $partialPath -Algorithm SHA256).Hash
    [IO.File]::Move($partialPath, $zipPath)
    $sidecar = [PSCustomObject]@{
        SchemaVersion = 1
        Success = $true
        SnapshotName = $snapshotName
        CreatedAtUtc = $manifest.CreatedAtUtc
        ProjectRoot = $ProjectRoot
        FileCount = $manifestFiles.Count
        ArchiveSha256 = $archiveHash
    }
    $sidecarTemp = "$sidecarPath.partial"
    $sidecar | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $sidecarTemp -Encoding UTF8
    [IO.File]::Move($sidecarTemp, $sidecarPath)

    # Only validated pairs from this source project count toward retention.
    $successful = @(
        Get-ChildItem -LiteralPath $BackupDir -Filter "dev-os-$projectId-*.zip" -File |
            Where-Object {
                $candidateManifest = Join-Path $BackupDir ($_.BaseName + ".manifest.json")
                Test-SuccessfulPair $_ $candidateManifest $ProjectRoot
            } |
            Sort-Object LastWriteTimeUtc -Descending
    )
    foreach ($old in @($successful | Select-Object -Skip $RetentionCount)) {
        $oldManifest = Join-Path $BackupDir ($old.BaseName + ".manifest.json")
        Assert-NoReparseAncestors $old.FullName
        Assert-NoReparseAncestors $oldManifest
        Remove-Item -LiteralPath $old.FullName -Force
        Remove-Item -LiteralPath $oldManifest -Force
    }

    Write-Output $zipPath
} catch {
    if ($partialPath -and (Test-Path -LiteralPath $partialPath)) {
        Assert-NoReparseAncestors $partialPath
        Remove-Item -LiteralPath $partialPath -Force
    }
    if ($zipPath -and (Test-Path -LiteralPath $zipPath) -and
        (-not $sidecarPath -or -not (Test-Path -LiteralPath $sidecarPath))) {
        Assert-NoReparseAncestors $zipPath
        Remove-Item -LiteralPath $zipPath -Force
    }
    throw
} finally {
    $lock.Dispose()
}
