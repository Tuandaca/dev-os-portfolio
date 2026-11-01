[CmdletBinding()]
param(
    [string]$SnapshotZip = "",
    [string]$BackupDir = "",
    [string]$RestoreTo = "",
    [switch]$VerifyOnly
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

function Test-SafeEntryName {
    param([string]$Name)
    if ([string]::IsNullOrWhiteSpace($Name) -or $Name.Contains('\') -or $Name.Contains(':') -or
        $Name.StartsWith('/') -or $Name.EndsWith('/')) { return $false }
    foreach ($part in $Name.Split('/')) {
        if ($part -eq '' -or $part -eq '.' -or $part -eq '..') { return $false }
    }
    return $true
}

if ([string]::IsNullOrWhiteSpace($BackupDir)) {
    $BackupDir = Join-Path $env:USERPROFILE ".dev_os_backups"
}
$BackupDir = [IO.Path]::GetFullPath($BackupDir)
Assert-NoReparseAncestors $BackupDir
if (-not (Test-Path -LiteralPath $BackupDir -PathType Container)) {
    throw "Backup directory does not exist: $BackupDir"
}

if ([string]::IsNullOrWhiteSpace($SnapshotZip)) {
    $latest = Get-ChildItem -LiteralPath $BackupDir -Filter "dev-os-*.zip" -File |
        Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1
    if (-not $latest) { throw "No snapshots found in $BackupDir." }
    $SnapshotZip = $latest.FullName
} elseif (-not [IO.Path]::IsPathRooted($SnapshotZip)) {
    $SnapshotZip = Join-Path $BackupDir $SnapshotZip
}
$SnapshotZip = [IO.Path]::GetFullPath($SnapshotZip)
Assert-NoReparseAncestors $SnapshotZip
if (-not (Test-PathWithin $SnapshotZip $BackupDir)) {
    throw "Snapshot must be in the selected backup directory."
}
if (-not (Test-Path -LiteralPath $SnapshotZip -PathType Leaf)) {
    throw "Snapshot does not exist: $SnapshotZip"
}
$snapshotName = [IO.Path]::GetFileNameWithoutExtension($SnapshotZip)
$sidecarPath = Join-Path $BackupDir "$snapshotName.manifest.json"
Assert-NoReparseAncestors $sidecarPath
if (-not (Test-Path -LiteralPath $sidecarPath -PathType Leaf)) {
    throw "Companion manifest is required: $sidecarPath"
}
$sidecar = Get-Content -LiteralPath $sidecarPath -Raw | ConvertFrom-Json
if ($sidecar.SchemaVersion -ne 1 -or -not $sidecar.Success -or
    $sidecar.SnapshotName -ne $snapshotName -or
    -not $sidecar.ArchiveSha256) {
    throw "Companion manifest is invalid."
}
$actualArchiveHash = (Get-FileHash -LiteralPath $SnapshotZip -Algorithm SHA256).Hash
if ($actualArchiveHash -ne $sidecar.ArchiveSha256) {
    throw "Archive SHA256 does not match the companion manifest."
}

Add-Type -AssemblyName System.IO.Compression
$zipStream = [IO.File]::OpenRead($SnapshotZip)
try {
    $archive = New-Object IO.Compression.ZipArchive($zipStream, [IO.Compression.ZipArchiveMode]::Read, $true)
    try {
        $manifestEntry = $archive.GetEntry("__devos_manifest.json")
        if (-not $manifestEntry) { throw "Archive has no internal manifest." }
        $manifestStream = $manifestEntry.Open()
        $reader = New-Object IO.StreamReader($manifestStream, [Text.Encoding]::UTF8)
        try {
            $manifest = $reader.ReadToEnd() | ConvertFrom-Json
        } finally {
            $reader.Dispose()
        }
        if ($manifest.SchemaVersion -ne 1 -or $manifest.SnapshotName -ne $snapshotName -or
            $manifest.ProjectRoot -ne $sidecar.ProjectRoot) {
            throw "Internal manifest does not match the companion manifest."
        }

        $expected = @{}
        foreach ($item in @($manifest.Files)) {
            if (-not (Test-SafeEntryName $item.Path) -or $item.Path -eq "__devos_manifest.json" -or
                $expected.ContainsKey($item.Path)) {
                throw "Internal manifest contains an unsafe or duplicate path."
            }
            $expected[$item.Path] = $item
        }
        if ($expected.Count -ne [int]$sidecar.FileCount -or
            $archive.Entries.Count -ne ($expected.Count + 1)) {
            throw "Archive file count does not match the manifests."
        }
        foreach ($entry in $archive.Entries) {
            if ($entry.FullName -eq "__devos_manifest.json") { continue }
            if (-not (Test-SafeEntryName $entry.FullName) -or
                -not $expected.ContainsKey($entry.FullName)) {
                throw "Archive contains an unsafe or unexpected entry: $($entry.FullName)"
            }
            $sha = [Security.Cryptography.SHA256]::Create()
            $entryStream = $entry.Open()
            try {
                $actual = ([BitConverter]::ToString($sha.ComputeHash($entryStream))).Replace("-", "")
            } finally {
                $entryStream.Dispose()
                $sha.Dispose()
            }
            $record = $expected[$entry.FullName]
            if ($actual -ne $record.Sha256 -or $entry.Length -ne [long]$record.Length) {
                throw "File integrity check failed: $($entry.FullName)"
            }
        }

        if ($VerifyOnly) {
            Write-Output "Verified $snapshotName ($($expected.Count) files; archive and file SHA256 matched)."
            return
        }
        if ([string]::IsNullOrWhiteSpace($RestoreTo)) {
            $RestoreTo = Join-Path $env:TEMP ("dev_os_restore_" + [Guid]::NewGuid().ToString("N"))
        }
        $RestoreTo = [IO.Path]::GetFullPath($RestoreTo)
        Assert-NoReparseAncestors ([IO.Path]::GetFullPath([string]$manifest.ProjectRoot))
        Assert-NoReparseAncestors $RestoreTo
        if ((Test-PathWithin $RestoreTo $BackupDir) -or
            (Test-PathWithin $RestoreTo ([IO.Path]::GetFullPath([string]$manifest.ProjectRoot)))) {
            throw "Restore destination must be outside the backup and source directories."
        }
        if (Test-Path -LiteralPath $RestoreTo) {
            throw "Restore destination already exists; choose a new empty path: $RestoreTo"
        }

        [void][IO.Directory]::CreateDirectory($RestoreTo)
        Assert-NoReparseAncestors $RestoreTo
        foreach ($entry in $archive.Entries) {
            if ($entry.FullName -eq "__devos_manifest.json") { continue }
            $target = [IO.Path]::GetFullPath((Join-Path $RestoreTo ($entry.FullName.Replace('/', '\'))))
            if (-not (Test-PathWithin $target $RestoreTo)) {
                throw "Archive path escapes restore directory."
            }
            Assert-NoReparseAncestors $target
            [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($target))
            Assert-NoReparseAncestors $target
            $source = $entry.Open()
            $destination = [IO.File]::Open($target, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
            try {
                $source.CopyTo($destination)
            } finally {
                $destination.Dispose()
                $source.Dispose()
            }
        }
        Write-Output $RestoreTo
    } finally {
        $archive.Dispose()
    }
} finally {
    $zipStream.Dispose()
}
