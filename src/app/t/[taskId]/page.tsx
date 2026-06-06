import { notFound } from "next/navigation";

import { TaskShell } from "@/components/task-shell";
import { taskStore } from "@/lib/task-store";

interface TaskPageProps {
  params: Promise<{ taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { taskId } = await params;
  const task = await taskStore.getTask(taskId);

  if (!task) {
    notFound();
  }

  return <TaskShell task={task} />;
}
