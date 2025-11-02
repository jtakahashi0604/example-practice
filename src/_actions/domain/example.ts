"use server";

import { revalidatePath } from "next/cache";

import type * as exampleSchema from "@/_schemas/domain/example";
import * as authService from "@/_services/app/auth";
import * as exampleService from "@/_services/domain/example";

export async function findMany() {
  const teamId = await authService.getTeamId();

  const result = await exampleService.findMany({ teamId });

  return result;
}

export async function findById({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await exampleService.findById({ id, teamId });

  return result;
}

export async function create({ data }: { data: exampleSchema.createSchema }) {
  const teamId = await authService.getTeamId();

  const result = await exampleService.create({ data, teamId });

  revalidatePath("/examples");

  return result;
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: exampleSchema.updateSchema;
}) {
  const teamId = await authService.getTeamId();

  const result = await exampleService.update({ id, data, teamId });

  revalidatePath("/examples");
  revalidatePath(`/examples/${id}`);

  return result;
}

export async function remove({ id }: { id: string }) {
  const teamId = await authService.getTeamId();

  const result = await exampleService.remove({ id, teamId });

  revalidatePath("/examples");

  return result;
}
