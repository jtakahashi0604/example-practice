import { createAgentUIStreamResponse } from "ai";
import type { NextRequest } from "next/server";

import { exampleAgent } from "@/_services/domain/practice-vercel-ship-2025-recap/agent";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: exampleAgent,
    messages,
  });
}
