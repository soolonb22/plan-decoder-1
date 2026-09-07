# Fallon: drop in the September 2026 provider checklist PDF

The 9-page PDF (`Plan-Decoder-provider-checklist.pdf`, dated 8 September 2026) was attached to the cloud-agent run, but the bytes did not persist in the agent workspace. Recreating the PDF was out of scope.

There is **no older checklist** in `public/brand/` to replace (only story images). The live URL currently 404s.

## What to add

Save the real PDF here (exact name, including capitals and hyphens):

```
public/brand/Plan-Decoder-provider-checklist.pdf
```

After merge and Cloudflare deploy, it will be served at:

https://www.plandecoder.com/brand/Plan-Decoder-provider-checklist.pdf

Vite copies `public/` to the site root. No other site content needs to change.

## GitHub web UI (fastest)

1. Open this pull request.
2. **Add file** → **Upload files**.
3. Set the path to `public/brand/Plan-Decoder-provider-checklist.pdf`.
4. Commit to the branch `cursor/add-provider-checklist-pdf-308c`.
5. Delete this instruction file in the same commit if you like.
6. Merge when the PDF is on the branch.

## Local git

```bash
git checkout cursor/add-provider-checklist-pdf-308c
mkdir -p public/brand
cp /path/to/Plan-Decoder-provider-checklist.pdf public/brand/Plan-Decoder-provider-checklist.pdf
git add public/brand/Plan-Decoder-provider-checklist.pdf
git rm .github/FALLON-DROP-IN-PROVIDER-CHECKLIST.md
git commit -m "Add September 2026 Plan Decoder provider checklist PDF."
git push
```
