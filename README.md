# Next.js + `@storyblok/react` v2 — Playground

A fully working Next.js App Router example for the `@storyblok/react` v2 SDK.
Read the full guide for a deep-dive on how everything is wired up:
[packages/react/src/v2/guide.md](https://github.com/storyblok/monoblok/blob/feature/new-react-sdk/packages/react/src/v2/guide.md)

---

## Prerequisites

- Node.js 18+
- A Storyblok space ([sign up free](https://app.storyblok.com/#!/signup))

---

## 1. Install dependencies

```bash
npm install
```

The SDK is installed from a prerelease build via [pkg.pr.new](https://pkg.pr.new) — no extra registry config needed.

---

## 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

| Variable | Where to find it | Notes |
|---|---|---|
| `STORYBLOK_MAPI_TOKEN` | My Account → Access Tokens | Full-access personal token; never exposed to the browser |
| `NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN` | Space → Settings → Access Tokens | Use a **Public** token |
| `NEXT_PUBLIC_STORYBLOK_REGION` | Space → Settings → General | `eu`, `us`, `ap`, or `ca` |
| `STORYBLOK_ENV` | — | Set to `preview` on your preview deployment; leave unset for production |

---

## 3. Push the schema to your space

This repo ships with a typed component schema in `schema/`. You can push it to a new (or existing) space to create all the components automatically — no manual setup in the UI required.

```bash
npm run storyblok -- schema push schema/schema.ts
```

The `storyblok` script in `package.json` loads your `.env` file automatically, so `STORYBLOK_MAPI_TOKEN` and the space ID in `storyblok.config.ts` are picked up without any extra flags.

> See the [Storyblok CLI schema push docs](https://www.storyblok.com/docs/libraries/storyblok-cli#schema-push) for available flags (e.g. `--space-id`, `--dry-run`).

---

## 4. Run the dev server

```bash
npm run dev
```

The dev server starts with HTTPS (`--experimental-https`) because the Storyblok Visual Editor requires a secure origin for the bridge connection. Open [https://localhost:3000](https://localhost:3000).

---

## Deployment: production vs. preview

This app uses two deployments of the same codebase with different caching strategies, controlled by a single env var:

| Deployment | `STORYBLOK_ENV` | Fetches | Caching | Live editing |
|---|---|---|---|---|
| Production | unset | `published` stories | cache-first (60 s) | off |
| Preview | `preview` | `draft` stories | network-first (always fresh) | on |

Point your Storyblok space's **Visual Editor preview URL** at the preview deployment. See the [guide](https://github.com/storyblok/monoblok/blob/feature/new-react-sdk/packages/react/src/v2/guide.md#3-production-vs-preview-the-two-deployment-strategy) for details.
