# DEV.OS project instructions

- At the start of each session, read `docs/PROGRESS.md` and `docs/TASKS.md` when available. Inspect the working tree before editing.
- Use actual Cursor subagent delegation, not roleplay. Delegate only independent, worthwhile tasks with nonoverlapping file ownership. The main agent coordinates at most four subagents: **five concurrent agents total, including the main agent**.
- The architect is the primary coordination role among the custom agents: it plans architecture, task boundaries, and suggested assignments. It must not delegate to itself or ask another agent to create a new architect. Only the main agent spawns agents, assigns work, and integrates results.
- Preserve existing code and user changes. Agree on file ownership before parallel edits; use isolated worktrees for independent Git work where appropriate.
- Keep concise checkpoints in `docs/PROGRESS.md` and task states in `docs/TASKS.md`. Record verified results and blockers without inventing completion evidence.
- Verify changes before marking tasks complete. Use targeted tests, a production build for app changes, and concise handoffs with files changed and checks run. Avoid unnecessary token consumption.
- Never fabricate portfolio facts, metrics, employers, dates, or project outcomes. Treat legacy data as unverified until backed by source evidence or the owner.
- Before any subagent implements owner-specific content, read `src/content/profile.ts`, `src/content/experience.ts`, `src/content/skills.ts`, `src/content/projects.ts`, and `docs/CONTENT_SOURCE.md` when present. Use those structured sources; do not repeatedly extract the CV in each subagent. Keep CV-only details distinct from repository-verified details.
- Never push to an unverified remote or deploy without authorization. Inspect staged diffs and scan for secrets before any authorized commit or push; keep changes recoverable and avoid force pushes.
- Keep work within the active milestone. Add the terminal, 3D scene, OS behavior, and case studies only when those later tasks are assigned.
