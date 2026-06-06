import Link from "next/link";

import { TaskForm } from "@/components/task-form";
import { TaskSections } from "@/components/task-sections";
import { getBrandConfig } from "@/lib/brand";
import { TaskDefinition } from "@/types/task";

interface TaskShellProps {
  task: TaskDefinition;
}

export function TaskShell({ task }: TaskShellProps) {
  const brand = getBrandConfig();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div
            className="overflow-hidden rounded-[2rem] border border-black/10 text-white shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${brand.surface} 0%, ${brand.surfaceMuted} 100%)`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold"
                    style={{
                      backgroundColor: brand.primarySoft,
                      color: brand.primary,
                    }}
                  >
                    {brand.avatarGlyph}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">
                      {brand.productName}
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">
                      {task.title}
                    </h1>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                  {task.summary}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur-sm">
                <div className="font-medium text-white">{brand.assistantName}</div>
                <div className="mt-1">{brand.tagline}</div>
              </div>
            </div>
            <div className="border-t border-white/10 px-6 py-4 text-sm text-white/75">
              <span className="font-medium text-white">Task id:</span> {task.id}
              {task.expiresAt ? (
                <span className="ml-4">
                  <span className="font-medium text-white">Expires:</span>{" "}
                  {new Date(task.expiresAt).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>

          <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Instructions from {task.assistantName}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  This content comes from task payload data, not app-specific hard-coding.
                </p>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline"
              >
                Back home
              </Link>
            </div>
            <ol className="mt-4 space-y-3">
              {task.instructions.map((instruction, index) => (
                <li
                  key={instruction}
                  className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: brand.primarySoft,
                      color: brand.primary,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm leading-7 text-slate-700">
                    {instruction}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <TaskSections sections={task.sections} />
        </section>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <TaskForm task={task} />
          <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Integration notes</h2>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
              <li>
                Replace the in-memory task store with Supabase, Postgres, or Vercel KV.
              </li>
              <li>
                Trigger Hermes via webhook on submit, or poll for completed tasks with cron.
              </li>
              <li>
                Keep branding generic in the repo and personalize each deployment with env vars.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
