import db from "@/_lib/db";

import type * as exampleSchema from "@/_schemas/domain/example";

export async function findMany({ teamId }: { teamId: string }) {
  const examples = await db.example.findMany({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });

  return examples.map((example) => fromDb({ data: example }));
}

export async function findById({ id, teamId }: { id: string; teamId: string }) {
  const example = await db.example.findUniqueOrThrow({
    where: { id, teamId },
  });

  return fromDb({ data: example });
}

export async function create({
  teamId,
  data,
}: {
  teamId: string;
  data: exampleSchema.createSchema;
}) {
  const example = await db.example.create({
    data: { ...data, teamId },
  });

  return fromDb({ data: example });
}

export async function update({
  id,
  teamId,
  data,
}: {
  id: string;
  teamId: string;
  data: exampleSchema.updateSchema;
}) {
  const example = await db.example.update({
    where: { id, teamId },
    data,
  });

  return fromDb({ data: example });
}

export async function remove({ id, teamId }: { id: string; teamId: string }) {
  const example = await db.example.delete({
    where: { id, teamId },
  });

  return fromDb({ data: example });
}

export function fromDb({ data }: { data: any }) {
  return data;
}
