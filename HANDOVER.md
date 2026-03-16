## Date
2026-03-16

## Scope
Finalize Cloudflare Pages migration for `thelifespantracker`, including auth verification, custom domain cutover, and cleanup of an unused `_redirects` file.

## Changes Implemented
- Removed the Cloudflare-specific build hack from [package.json](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/package.json) because Vite already consumes `VITE_*` from the build environment directly.
- Added `.env.production.local` to [/.gitignore](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/.gitignore) to stop generated local env files appearing as noise in git.
- Deleted [wrangler.jsonc](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/wrangler.jsonc) because it was using Workers static-assets config instead of standard Pages static-site config, and it introduced config ambiguity during the migration.
- Updated [AuthContext.tsx](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/src/contexts/AuthContext.tsx) to stop auth actions from calling Supabase with placeholder credentials when `VITE_SUPABASE_*` is missing.
- Updated [AuthDialog.tsx](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/src/components/auth/AuthDialog.tsx) to disable auth controls and show a deployment-config warning when Supabase client config is missing.
- Removed [client/public/_redirects](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/public/_redirects) after Cloudflare Pages reported the rule as invalid and ignored it; the site routes correctly without the file.

## Validation
- Passed: `VITE_SUPABASE_URL='https://marker-build-test.supabase.co' VITE_SUPABASE_ANON_KEY='marker-anon-key-build-test' npm run build`
- Verified built JS contained the marker values, confirming Vite is inlining build-time `VITE_*` values correctly.
- Passed: `npm run check`
- Verified live Cloudflare bundle served the exact expected Supabase URL and exact anon key with no whitespace.
- Verified sign-in works on Cloudflare after correcting `VITE_SUPABASE_ANON_KEY` in the Pages project.
- Verified `thelifespantracker.com` custom domain is attached to the Cloudflare Pages project and serving the production deployment.
- Pending after this cleanup: redeploy once more to remove the ignored `_redirects` warning from future build logs.

## Current Behavior
- The app is live on Cloudflare Pages and the custom domain `thelifespantracker.com`.
- Supabase auth works on the Cloudflare deployment.
- The repo relies on Cloudflare Pages environment variables at build time and no longer carries Wrangler Pages config or an unused `_redirects` file.

## Known Issues / Risks
- Cloudflare previously accepted a malformed `VITE_SUPABASE_ANON_KEY` containing whitespace; if auth ever regresses with `Invalid API key`, verify the live bundle value first before changing code.
- Removing `_redirects` requires one more deploy before the build log becomes fully clean.

## Next Steps
- Deploy the repo once more so Cloudflare no longer logs the ignored `_redirects` rule.
- Remove `thelifespantracker.com` from the old Vercel project if it has not already been removed.
- Optionally add `www.thelifespantracker.com` in Cloudflare and configure its redirect behavior if that hostname is desired.
