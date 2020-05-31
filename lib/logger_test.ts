import { setup } from "./Logger.ts";
import { assertEquals } from "../dev_deps.ts";
import { getLogger } from "../deps.ts";

Deno.test("Logger: should set info level", async () => {
  await setup({ verbose: true });
  assertEquals(getLogger().levelName, "INFO");
});

Deno.test("Logger: should set warning level", async () => {
  await setup({ verbose: false });
  assertEquals(getLogger().levelName, "WARNING");
});
