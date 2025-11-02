import * as exampleAction from "@/_actions/domain/example";

import ExampleForm from "@/_components/domain/example/form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const example = await exampleAction.findById({
    id,
  });

  return <ExampleForm example={example} />;
}
