import { getStepMetadata, sleep } from "workflow";

export async function runExampleWorkflow() {
  "use workflow";

  await step1();
  await sleep("10s");

  await step2();
  await sleep("10s");

  await step3();
}

async function step1() {
  "use step";
  console.log("step1");
  //   const meta = getStepMetadata();
  //   return { step: "step1", at: new Date().toISOString(), stepId: meta.stepId };
}

async function step2() {
  "use step";
  console.log("step2");
  //   const meta = getStepMetadata();
  //   return { step: "step2", at: new Date().toISOString(), stepId: meta.stepId };
}

async function step3() {
  "use step";
  console.log("step3");
  //   const meta = getStepMetadata();
  //   return { step: "step3", at: new Date().toISOString(), stepId: meta.stepId };
}
