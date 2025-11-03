"use client";

import { useChat } from "@ai-sdk/react";
import {
  type ChatAddToolApproveResponseFunction,
  DefaultChatTransport,
  type InferAgentUIMessage,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIToolInvocation,
} from "ai";
import { type FormEvent, useState } from "react";

import type {
  exampleAgent,
  timeTool,
} from "@/_services/domain/practice-vercel-ship-2025-recap/agent";

type ExampleAgentUIMessage = InferAgentUIMessage<typeof exampleAgent>;

export function ExampleAgentToolView({
  invocation,
  addToolApprovalResponse,
}: {
  invocation: UIToolInvocation<typeof timeTool>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  if (invocation.state === "approval-requested") {
    return (
      <div>
        <div>Can I use this tool?</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border p-2"
            onClick={() =>
              addToolApprovalResponse({
                id: invocation.approval.id,
                approved: true,
              })
            }
          >
            Accept
          </button>
          <button
            type="button"
            className="rounded-md border p-2"
            onClick={() =>
              addToolApprovalResponse({
                id: invocation.approval.id,
                approved: false,
              })
            }
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  if (invocation.state === "output-available") {
    return <div>Time: {invocation.output.now}</div>;
  }
}

export default function Page() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, addToolApprovalResponse } =
    useChat<ExampleAgentUIMessage>({
      transport: new DefaultChatTransport({
        api: "/practice-vercel-ship-2025-recap/agent/api",
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage({
      text: input,
    });
  };

  return (
    <main className="space-y-8">
      <form onSubmit={onSubmit}>
        <div className="space-y-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Can you tell me the current time in Tokyo, Japan?"
            className="w-full"
          />
        </div>
        <div>
          <button type="submit">Send</button>
        </div>
      </form>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <div>{message.role === "user" ? "User: " : "AI: "}</div>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return <div key={index}>{part.text}</div>;
                case "tool-time":
                  return (
                    <ExampleAgentToolView
                      key={index}
                      invocation={part}
                      addToolApprovalResponse={addToolApprovalResponse}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
