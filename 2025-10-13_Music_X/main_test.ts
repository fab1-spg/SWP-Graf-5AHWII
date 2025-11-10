// Provide Deno as an any for the type-checker (we expect to run tests with Deno).
declare const Deno: any;

import { PrismaClient } from "./prisma/generated/client/index.ts";

// Local minimal asserts to avoid remote imports during type-checking in the
// editor. When running with Deno you can replace these with the std asserts.
const assert = (cond: any, msg?: string) => {
  if (!cond) throw new Error(msg ?? "Assertion failed");
};
const assertEquals = (a: any, b: any, msg?: string) => {
  if (a !== b) throw new Error(msg ?? `Expected ${a} === ${b}`);
};

Deno.test(
  "PrismaClient stub: create returns id and passes data through",
  async () => {
    const client = new PrismaClient();
    const res = await client.artist.create({
      data: { name: "Unit Test Artist" },
    });

    // The stub should return an object with an id string and the passed data
    assert(res.id && typeof res.id === "string");
    assertEquals(res.name, "Unit Test Artist");
  }
);

Deno.test(
  "PrismaClient stub: deleteMany and $disconnect resolve without error",
  async () => {
    const client = new PrismaClient();
    // Should not throw
    await client.album.deleteMany();
    await client.$disconnect();

    // If we reached here the calls succeeded
    assertEquals(true, true);
  }
);
