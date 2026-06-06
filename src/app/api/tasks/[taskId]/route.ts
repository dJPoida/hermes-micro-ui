import { NextResponse } from "next/server";

import { taskStore } from "@/lib/task-store";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/tasks/[taskId]">,
) {
  const { taskId } = await context.params;
  const task = await taskStore.getTask(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ task });
}
