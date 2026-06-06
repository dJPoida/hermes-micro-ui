import { TaskSection } from "@/types/task";

const calloutToneClasses: Record<
  NonNullable<Extract<TaskSection, { kind: "callout" }>["tone"]>,
  string
> = {
  info: "border-sky-200 bg-sky-50 text-sky-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
};

export function TaskSections({ sections }: { sections: TaskSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        switch (section.kind) {
          case "callout": {
            const tone = section.tone ?? "info";
            return (
              <section
                key={`${section.kind}-${index}`}
                className={`rounded-3xl border p-5 shadow-sm ${calloutToneClasses[tone]}`}
              >
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-7">{section.body}</p>
              </section>
            );
          }
          case "facts":
            return (
              <section
                key={`${section.kind}-${index}`}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-950">
                  {section.title}
                </h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-slate-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          case "table":
            return (
              <section
                key={`${section.kind}-${index}`}
                className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
              >
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {section.title}
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        {section.columns.map((column) => (
                          <th key={column} className="px-5 py-3 font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, rowIndex) => (
                        <tr
                          key={`${section.title}-${rowIndex}`}
                          className="border-t border-slate-200 align-top"
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${section.title}-${rowIndex}-${cellIndex}`}
                              className="px-5 py-4 text-slate-800"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          case "prose":
            return (
              <section
                key={`${section.kind}-${index}`}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {section.body}
                </p>
              </section>
            );
        }
      })}
    </div>
  );
}
