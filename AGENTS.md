# Pool Service OS agent instructions

## Scope and approvals
- Preserve approved UI designs and existing functionality. Do not rebuild or redesign the application.
- Maintain the compact editable client card at the top of the active job screen. Preserve client editing, Call and Navigate actions, service tabs/navigation, and localStorage persistence (including existing records and migration safeguards).
- Follow mobile-first design. Make small, incremental changes; never overwrite working functionality unnecessarily.
- Implement only tasks explicitly approved by the owner and marked Ready in DEVELOPMENT_BACKLOG.md. A priority, suggestion, or proposal is not implementation approval. Record approval source, exact scope and acceptance criteria. Never approve your own proposals.
- Never merge into main, enable auto-merge, or deploy to production without explicit owner approval. Never delete functionality, force-push, reset user work, or install additional software without approval.
- Use synthetic data only. Never introduce real customer data, expose credentials, or commit environment files or browser records.

## Daily workflow
Owner communication must be plain English, short and about what changes in the app. Do not require the owner to read code, GitHub or technical reports. Keep technical evidence in the report appendix.
- At the start, state "Today's plan" in one or two sentences describing the owner's selected direction and its approved first step. Approval to prepare work is distinct from approval to release it.
- At the end, state "What I finished", "Checks" (passed/failed and any untested areas in ordinary language), and "Your decision". Show a screenshot or preview when useful for visible changes.
- Ask "Make these changes live in the app? Yes / No" only when specific app changes are complete, checked and ready to release. Name exactly which changes the question covers and retain the exact branch/commit in the technical appendix. If nothing affects the app, say "Nothing to make live today." If checks failed, say "Not ready to go live" and explain why simply.
- A clear Yes in reply to that specific release question authorizes merging and production deployment of only those reviewed changes. Handle the technical steps for the owner, verify the released app and report success or failure. Do not ask again for the same authorization unless the changes or material risks change. A No or no reply means leave the live app unchanged. Never interpret approval of a plan, this reporting workflow, or an ambiguous Yes as release permission.
- End every daily report, including blocked/no-work reports, with exactly three numbered directions for the following working day. Use plain-English titles, benefits and a narrowly defined first step that fits the daily limit. Mark one recommended option. Persist the options and report date in DEVELOPMENT_BACKLOG.md. Ask the owner to choose 1, 2 or 3. A clear selection approves only that option's stated first step; record the selection and move it to Ready. It does not approve an entire feature, unrelated fixes or going live. Never choose on the owner's behalf. If no selection arrives, leave implementation untouched, do only a brief read-only review and avoid repeatedly investigating unchanged findings.

## Daily working limit
- Maximum planned session: 15 minutes total, including inspection, checks and reporting. Record start time and deadline at the beginning; check elapsed time between operations. Stop sooner when the selected step is complete, blocked or requires a decision.
- At 12 minutes stop implementation and use the remaining 3 minutes to save progress, record checks and write the report with three options. Do not start long-running operations that cannot reasonably finish before the deadline. Bound tool waits by remaining time where possible. At the deadline, stop initiating work; cancel only processes started by this run when safe and record any unavoidable overrun.
- This is an agent-enforced working limit, not a scheduler-enforced kill switch or a guaranteed usage/credit cap. A tool call can overrun and account limits can interrupt before reporting. Save a short report/checkpoint early and update it as work progresses. Record actual elapsed time and unfinished checks honestly; unfinished or unverified changes are not ready to go live.
- One scheduled session per working day: no self-restarts, extra agents, retry loops or waiting for allowance resets. Do not purchase credits or switch to paid API billing. Never claim to know remaining account allowance unless actually available.

1. Read this file, DEVELOPMENT_BACKLOG.md and recent development reports in the canonical project directory. Inspect git status, branches/worktrees and recent commits.
2. Select one small approved Ready task. If none exists, perform a read-only code quality review and report proposals; do not change application code. Reports are permitted even in read-only review mode.
3. Use an isolated codex/<task> feature branch/worktree. Do not alter an occupied checkout or include unrelated dirty files. Do not repeat a task already awaiting review. Until setup is merged with approval, read these instructions from the canonical checkout and use its committed setup branch as the workflow baseline; never silently lose these instructions by starting from main.
4. Record In progress, implement only the agreed scope, run relevant checks plus npm test and npm run build after code changes. Node 24 is the documented runtime. Do not install dependencies or software automatically if unavailable; report the blocker.
5. Review the diff for regressions, security issues, secrets and unrelated edits. Do not claim browser/mobile checks were performed unless actually exercised.
6. If a check fails, capture the failure and stop implementation; do not repeatedly try risky changes or commit failing implementation as successful.
7. Commit successful changes to the feature branch using explicit file paths. Prepare a draft pull request when authentication/permissions are available; never merge automatically. Check that publishing cannot deploy to production before pushing. If unavailable, save a local PR title/body and report the blocker.
8. Move work to Awaiting review; only mark owner-accepted implementation Completed. Document completed work, outstanding issues and recommended next steps.
9. Write a report using development-reports/TEMPLATE.md, named YYYY-MM-DD-HHmm-<task>.md in Australia/Perth time. Always leave a copy in C:/Users/lachy/OneDrive/Documents/ChatGPT/Pool Service OS/development-reports so the owner can find it, including when using another worktree. Do not overwrite previous reports. Include branch, commit and PR link or exact blocker. Surface the report path in the scheduled run result.

## Architecture and verification
- app/page.tsx: client-side application state, navigation, client editing and localStorage loading/saving.
- app/visit.tsx: continuous active visit, check-in/timer, photos, readings, chemicals, checkout and invoice drafts.
- app/visit-model.ts: domain types, saved-record validation, billing and checkout helpers.
- app/sheet.tsx: dialog sheet; app/globals.css: approved responsive styling.
- tests/visit-model.test.mjs: Node built-in domain tests. No automated browser suite currently exists.
- Preserve the pool-os-v01 storage key, version 2 compatibility and protection against overwriting invalid records.
- Water chemistry dosing requires sourced, independently validated rules; do not invent calculations. Before/after capture and manual job ordering already exist; future reporting/scheduling extensions remain proposals.
