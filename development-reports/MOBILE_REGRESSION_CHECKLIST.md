# Existing workflow regression checklist

Use synthetic demo data in a separate browser profile. Do not clear or replace an existing user's saved records. Record browser, viewport, results and evidence; this checklist is not proof of execution.

1. At 320px, 375px and 390px widths, open Today and Jobs, search a client, and open an active job. Check horizontal overflow, tap targets and bottom navigation.
2. Confirm the compact client card remains at the top. Edit customer, access and pool details; save, reopen and reload to verify persistence.
3. Confirm Call targets the displayed phone number and Navigate targets the displayed address. Check Nav + OMW offers a prefilled message without claiming delivery. Do not place calls or send messages.
4. Exercise existing service navigation, water overlay and dialogs; check keyboard focus, Escape/close and scrolling with the mobile keyboard.
5. Check in, reload and verify the timestamp/timer persists. Add a synthetic before photo, all six readings, service tasks and notes.
6. Configure a synthetic product. Verify blank price remains incomplete, zero is free, fractional quantities bill correctly, and reconfirming replaces a charge.
7. Add a finish photo and check out. Review/download the draft, confirm customer/readings/tasks/notes/charges, and verify it is clearly not a sent invoice.
8. Confirm next-job navigation skips completed visits. Reload and verify saved client, visit, photos and draft data.
9. In the isolated profile only, verify malformed saved data is not overwritten and storage failure is visible. Check Backup exports the retained records.

Automated baseline: npm test and npm run build. Browser/device checks remain pending until executed and documented.
