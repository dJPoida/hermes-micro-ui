import Link from "next/link";

import { getBrandConfig } from "@/lib/brand";
import { taskStore } from "@/lib/task-store";

export default async function Home() {
  const brand = getBrandConfig();
  const [demoTask] = await taskStore.listTasks();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section
        className="overflow-hidden rounded-[2rem] border border-black/10 p-6 text-white shadow-xl sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${brand.surface} 0%, ${brand.surfaceMuted} 100%)`,
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-semibold"
              style={{
                backgroundColor: brand.primarySoft,
                color: brand.primary,
              }}
            >
              {brand.avatarGlyph}
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-white/60">
              {brand.productName}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Generic ephemeral UX for agent workflows.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              Give {brand.assistantName} a temporary interface whenever chat is the
              wrong tool: approvals, triage, reconciliation, evidence review, and
              structured human feedback.
            </p>
          </div>
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-white">Branding is configurable.</p>
            <p className="mt-2 text-sm leading-7 text-white/75">
              Set environment variables to rename the assistant, swap colors,
              update the avatar glyph, and skin this deployment for your own
              family, team, or product.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Why this repo exists</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Payload-driven",
                body: "Render temporary task pages from structured JSON or typed payloads instead of hard-coding one workflow.",
              },
              {
                title: "Human-in-the-loop",
                body: "Collect clean structured answers that an agent can resume from automatically.",
              },
              {
                title: "Easy to personalize",
                body: "Keep the codebase generic while deploying your own branded assistant experience, like TARS.",
              },
              {
                title: "Replaceable backends",
                body: "Swap the mock store later for Supabase, Postgres, KV, webhooks, or a queue without changing the UI shell.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Included demo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            Open a sample task
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            The starter includes a generic task payload, a renderer, and a submit
            endpoint so you can validate the interaction model before building
            workflow-specific adapters.
          </p>
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-medium text-slate-950">{demoTask.title}</div>
            <div className="mt-2 text-sm text-slate-600">{demoTask.summary}</div>
          </div>
          <Link
            href={`/t/${demoTask.id}`}
            className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white"
            style={{ backgroundColor: brand.primary }}
          >
            Launch demo task
          </Link>
        </aside>
      </section>
    </main>
  );
}
