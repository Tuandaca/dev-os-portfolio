# DEV.OS tasks

Allowed states: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE`. Mark `DONE` only after the acceptance check is verified.

| Task ID | Task | Owner | Status | Dependencies | File ownership | Acceptance criteria | Verification results |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-01 | Next.js foundation and agent definitions | Main agent | DONE | None | `src/app/`, configs, `.cursor/agents/`, `AGENTS.md` | App Router shell builds; lint and strict typecheck pass; five agents defined | Previous checkpoint: lint, typecheck, build passed; independent QA checked agent files |
| P1-01 | Audit repository and GitHub identity | Main agent | DONE | P0-01 | Read-only | Confirm local status, authenticated account, repository owner, visibility, branch, and remote URL | `gh auth status` = Tuandaca; `gh repo view` = PUBLIC, main; origin URL matches target |
| P1-02 | Production ignore policy | Main agent | DONE | P1-01 | `.gitignore` | Exclude secrets, dependencies, caches, outputs, databases, logs, and snapshots; keep source/docs/scripts trackable | `git check-ignore --no-index`: 9 excluded and 8 retained samples passed, including actual backup naming |
| P1-03 | Verify remote and safe synchronization | Main agent | IN_PROGRESS | P1-01, P1-02, P1-04, P1-05 | Git metadata and final commit | Inspect target content, staged diff, and secret scan; commit coherent verified changes and push without force | Pending |
| P1-04 | Independent checkpoint backup | Backup subagent | DONE | P1-01 | `scripts/backup-checkpoint.ps1`, `scripts/install-backup-task.ps1`, `scripts/restore-checkpoint.ps1`, `docs/BACKUP.md` | Five-minute task support, 24 successful snapshots, secret exclusions, manifest/integrity, isolated restore, no overlap; safe tests | Windows PowerShell fixture tests passed: create/verify/restore, exclusions, lock, validated retention, junction rejection, tamper refusal, task identity; independent QA found no blocker; no task installed |
| P1-05 | Persistent checkpoint records | Main agent | IN_PROGRESS | P1-01 | `docs/PROGRESS.md`, `docs/TASKS.md` | Required fields, write-before-work and write-after-work updates | Initial Phase 1 IN_PROGRESS records persisted before implementation |
| P1-06 | Final Phase 1 verification | Main agent | IN_PROGRESS | P1-02, P1-04 | Read-only checks and progress records | Source intact; build and focused backup tests pass; schedule state and push status recorded | Build passed; manual `-VerifyOnly` checked archive and file SHA256; final staged diff, secret scan, and push pending |
| P2-01 | Verify portfolio claims | Portfolio engineer | TODO | P1-06 | `src/data/`, `src/types/portfolio.ts` | Evidence before publishing claims or metrics | Not started |
