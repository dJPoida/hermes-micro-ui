import { TaskDefinition, TaskSubmission } from "@/types/task";

const demoTask: TaskDefinition = {
  id: "demo-human-loop",
  title: "Favourite AFL team check",
  summary:
    "A live test of the ephemeral UI handoff: answer one simple question in the web UI and let Hermes confirm the answer back in WhatsApp.",
  assistantName: "TARS",
  workflowType: "demo.favorite-afl-team",
  status: "pending",
  instructions: [
    "Answer the question in the structured form below.",
    "Submit once so Hermes can continue the workflow automatically in WhatsApp.",
  ],
  expiresAt: "2026-12-31T23:59:59.000Z",
  sections: [
    {
      kind: "callout",
      title: "Live handoff test",
      body:
        "This task checks whether the Micro UI can collect a simple answer and hand it back to Hermes through the webhook continuation path.",
      tone: "info",
    },
    {
      kind: "facts",
      title: "What should happen",
      items: [
        { label: "Question", value: "Who is your favourite AFL football team?" },
        { label: "Input style", value: "Single free-text answer" },
        { label: "Expected result", value: "Hermes confirms the answer back in WhatsApp" },
        { label: "Backend mode", value: "Mock in-memory task + webhook continuation" },
      ],
    },
    {
      kind: "prose",
      title: "Success criteria",
      body:
        "If the flow is operational, you can answer in the UI, submit the form, and Hermes will confirm your favourite AFL team back in this chat.",
    },
  ],
  fields: [
    {
      id: "notes",
      kind: "textarea",
      label: "Who is your favourite AFL football team?",
      required: true,
      helpText:
        "Type the team name exactly how you want Hermes to repeat it back in WhatsApp.",
      placeholder: "Example: Collingwood",
      minLength: 1,
    },
  ],
  metadata: {
    demo: "true",
    response_contract: "single-generic-webhook",
  },
  submitLabel: "Send answer back to Hermes",
  successMessage:
    "Answer captured. If the continuation webhook is working, Hermes will confirm it back in WhatsApp.",
};

const taskMap = new Map<string, TaskDefinition>([[demoTask.id, demoTask]]);
const submissions = new Map<string, TaskSubmission[]>();

export interface TaskStore {
  getTask(taskId: string): Promise<TaskDefinition | null>;
  listTasks(): Promise<TaskDefinition[]>;
  saveSubmission(submission: TaskSubmission): Promise<TaskSubmission>;
  listSubmissions(taskId: string): Promise<TaskSubmission[]>;
}

const memoryStore: TaskStore = {
  async getTask(taskId) {
    return taskMap.get(taskId) ?? null;
  },
  async listTasks() {
    return Array.from(taskMap.values());
  },
  async saveSubmission(submission) {
    const existing = submissions.get(submission.taskId) ?? [];
    existing.push(submission);
    submissions.set(submission.taskId, existing);
    return submission;
  },
  async listSubmissions(taskId) {
    return submissions.get(taskId) ?? [];
  },
};

export const taskStore = memoryStore;
