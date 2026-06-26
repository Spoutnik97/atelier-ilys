# Atelier Ilys

Site web d'Atelier Ilys — stages de teinture végétale, écoprint, indigo et beaux-arts.

Built with [Astro](https://astro.build), deployed on [Vercel](https://vercel.com), content managed via [Decap CMS](https://decapcms.org).

---

## Stack

- **Astro 5** — SSR (`output: server`)
- **Tailwind CSS** — styling
- **Vercel** — hosting & serverless functions
- **Resend** — transactional email (booking forms, contact)
- **Decap CMS** — content editing at `/admin`

---

## Local development

```bash
pnpm install
cp .env.example .env   # fill in the values below
pnpm dev
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API key for booking/contact emails |
| `GITHUB_CLIENT_ID` | Yes (prod) | GitHub OAuth App client ID — for Decap CMS |
| `GITHUB_CLIENT_SECRET` | Yes (prod) | GitHub OAuth App client secret — for Decap CMS |

---

## Decap CMS setup

The CMS is accessible at `/admin`. It uses the GitHub backend with a custom OAuth proxy hosted on Vercel (`/api/auth` + `/api/callback`).

### 1. Create a GitHub OAuth App

Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App** and fill in:

| Field | Value |
|---|---|
| Application name | Atelier Ilys CMS |
| Homepage URL | `https://atelier-ilys.com` |
| Authorization callback URL | `https://atelier-ilys.com/api/callback` |

Copy the **Client ID** and generate a **Client Secret**.

### 2. Add environment variables

In your `.env` (local) and in the **Vercel project settings → Environment Variables**:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Deploy

Push to `main` — Vercel builds and deploys automatically. The CMS will be live at `https://atelier-ilys.com/admin`.

---

## Content

### Calendar (`src/content/calendar/`)

Workshop events are stored in `2026.yaml` and displayed on the `/planifiez` page.

Each event has the following fields:

| Field | Required | Format |
|---|---|---|
| `startDate` | Yes | `2026-07-17` or `2026-07-17/18` or `2026-07-29/30/31` |
| `title` | Yes | Free text |
| `type` | Yes | e.g. `indigo`, `teinture`, `ecoprint`, `beauxarts`, `teinture - ecoprint` |
| `description` | No | Free text |
| `price` | No | e.g. `220 € les 2 jours, repas non compris` |
| `spots` | No | Integer (1–30) |

To edit events through the CMS, go to `/admin` → **Calendrier des stages**.

---

## Email setup

Booking and contact forms use [Resend](https://resend.com).

1. Create a free account at resend.com (3 000 emails/month on the free tier)
2. Add and verify your sending domain
3. Copy your API key into `RESEND_API_KEY`
