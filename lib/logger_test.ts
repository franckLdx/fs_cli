import { configLog } from "./Logger.ts";
import { assertEquals } from "../dev_deps.ts";
import { getLogger } from "../deps.ts";

Deno.test("Logger: should set info level", async () => {
  await configLog({ quiet: false });
  assertEquals(getLogger().levelName, "INFO");
});

Deno.test("Logger: should set warning level", async () => {
  await configLog({ quiet: true });
  assertEquals(getLogger().levelName, "WARNING");
});
