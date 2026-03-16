## Date
2026-03-16

## Scope
Cloudflare Pages migration follow-up for `thelifespantracker`, focused on missing public Supabase env vars at build time and incorrect Pages routing/config wiring.

## Changes Implemented
- Removed the Cloudflare-specific build hack from [package.json](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/package.json) because Vite already consumes `VITE_*` from the build environment directly.
- Added `.env.production.local` to [/.gitignore](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/.gitignore) to stop generated local env files appearing as noise in git.
- Deleted [wrangler.jsonc](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/wrangler.jsonc) because it was using Workers static-assets config instead of standard Pages static-site config, and it introduced config ambiguity during the migration.
- Added [client/public/_redirects](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/public/_redirects) with `/* /index.html 200` so Cloudflare Pages handles SPA routes without relying on Wrangler config.
- Updated [AuthContext.tsx](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/src/contexts/AuthContext.tsx) to stop auth actions from calling Supabase with placeholder credentials when `VITE_SUPABASE_*` is missing.
- Updated [AuthDialog.tsx](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/client/src/components/auth/AuthDialog.tsx) to disable auth controls and show a deployment-config warning when Supabase client config is missing.

## Validation
- Passed: `VITE_SUPABASE_URL='https://marker-build-test.supabase.co' VITE_SUPABASE_ANON_KEY='marker-anon-key-build-test' npm run build`
- Verified built JS contained the marker values, confirming Vite is inlining build-time `VITE_*` values correctly.
- Verified [dist/public/_redirects](/Users/janm/Documents/Projects/Web%20Projects/thelifespantracker/dist/public/_redirects) contains `/* /index.html 200`.
- Passed: `npm run check`
- Not validated remotely: no Cloudflare deployment or dashboard changes were performed from this session.

## Current Behavior
- The repo now matches a normal Cloudflare Pages static SPA setup: build to `dist/public`, use `_redirects` for client-side routing, and rely on Cloudflare Pages environment variables instead of the removed Wrangler config.
- If the deployed site is still missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` at build time, the auth modal now shows a clear deployment-config message instead of Supabase's raw `Invalid API key` error.
- Local/build validation shows the app wiring is correct when the env vars exist during the build.

## Known Issues / Risks
- Live sign-in on Cloudflare will remain broken until a new production deployment is created after confirming `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in the Cloudflare Pages project for the production environment.
- The previous Obsidian handover note concluded Vite/Cloudflare env injection might be broken; local validation from this session contradicts that. The stronger current hypothesis is deployment config/state, not Vite config.
- No direct verification was done against the live `pages.dev` bundle in this session.

## Next Steps
- In Cloudflare Pages, confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set for the production environment on the `thelifespantracker` project.
- Trigger a fresh production deployment after the env vars are confirmed. If Cloudflare offers a rebuild without cache, use it.
- After deploy, open the built JS bundle or browser console and confirm the placeholder Supabase fallback is no longer being used.
- If auth still fails after redeploy, inspect the live deployment artifact and Pages deployment settings rather than making further Vite changes.
