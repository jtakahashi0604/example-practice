import * as exampleAction from "@/_actions/domain/example";

import ExampleList from "@/_components/domain/example/list";

export const dynamic = "force-dynamic";

export default async function Page() {
  const examples = await exampleAction.findMany();

  return <ExampleList examples={examples} />;
}
