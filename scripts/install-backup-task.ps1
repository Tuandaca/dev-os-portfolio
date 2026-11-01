[CmdletBinding()]
param(
    [ValidateSet("Status", "Install", "Uninstall", "RunOnce")]
    [string]$Action = "Status",
    [ValidateRange(1, 1440)]
    [int]$IntervalMinutes = 5,
    [ValidateRange(1, 10000)]
    [int]$RetentionCount = 24,
    [string]$TaskName = "DEV_OS_Portfolio_AutoBackup",
    [string]$TaskPath = "\",
    [string]$ProjectRoot = "",
    [string]$BackupDir = ""
)

$ErrorActionPreference = "Stop"
$description = "DEV.OS backup checkpoint (managed by scripts/install-backup-task.ps1)"
$scriptPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "backup-checkpoint.ps1"))

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
Assert-NoReparseAncestors $scriptPath
if (-not $TaskPath.StartsWith('\') -or -not $TaskPath.EndsWith('\') -or
    $TaskPath.Contains('..')) {
    throw "TaskPath must be an absolute Task Scheduler folder ending in a backslash."
}
$arguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden ' +
    '-File "' + $scriptPath + '" -ProjectRoot "' + $ProjectRoot +
    '" -BackupDir "' + $BackupDir + '" -RetentionCount ' + $RetentionCount

if ($Action -eq "RunOnce") {
    & $scriptPath -ProjectRoot $ProjectRoot -BackupDir $BackupDir -RetentionCount $RetentionCount
    return
}

if (-not (Get-Command Get-ScheduledTask -ErrorAction SilentlyContinue)) {
    throw "Windows ScheduledTasks cmdlets are unavailable on this host."
}
$existing = Get-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue

switch ($Action) {
    "Status" {
        if (-not $existing) {
            Write-Output "Task '$TaskPath$TaskName' is not installed."
        } else {
            Write-Output "Task '$TaskPath$TaskName' is $($existing.State)."
            Write-Output "Description: $($existing.Description)"
            foreach ($trigger in $existing.Triggers) {
                Write-Output "Repetition interval: $($trigger.Repetition.Interval)"
            }
        }
    }
    "Install" {
        if ($existing) {
            throw "Task '$TaskPath$TaskName' already exists. Inspect it before any explicit uninstall; no task was replaced."
        }
        if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container) -or
            -not (Test-Path -LiteralPath $scriptPath -PathType Leaf)) {
            throw "Project directory or backup script is missing."
        }
        $projectPrefix = $ProjectRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
        $backupPrefix = $BackupDir.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
        if ($BackupDir.StartsWith($projectPrefix, [StringComparison]::OrdinalIgnoreCase) -or
            $ProjectRoot.StartsWith($backupPrefix, [StringComparison]::OrdinalIgnoreCase) -or
            $BackupDir.Equals($ProjectRoot, [StringComparison]::OrdinalIgnoreCase)) {
            throw "Backup directory and project directory must be separate."
        }
        $taskAction = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arguments
        $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) -RepetitionDuration (New-TimeSpan -Days 3650)
        $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
        Register-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -Action $taskAction -Trigger $trigger -Settings $settings -Description $description | Out-Null
        Write-Output "Installed '$TaskPath$TaskName' for every $IntervalMinutes minute(s). Backup destination: $BackupDir"
    }
    "Uninstall" {
        if (-not $existing) {
            Write-Output "Task '$TaskPath$TaskName' is not installed."
            return
        }
        if ($existing.Description -ne $description -or
            $existing.TaskPath -ne $TaskPath -or
            @($existing.Actions).Count -ne 1 -or
            $existing.Actions[0].Execute -ine "powershell.exe" -or
            $existing.Actions[0].Arguments -cne $arguments) {
            throw "Task identity or action does not match this installer; refusing to remove it."
        }
        Unregister-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -Confirm:$false
        Write-Output "Removed '$TaskPath$TaskName'. Existing snapshots were not deleted."
    }
}
