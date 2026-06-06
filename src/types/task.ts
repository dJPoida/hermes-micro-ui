export type TaskStatus = "pending" | "submitted" | "expired";

export type TaskSection =
  | {
      kind: "callout";
      title: string;
      body: string;
      tone?: "info" | "success" | "warning";
    }
  | {
      kind: "facts";
      title: string;
      items: Array<{ label: string; value: string }>;
    }
  | {
      kind: "table";
      title: string;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "prose";
      title: string;
      body: string;
    };

export type TaskField =
  | {
      id: string;
      kind: "select";
      label: string;
      helpText?: string;
      required?: boolean;
      placeholder?: string;
      options: Array<{ label: string; value: string }>;
    }
  | {
      id: string;
      kind: "textarea";
      label: string;
      helpText?: string;
      required?: boolean;
      placeholder?: string;
      minLength?: number;
    }
  | {
      id: string;
      kind: "text";
      label: string;
      helpText?: string;
      required?: boolean;
      placeholder?: string;
    }
  | {
      id: string;
      kind: "radio";
      label: string;
      helpText?: string;
      required?: boolean;
      options: Array<{ label: string; value: string; description?: string }>;
    };

export interface TaskDefinition {
  id: string;
  title: string;
  summary: string;
  assistantName: string;
  instructions: string[];
  status: TaskStatus;
  workflowType?: string;
  expiresAt?: string;
  sections: TaskSection[];
  fields: TaskField[];
  metadata?: Record<string, string>;
  submitLabel?: string;
  successMessage?: string;
}

export interface TaskSubmission {
  taskId: string;
  submittedAt: string;
  answers: Record<string, string>;
}
