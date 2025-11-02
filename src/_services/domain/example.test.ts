import { afterEach, beforeEach, describe, expect, it } from "vitest";

import db from "@/_lib/db";

import * as exampleService from "./example";

describe("Example Service", () => {
  const teamId1 = "test-team-1";
  const teamId2 = "test-team-2";

  let createdExampleIds: string[] = [];

  beforeEach(async () => {
    // Clean up any existing test data
    await db.example.deleteMany({
      where: {
        teamId: {
          in: [teamId1, teamId2],
        },
      },
    });
    createdExampleIds = [];
  });

  afterEach(async () => {
    // Clean up test data after each test
    if (createdExampleIds.length > 0) {
      await db.example.deleteMany({
        where: {
          id: {
            in: createdExampleIds,
          },
        },
      });
    }
  });

  describe("findMany", () => {
    it("should only return examples for the specified teamId", async () => {
      const src1 = await exampleService.create({
        teamId: teamId1,
        data: { name: "Team 1 Example" },
      });
      const src2 = await exampleService.create({
        teamId: teamId2,
        data: { name: "Team 2 Example" },
      });

      createdExampleIds.push(src1.id, src2.id);

      const team1Examples = await exampleService.findMany({ teamId: teamId1 });

      expect(team1Examples).toHaveLength(1);
      expect(team1Examples[0].teamId).toBe(teamId1);
      expect(team1Examples[0].name).toBe("Team 1 Example");

      const team2Examples = await exampleService.findMany({ teamId: teamId2 });

      expect(team2Examples).toHaveLength(1);
      expect(team2Examples[0].teamId).toBe(teamId2);
      expect(team2Examples[0].name).toBe("Team 2 Example");
    });
  });

  describe("findById", () => {
    it("should not find example from different team even with same id", async () => {
      const src = await exampleService.create({
        teamId: teamId1,
        data: { name: "example" },
      });
      createdExampleIds.push(src.id);

      await expect(
        exampleService.findById({ id: src.id, teamId: teamId2 }),
      ).rejects.toThrow();
    });
  });

  describe("create", () => {
    it("should create examples with different teamIds", async () => {
      const src1 = await exampleService.create({
        teamId: teamId1,
        data: { name: "Team 1 Example" },
      });
      const src2 = await exampleService.create({
        teamId: teamId2,
        data: { name: "Team 2 Example" },
      });

      createdExampleIds.push(src1.id, src2.id);

      expect(src1.teamId).toBe(teamId1);
      expect(src2.teamId).toBe(teamId2);
    });
  });

  describe("update", () => {
    it("should not update example from different team", async () => {
      const src = await exampleService.create({
        teamId: teamId1,
        data: { name: "example" },
      });
      createdExampleIds.push(src.id);

      await expect(
        exampleService.update({
          id: src.id,
          teamId: teamId2,
          data: { name: "example" },
        }),
      ).rejects.toThrow();
    });
  });

  describe("remove", () => {
    it("should not delete example from different team", async () => {
      const src = await exampleService.create({
        teamId: teamId1,
        data: { name: "example" },
      });
      createdExampleIds.push(src.id);

      await expect(
        exampleService.remove({ id: src.id, teamId: teamId2 }),
      ).rejects.toThrow();

      const dst = await exampleService.findById({
        id: src.id,
        teamId: teamId1,
      });
      expect(dst.id).toBe(src.id);
    });
  });

  describe("Cross-team isolation verification", () => {
    it("should ensure complete isolation between teams", async () => {
      // Create multiple examples for each team
      const team1Example1 = await exampleService.create({
        teamId: teamId1,
        data: { name: "Team 1 Example 1" },
      });
      const team1Example2 = await exampleService.create({
        teamId: teamId1,
        data: { name: "Team 1 Example 2" },
      });
      const team2Example1 = await exampleService.create({
        teamId: teamId2,
        data: { name: "Team 2 Example 1" },
      });

      createdExampleIds.push(
        team1Example1.id,
        team1Example2.id,
        team2Example1.id,
      );

      // Get examples for each team
      const team1Examples = await exampleService.findMany({ teamId: teamId1 });
      const team2Examples = await exampleService.findMany({ teamId: teamId2 });

      // Verify complete isolation
      expect(team1Examples).toHaveLength(2);
      expect(team2Examples).toHaveLength(1);

      // All team 1 examples should have teamId1
      team1Examples.forEach((example) => {
        expect(example.teamId).toBe(teamId1);
      });

      // All team 2 examples should have teamId2
      team2Examples.forEach((example) => {
        expect(example.teamId).toBe(teamId2);
      });

      // No overlap between teams
      const team1Ids = team1Examples.map((e) => e.id);
      const team2Ids = team2Examples.map((e) => e.id);
      expect(team1Ids).not.toEqual(expect.arrayContaining(team2Ids));
    });
  });
});
