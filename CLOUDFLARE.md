# Deploy Plan Decoder to plandecoder.com (Wrangler)

The domain must already sit on the **same Cloudflare account** you log into with Wrangler.

## 1. One-time on your computer

```bash
npm install
npx wrangler login
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with real values. Production secrets go in Cloudflare, not in git:

```bash
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put DATABASE_URL
npx wrangler secret put XAI_API_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

Use a Neon **pooled** connection string for `DATABASE_URL`. Run the SQL in `migrations/` on that database once (auth, profiles, billing).

## 2. Deploy

```bash
npm run deploy:cf
```

That builds with `vite.cloudflare.config.ts` and publishes the Worker named `plan-decoder`.

Custom domains in `wrangler.jsonc`:

- `plandecoder.com`
- `www.plandecoder.com`

Wrangler attaches them as Cloudflare **Custom Domains** (SSL is automatic). If attach fails, in the dashboard: Workers → plan-decoder → Settings → Domains & Routes → Custom Domain.

## 3. After deploy

1. Stripe Payment Links → After payment → Redirect to `https://plandecoder.com/paid`
2. Stripe webhook endpoint: `https://plandecoder.com/api/stripe/webhook` (if you set `STRIPE_WEBHOOK_SECRET`)
3. Canonical site is `https://plandecoder.com`. Redirect www → apex in Cloudflare **Redirect Rules** if you want one host only (`__Host-` cookies do not follow www).

## 4. What this Worker needs

| Name | Where | Why |
|---|---|---|
| `VITE_AUTH_ENABLED=true` | wrangler `vars` | Sign-in is required |
| `BETTER_AUTH_URL` | wrangler `vars` | `https://plandecoder.com` |
| `BETTER_AUTH_SECRET` | secret | Session signing |
| `DATABASE_URL` | secret | Neon Postgres (accounts + credits) |
| `XAI_API_KEY` | secret | Practice reports / guide voice |
| `STRIPE_SECRET_KEY` | secret | Optional webhook verify |
| `STRIPE_WEBHOOK_SECRET` | secret | Optional |

News headlines refresh automatically:

1. GitHub Action `.github/workflows/ndis-news.yml` four times a day. Add repo secret **`PD_CRON_SECRET`** with the same value as Worker `BETTER_AUTH_SECRET`.
2. The Worker also re-scrapes if the saved copy is older than 3 hours (first visitor after that).
3. Wrangler cron `20 7,13,19,23 * * *` UTC is registered on deploy.

Without `DATABASE_URL`, accounts will not persist across Worker isolates.

## 5. Dashboard-only upload

If you are not using the CLI from this folder, connect the Git repo in **Workers Builds** and set:

- Build command: `npm run build:cf`
- Deploy command: `npx wrangler deploy`
- Same secrets as above
- Compatibility flag: `nodejs_compat`
