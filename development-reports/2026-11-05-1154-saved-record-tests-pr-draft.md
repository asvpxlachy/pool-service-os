# Draft review request (local only)

Title: Test duplicate saved IDs and visit notes/readings round-trip
Base: codex/autonomous-development-setup (setup instructions are not yet merged)
Head: codex/saved-record-tests-2026-11-05

Duplicate customer IDs and duplicate visit IDs now have focused rejection tests, with valid distinct-ID controls. A version 2 visit test checks notes, draft notes and all six readings after JSON serialization and reload, including zero/blank values and multiline text.

Validation: npm test passed 13/13; npm run build passed; Node v24.14.0. Existing non-fatal module-type warning remains. No runtime, UI, styles, dependencies, or storage changes. No browser/mobile interaction checks performed.

Publishing blocker: no tracked GitHub workflows or deployment configuration found; Vercel list_projects identified pool-service-os, but get_project omits production-branch/Git settings. Cannot verify that publishing will not deploy to production. No push or remote PR attempted. Existing GitHub CLI authentication was previously invalid; it was not retested. When safe publishing is verified, create a draft PR against the setup branch and apply codex and codex-automation labels if available. No merge or release authorization.
