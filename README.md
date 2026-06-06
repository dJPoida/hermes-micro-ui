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
- Optional signed webhook dispatch on submit for Hermes continuation

## Branding / personality

The app is generic in-repo, but each deployment can adopt its own identity.

Copy `.env.example` to `.env.local` and customize:

```bash
cp .env.example .env.local
```

Available variables:

Public branding:
- `NEXT_PUBLIC_MICRO_UI_NAME`
- `NEXT_PUBLIC_ASSISTANT_NAME`
- `NEXT_PUBLIC_MICRO_UI_TAGLINE`
- `NEXT_PUBLIC_MICRO_UI_AVATAR_GLYPH`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY`
- `NEXT_PUBLIC_MICRO_UI_PRIMARY_SOFT`
- `NEXT_PUBLIC_MICRO_UI_SURFACE`
- `NEXT_PUBLIC_MICRO_UI_SURFACE_MUTED`
- `NEXT_PUBLIC_MICRO_UI_ACCENT`

Optional Hermes continuation webhook:
- `HERMES_SUBMISSION_WEBHOOK_URL` — point every Micro UI task at the same Hermes webhook route (for example `/webhooks/micro-ui-submit`)
- `HERMES_SUBMISSION_WEBHOOK_SECRET`
- `HERMES_SUBMISSION_EVENT_TYPE` (defaults to `task.submitted`)
- `HERMES_SUBMISSION_SOURCE` (defaults to `hermes-micro-ui`)

The intended operating model is one generic webhook route for the whole Micro UI deployment. New task pages, forms, or workflow adapters should change the task payload, not require new Hermes webhook routes or prompt rewrites.

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
- `src/lib/submission-dispatch.ts` — signs and posts every task submission to one generic Hermes continuation webhook

### Single-webhook continuation contract

The app-side contract is intentionally generic:
- every task submits through the same in-app path: `POST /api/tasks/[taskId]/submit`
- the server-side submit handler forwards to one Hermes webhook URL from `HERMES_SUBMISSION_WEBHOOK_URL`
- the webhook payload contains the full task, the raw answers map, and `resolved_answers` with field labels/kinds/values so Hermes can understand new task types without route-specific config changes

That means new dynamic UIs should differ by task payload only:
- task title/summary
- workflow type
- sections
- fields
- answers

not by Hermes webhook route.

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
3. Add a first concrete workflow adapter, e.g. YNAB reconciliation, without changing the core app identity.
4. Introduce richer workflow adapters that map external systems into the generic task schema.
5. Add delivery observability / retry handling around webhook continuation.

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

To enable automatic Hermes continuation after submit, also set:

- `HERMES_SUBMISSION_WEBHOOK_URL=https://.../webhooks/micro-ui-submit`
- `HERMES_SUBMISSION_WEBHOOK_SECRET`
- `HERMES_SUBMISSION_EVENT_TYPE=task.submitted`
- `HERMES_SUBMISSION_SOURCE=hermes-micro-ui`

Only this one webhook route should be needed for Micro UI submissions. Future UI workflows should reuse the same callback URL and rely on the task payload plus `resolved_answers` to tell Hermes what happened.

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

This is still a POC shell. Task storage remains in process memory, but the submit
endpoint now supports signed webhook dispatch so Hermes can resume automatically
when `HERMES_SUBMISSION_WEBHOOK_*` variables are configured.
