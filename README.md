# Plan Decoder 1

## Cloudflare build (this is what failed)

The error `entry-point file at @tanstack/react-start/server-entry was not found` means Wrangler ran **before** the app was built.

In Cloudflare → this Worker → **Settings** → **Build**:

- **Build command:** `npm run build:cf`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`
- **Build variable:** `VITE_AUTH_ENABLED` = `true`

Then **Retry build**.

The GitHub folder must contain the full app (`src/`, `package.json`, `wrangler.jsonc`). If you only have the small recipe files, unzip **Plan Decoder 1.zip** from Gmail and upload those files into this repo (Code → Add file → Upload files), then retry.
