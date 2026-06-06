import { TaskDefinition, TaskSubmission } from "@/types/task";

const demoTask: TaskDefinition = {
  id: "demo-human-loop",
  title: "Validate an agent handoff",
  summary:
    "A generic example task showing how an agent can collect structured human feedback through a temporary web UI instead of chat.",
  assistantName: "TARS",
  status: "pending",
  instructions: [
    "Review the evidence blocks below.",
    "Choose the next action from the structured form.",
    "Submit once so the agent can continue the workflow automatically.",
  ],
  expiresAt: "2026-12-31T23:59:59.000Z",
  sections: [
    {
      kind: "callout",
      title: "Why this exists",
      body:
        "Some workflows are painful in chat. Hermes Micro UI provides an ephemeral surface for approvals, triage, reconciliation, and rich evidence review.",
      tone: "info",
    },
    {
      kind: "facts",
      title: "Context",
      items: [
        { label: "Workflow type", value: "Human-in-the-loop checkpoint" },
        { label: "Created by", value: "Hermes agent" },
        { label: "Frontend target", value: "Mobile-first web UI" },
        { label: "Backend mode", value: "Mock in-memory adapter" },
      ],
    },
    {
      kind: "table",
      title: "Evidence items",
      columns: ["Item", "Question", "Notes"],
      rows: [
        [
          "Branding",
          "Should the UI refer to itself as TARS?",
          "Configurable per deployment via environment variables.",
        ],
        [
          "Payload rendering",
          "Can one schema drive many one-off UIs?",
          "This starter renders sections and fields from typed task data.",
        ],
        [
          "Submission path",
          "Can structured answers flow back to Hermes?",
          "The submit API returns a normalized payload ready for webhook or queue integration.",
        ],
      ],
    },
    {
      kind: "prose",
      title: "Next step",
      body:
        "Once this generic shell is validated, a future task adapter can render YNAB reconciliation data without changing the app's core identity.",
    },
  ],
  fields: [
    {
      id: "decision",
      kind: "radio",
      label: "What should the agent do next?",
      required: true,
      options: [
        {
          label: "Proceed to add a concrete workflow adapter",
          value: "build-adapter",
          description: "Use this once the generic shell feels right.",
        },
        {
          label: "Refine the generic UX shell first",
          value: "refine-shell",
          description: "Use this if layout, branding, or schema shape still needs work.",
        },
      ],
    },
    {
      id: "tone",
      kind: "select",
      label: "Preferred personality for this deployment",
      required: true,
      placeholder: "Pick a tone",
      options: [
        { label: "TARS / direct and witty", value: "tars" },
        { label: "Neutral operator", value: "neutral" },
        { label: "Warm concierge", value: "warm" },
      ],
    },
    {
      id: "notes",
      kind: "textarea",
      label: "Extra instructions",
      helpText:
        "Use this for anything the agent should remember when continuing the workflow.",
      placeholder: "Example: keep this generic; don't hard-code finance assumptions.",
      minLength: 0,
    },
  ],
  submitLabel: "Send response back to agent",
  successMessage:
    "Response captured. Wire this submission to a webhook, queue, or cron pickup so the agent can resume automatically.",
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
