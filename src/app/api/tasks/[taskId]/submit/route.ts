import { NextRequest, NextResponse } from "next/server";

import { dispatchTaskSubmission } from "@/lib/submission-dispatch";
import { taskStore } from "@/lib/task-store";

interface SubmitBody {
  answers?: Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/tasks/[taskId]/submit">,
) {
  const { taskId } = await context.params;
  const task = await taskStore.getTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  let body: SubmitBody;

  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const answers = body.answers ?? {};
  const normalizedAnswers = Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [key, String(value ?? "")]),
  );

  for (const field of task.fields) {
    if (field.required && normalizedAnswers[field.id]?.trim().length === 0) {
      return NextResponse.json(
        { error: `Field '${field.label}' is required.` },
        { status: 400 },
      );
    }
  }

  const submission = await taskStore.saveSubmission({
    taskId,
    submittedAt: new Date().toISOString(),
    answers: normalizedAnswers,
  });

  const dispatch = await dispatchTaskSubmission({
    task,
    submission,
    context: {
      origin: request.nextUrl.origin,
      taskUrl: `${request.nextUrl.origin}/t/${taskId}`,
      submitUrl: request.nextUrl.href,
    },
  });

  if (dispatch.attempted && !dispatch.ok) {
    return NextResponse.json(
      {
        error: "Submission was stored, but webhook dispatch failed.",
        submission,
        dispatch,
      },
      { status: dispatch.status ?? 502 },
    );
  }

  const message = dispatch.attempted
    ? task.successMessage ?? "Response captured and handed back to Hermes."
    : task.successMessage ??
      "Response captured. Set a webhook destination to resume Hermes automatically.";

  return NextResponse.json({
    ok: true,
    message,
    submission,
    dispatch,
  });
}
