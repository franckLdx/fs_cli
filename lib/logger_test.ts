import { setup } from "./Logger.ts";
import { Log } from "../deps.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("Logger: should set info level", async () => {
  await setup({ verbose: true });
  assertEquals(Log.getLogger().levelName, "INFO");
});

Deno.test("Logger: should set warning level", async () => {
  await setup({ verbose: false });
  assertEquals(Log.getLogger().levelName, "WARNING");
});
