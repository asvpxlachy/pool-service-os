# Development backlog

Only explicitly approved Ready entries may be implemented. Record approval source, narrow scope and acceptance criteria before moving an item to Ready. The owner's 2026-11-04 setup request authorizes workflow setup and one documentation/test-only pilot, not blanket implementation of these priorities.

## Ready for development
None.

## In progress
- MOBILE-01A: Owner approved option 2 in chat on 2026-11-05, after option 1. Started only after TEST-02B passed. Scope: one narrow-phone viewport review of compact client card, Call/Navigate targets and service navigation; isolated synthetic data, screenshot and three useful improvements. No runtime fixes, redesign or installs. Acceptance: exercised behavior, findings and limitations recorded before any publication.

## Awaiting review
- TEST-02B: Owner explicitly selected option 1 on 2026-11-05. Added three synthetic tests for saved notes plus trimmed draft, blank draft handling, and original invoice/completion time preserved after save/reload and repeated checkout. Tests 16/16 and build passed on Node 24. Initial sandbox EPERM resolved by identical build with approved filesystem access; no runtime change or risky fix. User requested checks before live publication; no publish yet.

None.

## Completed
- TEST-02A — More reliable saved job details. **Approved for Thursday 5 November 2026 at 08:00 Australia/Perth.** Approval source: owner replied "1" to the three proposed directions on 2026-11-04. Scope: add focused tests using existing tools and synthetic data to verify duplicate customer/job IDs are rejected and a valid saved visit retains notes/readings when serialized and read back. Test-only changes; no runtime fixes, new dependencies or live release. Acceptance: meaningful new tests, npm test and npm run build pass, plain-English report plus three next-day choices. Maximum 15 minutes including checks/report; wrap up at 12 minutes. Report discovered bugs or unfinished checks rather than extending scope. Broader TEST-02 work remains unapproved. Status 2026-11-05: Awaiting review. Added three focused tests; all 13 tests and production build passed on Node v24.14.0. Runtime unchanged. Branch: codex/saved-record-tests-2026-11-05. Production setting resolved by owner confirmation on 2026-11-05: branch tracking main; domain pool-service-os.vercel.app. Superseding owner authorization 2026-11-05: owner explicitly requested GitHub push/commit/merge and Vercel live release of completed agent changes, without external manual approval. Release in progress; no unrelated proposals approved. See development-reports/2026-11-05-1208-release-verification.md.
- LIMIT-01: Owner authorized a 15-minute daily working limit and three proposed next-day directions on 2026-11-04. Instructions, report template and scheduled prompt updated. No application change or release authorized.
- REPORT-01: Plain-English daily plan, completion summary and Yes/No release decision. Approved by the owner's follow-up request on 2026-11-04. Reporting instructions and daily automation updated; this changes the development workflow only, not the live application.
- SETUP-01: Autonomous development instructions, backlog, report template and native weekday schedule. Approved by owner in 2026-11-04 setup request. Acceptance: baseline checks recorded, protected workflow documented, automation active, report accessible. Branch: codex/autonomous-development-setup.
- TEST-01: Documentation-only regression checklist for existing mobile visit workflow. Approved by the same request (Phase 5). Acceptance: checklist covers protected functionality; no runtime changes; tests and build pass; first report generated.
- RELEASE-2026-11-05: Owner explicitly authorized committing, GitHub upload, merging completed agent changes and Vercel production release in chat. Released TEST-02A, SETUP-01, TEST-01, LIMIT-01 and REPORT-01 via PR #2 https://github.com/asvpxlachy/pool-service-os/pull/2. Main commit 430dce8b3eb102bb27f84be6b9cf6b659bef0737; Vercel dpl_HeXz7ZgpMmXz1oY3Voind8wpD4cj READY with pool-service-os.vercel.app alias. Final tests 13/13 and build passed; app and checked assets HTTP 200. Runtime/UI unchanged; phone interaction checks not performed. This release authorization does not approve future proposals. Historical Awaiting review/publication-blocker text above is superseded by this release outcome.
- INSPECT-01: Repository, architecture, Git state and existing test inventory inspected on 2026-11-04. Findings recorded in the first development report.

## Blocked
The following priorities are proposals awaiting explicit scope approval:
1. VERIFY-01: Verify existing functionality and identify bugs. Proposed next task: execute the synthetic-data mobile regression checklist and document findings; fixes require separate approval.
2. TEST-02: Improve automated test coverage. Propose targeted persisted-record validation and checkout edge-case tests, followed by browser coverage for editing and reload persistence. No new test framework installation approved.
3. MOBILE-01: Review mobile responsiveness and usability at 320/375/390px, keyboard and touch interactions. Report findings before changing approved UI.
4. ORG-01: Identify code organisation improvements without design changes. Propose small boundaries around page state/persistence; no refactor approved.
5. FUTURE-01: Prepare an architecture proposal for validated water chemistry calculations, before/after photo reporting and scheduling. Existing photo capture and route ordering must be preserved; no new features or backend integration approved.

Operational follow-up: GitHub CLI token is invalid; connected GitHub access is checked separately. No production deployment or merge is authorized.

## Choices for Thursday 5 November 2026 (option 1 selected)

Owner selected option 1 by replying "1" on 2026-11-04. Its first step is recorded as Ready task TEST-02A above for tomorrow's scheduled run, not immediate execution. Options 2 and 3 remain proposals. Selection does not authorize merging or making anything live.

1. **More reliable saved job details (recommended)** — Help prevent lost or mixed-up records. First step: add focused automated checks that duplicate customer/job IDs are rejected and a valid saved visit can be read back without losing notes/readings. Use the existing test tools, synthetic data and test-only changes. Run tests/build; report any discovered bug without changing app behavior. Maps to TEST-02.
2. **Easier to use on your phone** — Find awkward buttons or cramped screens. First step: inspect the active job's client card, Call/Navigate buttons and service navigation at a narrow phone size using available browser tools. Report the three most useful improvements, with a screenshot if available. No redesign, code fixes or software installation. Maps to MOBILE-01.
3. **A useful before-and-after service report** — Explore giving customers a clear summary of their pool service. First step: inspect existing photo/readings/notes storage and write a short proposed report layout and the smallest next implementation step. No feature implementation, customer delivery or new services. Maps to FUTURE-01.
## Choices for Friday 6 November 2026 (options 1 and 2 selected early on 2026-11-05)

Report date: 2026-11-05. Owner selected options 1 and 2 early in chat, in that order; exact scopes recorded above. Option 3 remains a proposal.

1. **Safer checkout checks (recommended)** — Protect visit completion. First step: add existing-tool tests that checkout retains saved notes beside a trimmed draft and repeated checkout preserves the original invoice; synthetic data, test-only, run tests/build.
2. **Easier to use on your phone** — Find cramped controls. First step: inspect the client card, Call/Navigate and service navigation at one narrow phone size; report findings, no fixes or software installation.
3. **A useful service report** — Clarify what a customer summary could include. First step: inspect existing photos/readings/notes and propose one report layout; no implementation or delivery.

Which direction would you like: 1, 2 or 3?
