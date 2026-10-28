# ==============================================================================
# DEV.OS Independent Backup System - Task Scheduler Installer
# ==============================================================================
[CmdletBinding()]
param (
    [ValidateSet("Install", "Uninstall", "Status", "RunOnce")]
    [string]$Action = "Status",
    [int]$IntervalMinutes = 5,
    [string]$TaskName = "DEV_OS_Portfolio_AutoBackup",
    [string]$ProjectRoot = "",
    [string]$BackupDir = ""
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

$ScriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "backup-checkpoint.ps1"
if (-not (Test-Path $ScriptPath)) {
    $ScriptPath = Join-Path $ProjectRoot "scripts\backup-checkpoint.ps1"
}

function Get-ScheduledTaskStatus {
    param ([string]$Name)
    $task = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
    return $task
}

switch ($Action) {
    "Status" {
        $task = Get-ScheduledTaskStatus -Name $TaskName
        if ($task) {
            Write-Host "Task '$TaskName' exists." -ForegroundColor Green
            Write-Host "State: $($task.State)"
            Write-Host "Triggers:"
            $task.Triggers | ForEach-Object { Write-Host " - Repetition Interval: $($_.Repetition.Interval)" }
        } else {
            Write-Host "Task '$TaskName' is currently NOT installed." -ForegroundColor Yellow
            Write-Host "To install, execute:"
            Write-Host "  .\scripts\install-backup-task.ps1 -Action Install -IntervalMinutes 5" -ForegroundColor Cyan
        }
    }

    "RunOnce" {
        Write-Host "Executing single test backup..." -ForegroundColor Cyan
        & "$ScriptPath" -ProjectRoot $ProjectRoot -BackupDir $BackupDir
    }

    "Install" {
        $existing = Get-ScheduledTaskStatus -Name $TaskName
        if ($existing) {
            Write-Host "Task '$TaskName' already exists. Removing previous registration..." -ForegroundColor Yellow
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        }

        $ActionCmd = "PowerShell.exe"
        $Arguments = "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File `"$ScriptPath`" -ProjectRoot `"$ProjectRoot`" -BackupDir `"$BackupDir`""
        
        $TaskAction = New-ScheduledTaskAction -Execute $ActionCmd -Argument $Arguments
        $TaskTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) -RepetitionDuration ([TimeSpan]::MaxValue)
        $TaskSettings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

        Register-ScheduledTask -TaskName $TaskName -Action $TaskAction -Trigger $TaskTrigger -Settings $TaskSettings -Description "DEV.OS Autonomous Independent Snapshot Task (Every $IntervalMinutes min)" | Out-Null

        Write-Host "Successfully registered scheduled task '$TaskName'!" -ForegroundColor Green
        Write-Host "Interval: Every $IntervalMinutes minutes"
        Write-Host "Backup Destination: $BackupDir"
    }

    "Uninstall" {
        $existing = Get-ScheduledTaskStatus -Name $TaskName
        if ($existing) {
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
            Write-Host "Scheduled task '$TaskName' has been removed." -ForegroundColor Green
        } else {
            Write-Host "Task '$TaskName' was not found." -ForegroundColor Yellow
        }
    }
}
