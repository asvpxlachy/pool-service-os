# Development backlog

Only explicitly approved Ready entries may be implemented. Record approval source, narrow scope and acceptance criteria before moving an item to Ready. The owner's 2026-11-04 setup request authorizes workflow setup and one documentation/test-only pilot, not blanket implementation of these priorities.

## Ready for development
None.

## In progress
None.

## Awaiting review
- UI-01 — Small mobile layout/navigation polish. Ready approval: owner's 2026-11-05 request to review layout and "make changes to small sensible items", explicitly separating Today jobs from customer profiles and using overlays where appropriate. Exact scope: customer-only directory cards with no appointment times/completion state, opening the existing profile editor; reuse existing Sheet for that editor while preserving every field/save/cancel/photo action; remove only the empty photo placeholder; add Back to Today on active visits and reset scroll on main navigation; increase the two previously measured small service targets to 44px. Fix unrelated-visit activity logging when a profile is edited from directory by associating profile activity only with that customer's jobs. No new records/schema, redesign, gesture implementation or dependency changes. Acceptance: tests/build, mobile browser checks for directory versus Today, editor save/cancel/Escape/focus/reload, job navigation and contact links, no overflow, no unrelated job change, storage guard retained. Major long-press reorder, cross-screen swipes and broader profile/navigation design remain proposals requiring owner yes/no. Plan approval is not production release permission.
Started 2026-11-05 12:30. Ready approval recorded before work.
Status: UI-01 checked, 16 tests/build and Chrome phone scenarios passed; proposed small app changes awaiting exact owner release Yes/No. Major gestures remain unapproved.

- MOBILE-01A: Owner-selected step 2 completed after TEST-02B passed. Isolated Chrome 320x568 review exercised client editing/reload, correct Call/Maps link targets and service/bottom navigation with synthetic data. No overflow or console errors in exercised screens. Three usability proposals recorded in the 2026-11-05-1214 report; no fixes or redesign. Awaiting owner acceptance of findings.

- TEST-02B: Owner explicitly selected option 1 on 2026-11-05. Added three synthetic tests for saved notes plus trimmed draft, blank draft handling, and original invoice/completion time preserved after save/reload and repeated checkout. Tests 16/16 and build passed on Node 24. Initial sandbox EPERM resolved by identical build with approved filesystem access; no runtime change or risky fix. Both steps checked before publication; PR #3 merged to main 118e86032985710eb7b83d9a93e813a72fff3d5c and production dpl_AfhSeVDDKt53vGCkEPWJFTz3oySG READY on pool-service-os.vercel.app. App and three assets HTTP 200 after deployment. Test-only/report release; findings await owner acceptance.


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

Operational note: prior GitHub CLI token issue remains untested; connected GitHub tools and Git Credential Manager upload succeeded for owner-authorized releases #2 and #3. Future app fixes/releases still need relevant owner authorization.

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
## Next choices for Friday 6 November 2026 — report 2026-11-05 12:14
Owner selected earlier options 1 and 2 in chat for immediate sequential work; both scopes are complete and checked. These replacement options remain proposals, not Ready. No selection yet.

1. **Name the Back button (recommended)** — Help screen-reader users leave client editing. First step: add an accessible name to the existing profile Back button only, preserving its design/action; verify name/navigation in phone browser, then tests/build.
2. **Easier chemical button taps** — Make the smaller chemical action easier to touch. First step: increase only the Add / adjust chemicals hit area to at least 44px high without changing label/action; check 320px fit, then tests/build.
3. **Easier pool-detail taps** — Make pool details easier to expand. First step: increase only the Pool details & visit history summary hit area to at least 44px high; verify expand/collapse at 320px, then tests/build.

Which direction would you like: 1, 2 or 3? Selection approves only the stated first step, not release.
## Major change proposals — report 2026-11-05 12:28, next working day 2026-11-06
These supersede the previous small-touch-target choices, now covered by owner-approved UI-01. Owner asked for major changes as Yes/No proposals. All remain unapproved, not Ready. Approving a plan does not approve its release.

1. **Press-and-hold route ordering (recommended)** — Reorder Schedule jobs by touch. First step: add a hold-to-drag handle for the current route; retain arrow/keyboard fallback and verify order persists after reload with synthetic phone data. No calendar/travel optimisation.
2. **Swipe between main screens** — Fluid movement between sections. First step: Today-to-Clients swipes only, ignoring form fields/overlays and distinguishing horizontal from vertical scrolling; preserve tab buttons and test accidental-swipes before expanding.
3. **Read-only customer overview** — Browse without editing immediately. First step: overview sheet of existing saved contact/access/pool details with an Edit action; no appointments/status initially, new storage fields or history system.

Reply Yes / No for each (1, 2 and 3). Which direction would you like first: 1, 2 or 3? Selection approves only the stated first step, not release.
