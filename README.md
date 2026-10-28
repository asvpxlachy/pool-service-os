# Pool Service OS — Mobile Prototype V0.1

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
