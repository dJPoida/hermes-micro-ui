"use client";

import { useMemo, useState } from "react";

import { TaskDefinition } from "@/types/task";

interface TaskFormProps {
  task: TaskDefinition;
}

function buildInitialValues(task: TaskDefinition): Record<string, string> {
  return task.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {});
}

export function TaskForm({ task }: TaskFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(task),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requiredMissing = useMemo(
    () =>
      task.fields.some(
        (field) => field.required && values[field.id].trim().length === 0,
      ),
    [task.fields, values],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: values }),
      });

      const payload = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Submission failed.");
      }

      setMessage(payload.message ?? task.successMessage ?? "Submission saved.");
    } catch (caughtError) {
      const nextError =
        caughtError instanceof Error
          ? caughtError.message
          : "Unexpected submission error.";
      setError(nextError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Respond</h2>
          <p className="mt-1 text-sm text-slate-600">
            Structured feedback keeps the agent loop precise and machine-readable.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {task.fields.length} fields
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {task.fields.map((field) => {
          const value = values[field.id];

          if (field.kind === "select") {
            return (
              <label key={field.id} className="block">
                <span className="text-sm font-medium text-slate-900">
                  {field.label}
                </span>
                {field.helpText ? (
                  <span className="mt-1 block text-sm text-slate-500">
                    {field.helpText}
                  </span>
                ) : null}
                <select
                  required={field.required}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
                  value={value}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.id]: event.target.value,
                    }))
                  }
                >
                  <option value="">{field.placeholder ?? "Select one"}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (field.kind === "textarea") {
            return (
              <label key={field.id} className="block">
                <span className="text-sm font-medium text-slate-900">
                  {field.label}
                </span>
                {field.helpText ? (
                  <span className="mt-1 block text-sm text-slate-500">
                    {field.helpText}
                  </span>
                ) : null}
                <textarea
                  required={field.required}
                  minLength={field.minLength}
                  rows={5}
                  placeholder={field.placeholder}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
                  value={value}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.id]: event.target.value,
                    }))
                  }
                />
              </label>
            );
          }

          if (field.kind === "radio") {
            return (
              <fieldset key={field.id} className="space-y-3">
                <legend className="text-sm font-medium text-slate-900">
                  {field.label}
                </legend>
                {field.helpText ? (
                  <p className="text-sm text-slate-500">{field.helpText}</p>
                ) : null}
                <div className="space-y-3">
                  {field.options.map((option) => {
                    const checked = value === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                          checked
                            ? "border-slate-900 bg-slate-950 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={option.value}
                          checked={checked}
                          required={field.required}
                          className="mt-1"
                          onChange={(event) =>
                            setValues((current) => ({
                              ...current,
                              [field.id]: event.target.value,
                            }))
                          }
                        />
                        <span>
                          <span className="block text-sm font-medium">
                            {option.label}
                          </span>
                          {option.description ? (
                            <span
                              className={`mt-1 block text-sm ${
                                checked ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              {option.description}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          }

          return (
            <label key={field.id} className="block">
              <span className="text-sm font-medium text-slate-900">
                {field.label}
              </span>
              {field.helpText ? (
                <span className="mt-1 block text-sm text-slate-500">
                  {field.helpText}
                </span>
              ) : null}
              <input
                type="text"
                required={field.required}
                placeholder={field.placeholder}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
                value={value}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.id]: event.target.value,
                  }))
                }
              />
            </label>
          );
        })}
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || requiredMissing}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting ? "Submitting…" : task.submitLabel ?? "Submit"}
      </button>
    </form>
  );
}
