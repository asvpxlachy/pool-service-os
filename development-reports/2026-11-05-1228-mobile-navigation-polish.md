# Daily development report — mobile navigation polish

## Today's plan
Review the current layout and implement small sensible changes explicitly authorized by the owner on 2026-11-05. Prepare larger navigation/gesture changes for owner yes/no decisions. Preserve the approved design and working visit flow.

## What I finished
Clients now shows customer-only cards (name, suburb, pool summary), without job times, service labels or completion ticks. Customers without a scheduled job are included. Today keeps appointment times and completion status.

Profile editing now opens in the existing modal sheet, retaining all fields, photo controls, top/bottom Save and Cancel actions. The large empty photo placeholder is removed; existing photos still display. The sheet has a named Close action, Escape handling, scroll lock and focus return. Saving from the customer directory no longer logs a profile change against an unrelated active job; active-job editing retains its existing activity entry.

Active visits have a named Back to Today button. Main navigation resets the page to the top. The previously small chemicals and pool-details controls now have 44px touch targets; disclosure marker and actions are retained. No blanket spacing compression, design rebuild, swipe or drag behavior was introduced.

Local phone screenshots are in output/playwright/2026-11-05-mobile-navigation-polish: 320-customer-directory.png, 320-profile-overlay.png, 390-customer-directory.png and 390-job-back-navigation.png. They contain synthetic demo data only.

## Checks
Passed: npm test 16/16; npm run build; git diff --check. Node v24.14.0. Tests/build rerun after the final code adjustment. The existing non-fatal module-type warning remains.

Browser checks on the checked local production build in isolated Chrome at 320x568 and 390x844: Clients has no appointments/status, Today keeps jobs, jobless customer visible, search and empty-state feedback, profile Cancel discards edits, Save persists name/phone/address/volume through reload, all job data unchanged after directory profile save, Escape restores focus and scroll, updated Call/Maps targets, Back to Today returns to top, no horizontal overflow. Chemicals and details targets measured 44px; details keeps list-item disclosure styling. No console errors/warnings. Invalid saved record retained byte-for-byte, warning shown and editing blocked.

Limitations: no physical-phone/Safari, on-screen keyboard, camera capture/file upload, external calls/maps/messages or full chemical/checkout/invoice walkthrough performed in this change. Existing model checkout/persistence tests pass. All photo fields/handlers and the storage loading/migration/invalid-record guards remain unchanged. No claim that every existing app path was exercised. One stale browser locator was refreshed; Back then passed. The local server and isolated browser started by this run were stopped after verification.

## Your decision
Make these changes live in the app? Yes / No — this covers only the customer-only Clients list, profile editing sheet with empty photo space removed, Back to Today/top-of-screen navigation, larger service targets, and preventing directory profile edits from affecting unrelated job activity. These changes are checked on the review branch; main/live app remains unchanged pending your answer. No GitHub or Vercel action is needed from the owner after approval.

The three major proposals below are separate yes/no decisions. Approval of a proposal authorizes its narrow first step, not an unrelated feature or an automatic release.

## Technical details (optional reading)
- Manual owner-requested session start 2026-11-05 12:28:42 Australia/Perth; implementation cutoff 12:40:42; deadline 12:43:42. Early checkpoint saved before implementation at 12:30; final time recorded in outcome. No subagents, software/dependency installs or scheduled self-restart.
- Approval source: owner's chat requesting review and small sensible changes, explicit separation of Today jobs/customer profiles, appropriate overlays and major-change yes/no proposals. Exact scope recorded Ready UI-01 before implementation, then In progress; now Awaiting review.
- Isolated branch codex/mobile-navigation-polish from released main 118e86032985710eb7b83d9a93e813a72fff3d5c. Files: app/page.tsx, app/globals.css, DEVELOPMENT_BACKLOG.md and this report. Runtime domain helpers/tests, storage key/schema, app/visit.tsx and Sheet implementation unchanged; existing Sheet reused. No extra TSX components changed.
- Build exit 0; 16 tests passed, 0 failed. Browser used existing cached Playwright CLI 0.1.23 + installed Chrome, isolated session pool-ui-polish-20261105 against http://127.0.0.1:3100. No personal browser profile or real customer data accessed. Screenshot artifacts ignored/uncommitted. Generated next-env.d.ts restored before commit. Local app server stopped after checks.
- Source diff reviewed for regressions/secrets/unrelated edits. Ready UI scope phrase about job activity is implemented as: preserve logging only when editing from the matching active job; directory saves do not mutate any job. Browser compared full job arrays before/after and confirmed identical.
- Publishing a codex branch may create a Vercel preview; production tracks main. Draft PR only; no merge, production deployment or auto-merge authorized by this general review request. Exact commit/PR recorded in outcome.

## Regression and security review
Compact editable visit client card, Call/Navigate, service flow, photo controls, manual route ordering, model billing/checkout and localStorage version 2/invalid-record safeguards preserved. No runtime chemistry rules, customer delivery, new data model, dependencies or real records introduced. Synthetic-only browser fixtures; no credentials, env files or browser storage committed. Ready work does not include the major proposals below.

## Choose tomorrow's direction — proposed major changes
For Friday 6 November 2026. All three remain proposals awaiting owner yes/no; none is Ready.

1. **Press-and-hold route ordering (recommended)** — Reorder Schedule jobs by touch instead of relying only on arrows. First step: implement a hold-to-drag handle for the current route, keep arrow/keyboard fallback, and verify the changed order survives reload using synthetic phone data. No new calendar or travel optimisation.
2. **Swipe between main screens** — Move between sections more fluidly. First step: support Today-to-Clients swipes only, ignoring gestures on form fields and inside overlays and distinguishing horizontal swipes from vertical scrolling. Preserve the existing tab buttons; test accidental-swipe prevention before extending to other screens.
3. **Read-only customer overview** — Browse a profile without immediately editing it. First step: show saved contact, access and pool details in an overview sheet with an explicit Edit action; no appointments/status on the initial view and no new storage fields or history system.

Please reply Yes / No for each proposal (1, 2 and 3). Which direction would you like first: 1, 2 or 3? A clear selection approves only its stated first step, not going live.
