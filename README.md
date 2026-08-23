# Plan Decoder 1

Practice NDIS evidence and assessment app for [plandecoder.com](https://plandecoder.com).

## Download this folder

Use GitHub → **Code** → **Download ZIP**, or this direct file:

https://github.com/soolonb22/plan-decoder-1/archive/refs/heads/main.zip

## Deploy to Cloudflare

```bash
npm install
npx wrangler login
cp .dev.vars.example .dev.vars
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put DATABASE_URL
npm run deploy:cf
```

Full steps are in `CLOUDFLARE.md`.
