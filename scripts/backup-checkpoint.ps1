# ==============================================================================
# DEV.OS Independent Backup System - Checkpoint Creator
# Layer C: Independent Local Snapshots
# ==============================================================================
[CmdletBinding()]
param (
    [string]$ProjectRoot = "",
    [string]$BackupDir = "",
    [int]$RetentionCount = 24
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    if ($PSScriptRoot) {
        $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
    } else {
        $ProjectRoot = (Get-Location).Path
    }
}

if ([string]::IsNullOrWhiteSpace($BackupDir)) {
    $BackupDir = Join-Path $env:USERPROFILE ".dev_os_backups"
}

try {
    # 1. Resolve paths
    $ProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
    if (-not (Test-Path $ProjectRoot)) {
        throw "Project root does not exist: $ProjectRoot"
    }

    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    $BackupDir = [System.IO.Path]::GetFullPath($BackupDir)

    $LogFile = Join-Path $BackupDir "backup.log"
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $SnapshotName = "dev-os-snapshot_$Timestamp"
    $TempStagingDir = Join-Path $env:TEMP "dev_os_staging_$Timestamp"
    $ZipPath = Join-Path $BackupDir "$SnapshotName.zip"

    $logMsg = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting snapshot for: $ProjectRoot"
    Add-Content -Path $LogFile -Value $logMsg

    # 2. Excluded directory patterns
    $ExcludeDirs = @(
        "node_modules",
        ".next",
        "out",
        "build",
        "dist",
        "coverage",
        ".git",
        "temp_restore",
        "_restore_test",
        ".backups",
        "backups"
    )

    # 3. Excluded file patterns (security & secrets)
    $ExcludeFiles = @(
        ".env*",
        "*.pem",
        "*.key",
        "*.cert",
        "*.pfx",
        "credentials*",
        "*.log"
    )

    # 4. Create staging directory
    New-Item -ItemType Directory -Path $TempStagingDir -Force | Out-Null

    # 5. Copy filtered files to staging
    $AllFiles = Get-ChildItem -Path $ProjectRoot -Recurse -File -Force

    $CopiedCount = 0
    foreach ($File in $AllFiles) {
        $RelPath = $File.FullName.Substring($ProjectRoot.Length).TrimStart("\", "/")
        $Parts = $RelPath.Split([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
        
        # Check excluded directories
        $Skip = $false
        foreach ($Part in $Parts) {
            if ($ExcludeDirs -contains $Part) {
                $Skip = $true
                break
            }
        }
        if ($Skip) { continue }

        # Check excluded file patterns
        foreach ($Pattern in $ExcludeFiles) {
            if ($File.Name -like $Pattern) {
                # Allow .env.example
                if ($File.Name -ne ".env.example") {
                    $Skip = $true
                    break
                }
            }
        }
        if ($Skip) { continue }

        $DestPath = Join-Path $TempStagingDir $RelPath
        $DestDir = [System.IO.Path]::GetDirectoryName($DestPath)
        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }

        Copy-Item -Path $File.FullName -Destination $DestPath -Force
        $CopiedCount++
    }

    # 6. Gather Git metadata if available
    $GitCommit = "unknown"
    $GitBranch = "unknown"
    try {
        $GitCommit = (git -C $ProjectRoot rev-parse HEAD 2>$null)
        if (-not $GitCommit) { $GitCommit = "none" }
        $GitBranch = (git -C $ProjectRoot rev-parse --abbrev-ref HEAD 2>$null)
        if (-not $GitBranch) { $GitBranch = "none" }
    } catch {
        # Git metadata optional
    }

    # 7. Write snapshot manifest
    $Manifest = [PSCustomObject]@{
        SnapshotName = $SnapshotName
        CreatedAt    = (Get-Date).ToString("o")
        ProjectRoot  = $ProjectRoot
        GitBranch    = $GitBranch
        GitCommit    = $GitCommit
        FileCount    = $CopiedCount
        Checksum     = ""
    }

    $ManifestJsonPath = Join-Path $TempStagingDir "manifest.json"
    $Manifest | ConvertTo-Json -Depth 4 | Set-Content -Path $ManifestJsonPath -Encoding UTF8

    # 8. Compress staging folder to ZIP
    if (Test-Path $ZipPath) {
        Remove-Item -Path $ZipPath -Force
    }
    Compress-Archive -Path "$TempStagingDir\*" -DestinationPath $ZipPath -CompressionLevel Optimal

    # 9. Calculate SHA256 of the ZIP snapshot
    $Hash = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash
    $Manifest.Checksum = $Hash

    # Update manifest in backup root for quick indexing
    $IndexManifestPath = Join-Path $BackupDir "$SnapshotName.manifest.json"
    $Manifest | ConvertTo-Json -Depth 4 | Set-Content -Path $IndexManifestPath -Encoding UTF8

    # Cleanup staging directory
    Remove-Item -Path $TempStagingDir -Recurse -Force -ErrorAction SilentlyContinue

    # 10. Apply Retention Policy
    $AllSnapshots = Get-ChildItem -Path $BackupDir -Filter "dev-os-snapshot_*.zip" | Sort-Object CreationTime -Descending
    if ($AllSnapshots.Count -gt $RetentionCount) {
        $OldSnapshots = $AllSnapshots | Select-Object -Skip $RetentionCount
        foreach ($Old in $OldSnapshots) {
            $OldBase = [System.IO.Path]::GetFileNameWithoutExtension($Old.FullName)
            $OldManifest = Join-Path $BackupDir "$OldBase.manifest.json"
            Remove-Item -Path $Old.FullName -Force -ErrorAction SilentlyContinue
            if (Test-Path $OldManifest) {
                Remove-Item -Path $OldManifest -Force -ErrorAction SilentlyContinue
            }
            Add-Content -Path $LogFile -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Pruned old snapshot: $($Old.Name)"
        }
    }

    $SuccessMsg = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] SUCCESS: Created snapshot $SnapshotName.zip ($CopiedCount files, SHA256: $Hash)"
    Add-Content -Path $LogFile -Value $SuccessMsg
    Write-Output $SuccessMsg
    return $ZipPath
} catch {
    $ErrMsg = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $($_.Exception.Message)"
    if (Test-Path $BackupDir) {
        Add-Content -Path $LogFile -Value $ErrMsg
    }
    Write-Error $_.Exception.Message
    exit 1
}
