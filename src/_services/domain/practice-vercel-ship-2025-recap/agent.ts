import { openai } from "@ai-sdk/openai";
import { stepCountIs, ToolLoopAgent, tool } from "ai";
import { z } from "zod";

export const timeTool = tool({
  description: "Get the current time in a given timezone",
  inputSchema: z.object({
    timezone: z.string().default("Asia/Tokyo"),
  }),
  needsApproval: true,
  execute: async ({ timezone }) => {
    const now = new Date().toLocaleString("en-US", { timeZone: timezone });
    return { now, timezone };
  },
});

export const exampleAgent = new ToolLoopAgent({
  model: openai("gpt-4o-mini"),
  instructions:
    "You are a helpful assistant. If needed, use the time tool to get the current time and answer the question.",
  tools: {
    time: timeTool,
  },
  stopWhen: stepCountIs(5),
});
