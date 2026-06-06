# hermes-micro-ui

Generic ephemeral web UI for Hermes-style agent workflows.

This repo is intentionally not tied to one use case like a “review portal”.
It provides a reusable surface that an agent can invoke whenever chat is the
wrong UX:

- approvals
- triage
- reconciliation
- evidence review
- structured feedback
- side-by-side comparisons
- temporary dashboards

The starter is payload-driven and brandable so one deployment can present
itself as TARS, another as Hermes, and another as a completely different
assistant.

## What is in v0

- Next.js + TypeScript + Tailwind starter
- Generic task data model (`TaskDefinition`)
- Typed section renderer for:
  - callouts
  - fact grids
  - tables
  - prose blocks
- Typed response fields for:
  - radio groups
  - selects
  - text inputs
  - textareas
- Demo task route: `/t/demo-human-loop`
- Read endpoint: `GET /api/tasks/:taskId`
- Submit endpoint: `POST /api/tasks/:taskId/submit`
- Configurable branding via environment variables
- Mock in-memory storage adapter that can be replaced later

## Branding / personality

The app is generic in-repo, but each deployment can adopt its own identity.

Copy `.env.example` to `.env.local` and customize:

```bash
cp .env.example .env.local
```

Available variables:

- `NEXT_PUBLIC_MICRO_UI_NAME`
- `NEXT_PUBLIC_ASSISTANT_NAME`
- `NEXT_PUBLIC_MICRO_UI_TAGLINE`
- `NEXT_PUBLIC_MICRO_UI_AVATAR_GLYPH`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY_SOFT`
- `NEXT_PUBLIC_MICRO_UI_SURFACE`
- `NEXT_PUBLIC_MICRO_UI_SURFACE_MUTED`
- `NEXT_PUBLIC_MICRO_UI_ACCENT`

Example TARS-flavoured deployment:

```env
NEXT_PUBLIC_MICRO_UI_NAME=Hermes Micro UI
NEXT_PUBLIC_ASSISTANT_NAME=TARS
NEXT_PUBLIC_MICRO_UI_TAGLINE=Temporary interfaces for decisions that should not happen in chat.
NEXT_PUBLIC_MICRO_UI_AVATAR_GLYPH=◉
```

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current architecture

### UI shell
- `src/app/page.tsx` — landing page
- `src/app/t/[taskId]/page.tsx` — generic task page
- `src/components/task-shell.tsx` — main task layout
- `src/components/task-sections.tsx` — evidence renderer
- `src/components/task-form.tsx` — structured response form

### Data / domain
- `src/types/task.ts` — generic task schema
- `src/lib/task-store.ts` — mock task store + sample task
- `src/lib/brand.ts` — brand and personality configuration

### API
- `src/app/api/tasks/[taskId]/route.ts`
- `src/app/api/tasks/[taskId]/submit/route.ts`

## Why the store is mocked

The current store is intentionally simple so the interaction model can be
validated before choosing infrastructure.

Planned upgrade paths:
- Supabase/Postgres for durable tasks + submissions
- Vercel KV for lightweight ephemeral state
- Webhook dispatch on submit to wake Hermes immediately
- Queue/cron polling as a fallback

## Suggested next steps

1. Replace the in-memory task store with a durable backend.
2. Add signed task tokens and expiry validation.
3. Add webhook delivery so Hermes resumes automatically after submit.
4. Introduce workflow adapters that map external systems into the generic task schema.
5. Add a first concrete adapter, e.g. YNAB reconciliation, without changing the core app identity.

## Vercel POC deployment

This repo is now on GitHub:

- `https://github.com/dJPoida/hermes-micro-ui`

For the first milestone, the goal is simple:
- deploy the app
- open the landing page from a WhatsApp link
- open the sample task page
- submit the sample form
- verify the health endpoint responds

### Required Vercel environment variables

For a family-facing TARS deployment, configure these in Vercel:

- `NEXT_PUBLIC_MICRO_UI_NAME=Hermes Micro UI`
- `NEXT_PUBLIC_ASSISTANT_NAME=TARS`
- `NEXT_PUBLIC_MICRO_UI_TAGLINE=Temporary interfaces for decisions that should not happen in chat.`
- `NEXT_PUBLIC_MICRO_UI_AVATAR_GLYPH=◉`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY=#6d28d9`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY_SOFT=#ede9fe`
- `NEXT_PUBLIC_MICRO_UI_SURFACE=#111827`
- `NEXT_PUBLIC_MICRO_UI_SURFACE_MUTED=#1f2937`
- `NEXT_PUBLIC_MICRO_UI_ACCENT=#22c55e`

### Post-deploy smoke tests

Once deployed, verify these URLs:

- `/`
- `/t/demo-human-loop`
- `/api/tasks/demo-human-loop`
- `/api/health`

Expected behavior:
- landing page loads
- sample task page loads
- task API returns JSON
- health API returns JSON with `ok: true`

### Deploy options

1. Import the GitHub repo into Vercel UI
2. Or deploy with CLI once `VERCEL_TOKEN` is available to the shell environment:

```bash
npx vercel --prod
```

## Notes

This is a POC shell. The submit endpoint currently normalizes and stores
responses in process memory only. That is enough to validate the UX and
payload design, but not enough for production durability.
