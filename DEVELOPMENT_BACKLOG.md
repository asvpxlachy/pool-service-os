# Development backlog

Only explicitly approved Ready entries may be implemented. Record approval source, narrow scope and acceptance criteria before moving an item to Ready. The owner's 2026-11-04 setup request authorizes workflow setup and one documentation/test-only pilot, not blanket implementation of these priorities.

## Ready for development
No approved implementation tasks remain. Daily runs should perform read-only review and report proposals until the owner approves a specific task.

## In progress
None.

## Awaiting review
- SETUP-01: Autonomous development instructions, backlog, report template and native weekday schedule. Approved by owner in 2026-11-04 setup request. Acceptance: baseline checks recorded, protected workflow documented, automation active, report accessible. Branch: codex/autonomous-development-setup.
- TEST-01: Documentation-only regression checklist for existing mobile visit workflow. Approved by the same request (Phase 5). Acceptance: checklist covers protected functionality; no runtime changes; tests and build pass; first report generated.

## Completed
- INSPECT-01: Repository, architecture, Git state and existing test inventory inspected on 2026-11-04. Findings recorded in the first development report.

## Blocked
The following priorities are proposals awaiting explicit scope approval:
1. VERIFY-01: Verify existing functionality and identify bugs. Proposed next task: execute the synthetic-data mobile regression checklist and document findings; fixes require separate approval.
2. TEST-02: Improve automated test coverage. Propose targeted persisted-record validation and checkout edge-case tests, followed by browser coverage for editing and reload persistence. No new test framework installation approved.
3. MOBILE-01: Review mobile responsiveness and usability at 320/375/390px, keyboard and touch interactions. Report findings before changing approved UI.
4. ORG-01: Identify code organisation improvements without design changes. Propose small boundaries around page state/persistence; no refactor approved.
5. FUTURE-01: Prepare an architecture proposal for validated water chemistry calculations, before/after photo reporting and scheduling. Existing photo capture and route ordering must be preserved; no new features or backend integration approved.

Operational follow-up: GitHub CLI token is invalid; connected GitHub access is checked separately. No production deployment or merge is authorized.
