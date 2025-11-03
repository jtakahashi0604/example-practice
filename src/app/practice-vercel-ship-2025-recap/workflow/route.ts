import { start } from "workflow/api";

import { runExampleWorkflow } from "@/_services/domain/practice-vercel-ship-2025-recap/workflow";

export async function POST() {
  await start(runExampleWorkflow, []);

  return new Response("started", { status: 202 });
}
