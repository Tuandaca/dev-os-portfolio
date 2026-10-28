# ==============================================================================
# DEV.OS Independent Backup System - Restore Procedure
# ==============================================================================
[CmdletBinding()]
param (
    [string]$SnapshotZip = "",
    [string]$BackupDir = "",
    [string]$RestoreTo = "",
    [switch]$VerifyOnly
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($BackupDir)) {
    $BackupDir = Join-Path $env:USERPROFILE ".dev_os_backups"
}

try {
    # 1. Resolve backup directory
    $BackupDir = [System.IO.Path]::GetFullPath($BackupDir)
    if (-not (Test-Path $BackupDir)) {
        throw "Backup directory not found: $BackupDir"
    }

    # 2. Select Snapshot
    if ([string]::IsNullOrWhiteSpace($SnapshotZip)) {
        $Latest = Get-ChildItem -Path $BackupDir -Filter "dev-os-snapshot_*.zip" | Sort-Object CreationTime -Descending | Select-Object -First 1
        if (-not $Latest) {
            throw "No snapshots found in: $BackupDir"
        }
        $SnapshotZip = $Latest.FullName
    } elseif (-not [System.IO.Path]::IsPathRooted($SnapshotZip)) {
        $Candidate = Join-Path $BackupDir $SnapshotZip
        if (Test-Path $Candidate) {
            $SnapshotZip = $Candidate
        }
    }

    if (-not (Test-Path $SnapshotZip)) {
        throw "Snapshot file not found: $SnapshotZip"
    }

    Write-Host "==> Selected Snapshot: $SnapshotZip" -ForegroundColor Cyan

    # 3. Verify Checksum against stored manifest
    $SnapshotBase = [System.IO.Path]::GetFileNameWithoutExtension($SnapshotZip)
    $ManifestPath = Join-Path $BackupDir "$SnapshotBase.manifest.json"
    $ActualHash = (Get-FileHash -Path $SnapshotZip -Algorithm SHA256).Hash

    if (Test-Path $ManifestPath) {
        $Manifest = Get-Content -Path $ManifestPath -Raw | ConvertFrom-Json
        if ($Manifest.Checksum -and ($Manifest.Checksum -ne $ActualHash)) {
            throw "INTEGRITY CHECK FAILED: Manifest SHA256 ($($Manifest.Checksum)) does not match file SHA256 ($ActualHash)"
        }
        Write-Host "==> Integrity verified: SHA256 match ($ActualHash)" -ForegroundColor Green
        Write-Host "    Original CreatedAt : $($Manifest.CreatedAt)"
        Write-Host "    Original Git Branch: $($Manifest.GitBranch)"
        Write-Host "    Original Git Commit: $($Manifest.GitCommit)"
        Write-Host "    File Count         : $($Manifest.FileCount)"
    } else {
        Write-Host "==> Warning: No companion manifest found; file SHA256: $ActualHash" -ForegroundColor Yellow
    }

    if ($VerifyOnly) {
        Write-Host "==> Verification complete (-VerifyOnly passed)." -ForegroundColor Green
        return
    }

    # 4. Resolve restore destination
    if ([string]::IsNullOrWhiteSpace($RestoreTo)) {
        $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $RestoreTo = Join-Path $env:TEMP "dev_os_restore_$Timestamp"
    }
    $RestoreTo = [System.IO.Path]::GetFullPath($RestoreTo)

    Write-Host "==> Extracting snapshot to isolation directory: $RestoreTo" -ForegroundColor Cyan
    if (-not (Test-Path $RestoreTo)) {
        New-Item -ItemType Directory -Path $RestoreTo -Force | Out-Null
    }

    Expand-Archive -Path $SnapshotZip -DestinationPath $RestoreTo -Force

    Write-Host "==> RESTORE SUCCESSFUL!" -ForegroundColor Green
    Write-Host "    Isolated files are available at: $RestoreTo"
    Write-Host "    You may now inspect and diff the restored files before merging."
    return $RestoreTo
} catch {
    Write-Error "Restore failed: $($_.Exception.Message)"
    exit 1
}
