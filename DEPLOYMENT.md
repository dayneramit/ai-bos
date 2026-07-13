# Deploying Day Neramit Document Studio (Vercel + Netlify)

This project can't be deployed *for* you from a sandbox with no network
access — Vercel/Netlify auto-deploy requires connecting **your** GitHub
account to **your** hosting account. Below is the exact, one-time setup;
after this, every `git push` deploys automatically on both platforms.

## 0. Push this project to GitHub (once)

```bash
cd ai-bos-main
git init                      # skip if already a git repo
git add -A
git commit -m "feat: Day Neramit document studio (quotation, receipt, warranty) + PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 1. Vercel (primary target, per AI-STUDIO-PROJECT-RULES.md)

1. Go to https://vercel.com/new and import the GitHub repo.
2. When asked for **Root Directory**, choose `apps/day-neramit`.
3. Framework preset: Next.js (auto-detected). Leave build/install
   commands as-is — `apps/day-neramit/vercel.json` already pins them to
   run through the pnpm workspace correctly.
4. Add environment variables (Project Settings → Environment Variables)
   from `apps/day-neramit/.env.example` — only needed once you connect
   Firebase; the app runs fully on localStorage without them.
5. Click **Deploy**. From now on, every push to `main` auto-deploys to
   production, and every PR/branch gets a preview deployment.

## 2. Netlify

1. Go to https://app.netlify.com/start and connect the same GitHub repo.
2. If prompted for a base directory, set it to `apps/day-neramit` — both
   `netlify.toml` (repo root) and `apps/day-neramit/netlify.toml` already
   declare `base = "apps/day-neramit"`, `publish = "apps/day-neramit/.next"`,
   and use the official `@netlify/plugin-nextjs` runtime, so Netlify
   should auto-configure correctly either way.
3. Add the same environment variables under **Site settings →
   Environment variables**.
4. Click **Deploy site**. Every push to the connected branch
   auto-deploys afterward — no extra CI file needed.

## 3. Custom domain (optional, either platform)

Both Vercel and Netlify support adding a custom domain under
**Project/Site settings → Domains** — point your domain's DNS
(A/CNAME record, as instructed by the dashboard) and both platforms
issue free HTTPS certificates automatically.

## 4. PWA install check (after first deploy)

- Visit the deployed URL on a phone → browser menu → **Add to Home
  Screen** (iOS Safari) or the install prompt (Android Chrome).
- On desktop Chrome/Edge, look for the install icon in the address bar.
- `public/manifest.json` + `public/sw.js` are what make this work; no
  further setup is needed on either host.

## Notes

- Both configs install with `pnpm install --frozen-lockfile` from the
  monorepo root, then build only the `day-neramit` workspace — keep
  `pnpm-lock.yaml` at the repo root in sync (`pnpm install` locally
  after any dependency change, then commit the updated lockfile).
- If a deploy fails on either platform, check the build log first — it
  is almost always a missing/incorrect environment variable or an
  out-of-sync lockfile, not the app code.
