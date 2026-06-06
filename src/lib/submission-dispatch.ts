import { createHmac } from "node:crypto";

import { TaskDefinition, TaskSubmission } from "@/types/task";

interface DispatchContext {
  origin: string;
  taskUrl: string;
  submitUrl: string;
}

interface DispatchInput {
  task: TaskDefinition;
  submission: TaskSubmission;
  context: DispatchContext;
}

export interface DispatchResult {
  attempted: boolean;
  ok: boolean;
  status?: number;
  destination?: string;
  error?: string;
}

interface SubmissionWebhookPayload {
  event_type: string;
  source: string;
  task: TaskDefinition;
  submission: TaskSubmission;
  context: DispatchContext;
}

function getWebhookConfig() {
  const url = process.env.HERMES_SUBMISSION_WEBHOOK_URL?.trim();
  const secret = process.env.HERMES_SUBMISSION_WEBHOOK_SECRET?.trim();
  const eventType =
    process.env.HERMES_SUBMISSION_EVENT_TYPE?.trim() || "task.submitted";
  const source =
    process.env.HERMES_SUBMISSION_SOURCE?.trim() || "hermes-micro-ui";

  if (!url) {
    return null;
  }

  if (!secret) {
    throw new Error(
      "HERMES_SUBMISSION_WEBHOOK_SECRET is required when HERMES_SUBMISSION_WEBHOOK_URL is set.",
    );
  }

  return { url, secret, eventType, source };
}

export async function dispatchTaskSubmission({
  task,
  submission,
  context,
}: DispatchInput): Promise<DispatchResult> {
  const config = getWebhookConfig();

  if (!config) {
    return { attempted: false, ok: false };
  }

  const payload: SubmissionWebhookPayload = {
    event_type: config.eventType,
    source: config.source,
    task,
    submission,
    context,
  };

  const rawBody = JSON.stringify(payload);
  const signature = createHmac("sha256", config.secret)
    .update(rawBody)
    .digest("hex");

  let response: Response;

  try {
    response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Request-ID": `${task.id}-${submission.submittedAt}`,
        "User-Agent": "hermes-micro-ui/0.1",
      },
      body: rawBody,
      cache: "no-store",
    });
  } catch (error) {
    return {
      attempted: true,
      ok: false,
      destination: config.url,
      error:
        error instanceof Error ? error.message : "Unknown webhook dispatch error.",
    };
  }

  if (!response.ok) {
    const responseText = await response.text();

    return {
      attempted: true,
      ok: false,
      status: response.status,
      destination: config.url,
      error: responseText || `Webhook returned ${response.status}.`,
    };
  }

  return {
    attempted: true,
    ok: true,
    status: response.status,
    destination: config.url,
  };
}
