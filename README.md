# Pool Service OS — Mobile Prototype V0.2

## Continuous visit pilot

The active job is now one continuous page: customer/access details, separate Call / Navigate / Nav + OMW actions, manual check-in and timer, before photo, water-test overlay, chemical billing, equipment/service checklist, finish photo, checkout and an invoice draft. Next job follows route order, skipping completed visits.

- Default service fee: $120 including GST, adjustable for the visit.
- Products have configurable ingredient, strength/formulation, quantity/billing unit and GST-inclusive price. Blank prices remain explicitly incomplete; zero is an intentional free charge.
- Actual chemical quantities can be adjusted. Reconfirming a product replaces its existing visit charge, rather than adding another line. Prices and product details are captured on the visit so future catalogue edits do not rewrite older bills.
- Checkout captures customer details, all six readings, tasks, notes and charges in a draft. Charges can still be corrected in that draft. Download is a plain-text draft, not a sent invoice or a tax invoice.
- Existing `pool-os-v01` records are retained and extended to version 2. Invalid records are not overwritten. Save failures are visible, and Backup exports local records for recovery.
- Before/after photos are resized to JPEG before browser storage. Notes save as you type. Check-in timestamps survive reloads.

### What is not connected yet

- **Dosing:** no estimated doses are generated. Product setup and manual quantities are available; sourced, independently validated calculation rules are still required. pH dosing must not be approximated from pH difference alone.
- **SMS:** Nav + OMW offers a prefilled phone message and a navigation link. The technician sends the message; poolOS cannot confirm delivery. No automatic SMS service is configured.
- **Invoices/Xero:** drafts only. No customer invoice delivery, accounting sync or payment collection.
- **Offline:** editing works in an already loaded page without reception, but offline launch/reload, cloud sync and conflict handling are not implemented. Browser storage is not a backup service.
- **Arrival:** check-in is manual. No background location or automatic arrival detection.

### Verification

Use Node 24 (matching deployment). Run `npm test` for migration, price/quantity validation, rounding, duplicate prevention, checkout and snapshot checks. Run `npm run build` before committing.

iPhone pilot: open a job, check in, capture a before photo, enter readings, configure a test product, confirm and adjust its quantity, complete checklist/notes, capture a finish photo, check out, review/download the draft and continue to the next job. Verify records after reload. Test with sample data alongside ServiceM8.

A mobile-first Next.js proof of concept based on the approved ChatGPT interface. Includes Today, Jobs, permanent editable client/pool cards, pool photos, chemistry entries, activity history, service reports, customer search and manual schedule ordering.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Upload the **contents** of this folder to the root of a private GitHub repository. Do not upload the ZIP itself as the application source.
2. In Vercel, select Add New → Project → Import the GitHub repository.
3. Framework preset: Next.js. Keep default build settings. Deploy.
4. Open the resulting HTTPS URL in iPhone Safari → Share → Add to Home Screen.

**iPhone-only upload tip:** GitHub's web uploader works with individual files and folders, but ZIP archives are not automatically unpacked. Extract this ZIP in the iPhone Files app first, then upload the extracted source files, preserving `app/` and `public/` folder paths. For a less fiddly approach, use GitHub's browser editor at `github.dev` or a compatible mobile Git client.

## Important limitations

- **Demo only**. All names, addresses and phone numbers are fictional.
- Data persists via browser localStorage on the same device/browser. It is **not synchronised** across devices and may be cleared by the browser. Safari and the installed Home Screen app may have separate storage.
- Pool photos are saved as small local data URLs, not uploaded to cloud storage. Storage is limited; do not use sensitive real customer data.
- No authentication, tenant isolation, database, real SMS, real invoices, actual route optimisation, offline caching or validated dosing calculations.
- The installable manifest is included, but full offline PWA support is not yet implemented.
- This is a close reimplementation of the approved interaction patterns, not guaranteed pixel-for-pixel identical to ChatGPT's UI renderer.

## Next iteration

Supabase database/auth/storage, real camera workflow, improved customer portfolios, job-specific photos, report generation and offline-first syncing.
