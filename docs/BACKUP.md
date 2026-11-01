# Independent local checkpoints

These scripts create source snapshots independently of Git. They do not install a scheduled task unless -Action Install is explicitly run. The default backup directory is %USERPROFILE%\.dev_os_backups, outside the project. Keep a separate offsite backup if local disk failure matters; these snapshots are not encrypted.

## What is saved

scripts/backup-checkpoint.ps1 writes a timestamped ZIP and a companion .manifest.json in the backup directory. The archive contains its own manifest with each file's relative path, length, and SHA256. The companion manifest records the archive SHA256. Restore checks both levels before extracting. The file lock prevents overlapping writers to one backup directory. The default retention is **24 successful ZIP and manifest pairs**, scoped to this project's path.

Source, tests, documentation, .cursor/agents, AGENTS.md, and scripts are eligible. The script skips Git metadata, dependencies, Next.js and other build outputs, caches, local databases, logs, backup folders, reparse points, and secret-named files such as .env*, .npmrc, credentials, tokens, private keys, and certificates. Project, backup, snapshot, and restore paths are rejected when an existing ancestor is a junction or symlink. The backup directory cannot be inside the project or contain the project. Retention counts only pairs with matching project root, archive SHA256, and internal manifest. Review source files for embedded secrets before using snapshots; filename filters cannot detect every credential inside ordinary code.

## Run and verify one checkpoint

From the repository root in PowerShell:

    .\scripts\install-backup-task.ps1 -Action RunOnce
    .\scripts\restore-checkpoint.ps1 -VerifyOnly

Use -ProjectRoot and -BackupDir on RunOnce for a different source and external destination. Use -RetentionCount to change the default 24. To verify a specific snapshot, pass its ZIP path with -SnapshotZip and its containing directory with -BackupDir.

## Install, inspect, and remove the Windows task

The default trigger runs every **5 minutes** for ten years. The task runs under the installing user's Windows task context. Task Scheduler's IgnoreNew setting adds a second overlap guard. Registration may require permissions on the current Windows account.

    .\scripts\install-backup-task.ps1 -Action Status
    .\scripts\install-backup-task.ps1 -Action Install -IntervalMinutes 5
    .\scripts\install-backup-task.ps1 -Action Status
    .\scripts\install-backup-task.ps1 -Action Uninstall

Install refuses to replace any existing task with the same name in the selected Task Scheduler folder. Uninstall checks that folder, the installer's exact description, executable, script path, project path, backup path, and retention arguments before removing a task. Removing the task leaves snapshots intact. To use custom values, pass -ProjectRoot, -BackupDir, -RetentionCount, -TaskPath, and/or -TaskName consistently to Install, Status, and Uninstall. The default TaskPath is the Task Scheduler root folder. No scheduled task is installed by running the backup or restore script.

## Restore safely

First verify:

    .\scripts\restore-checkpoint.ps1 -VerifyOnly

Then extract into a **new** directory:

    .\scripts\restore-checkpoint.ps1 -RestoreTo "C:\Temp\dev-os-review"

If no destination is given, a unique directory under %TEMP% is chosen. Restore refuses an existing destination and any destination inside the source or backup directory. It checks archive paths before extraction and never overwrites the live project. Inspect and compare the restored files before copying anything into a working tree. Keep the ZIP and companion manifest together; a missing or mismatched manifest blocks restore.
