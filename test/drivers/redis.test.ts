import { describe, vi, it, expect } from "vitest";
import * as ioredis from "ioredis-mock";
import driver from "../../src/drivers/redis";
import { testDriver } from "./utils";

vi.mock("ioredis", () => ioredis);

describe("drivers: redis", () => {
  testDriver({
    driver: driver({
      base: "test:",
      url: "ioredis://localhost:6379/0",
      lazyConnect: false,
    }),
    additionalTests() {
      it("verify stored keys", async () => {
        const client = new ioredis.default("ioredis://localhost:6379/0");
        const keys = await client.keys("*");
        expect(keys).toMatchInlineSnapshot(`
          [
            "test:s1:a",
            "test:s2:a",
            "test:s3:a",
            "test:data:test.json",
            "test:data:true.json",
            "test:data:serialized1.json",
            "test:data:serialized2.json",
            "test:data:raw.bin",
          ]
        `);
        await client.disconnect();
      });
    },
  });
});
