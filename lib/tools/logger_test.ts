import { configLog, SimpleHandler } from "./Logger.ts";
import { assertEquals, assert } from "../../dev_deps.ts";
import { getLogger, LogRecord, getLevelByName } from "../../deps.ts";

Deno.test("Logger: should use relevant handler: not dry mode", async () => {
  await configLog({ quiet: false, dry: false });
  const logger = getLogger();
  assertEquals(logger.handlers.length, 1);
  const handler = logger.handlers[0];
  assert(handler.isSimpleHandled);
  const msg = "fooBar";
  assertEquals(
    (handler as SimpleHandler).format(
      new LogRecord(msg, [], getLevelByName("INFO")),
    ),
    msg,
  );
});

Deno.test("Logger: should use relevant handler: dry mode", async () => {
  await configLog({ quiet: false, dry: true });
  const logger = getLogger();
  assertEquals(logger.handlers.length, 1);
  const handler = logger.handlers[0];
  assert(handler.isSimpleHandled);
  const msg = "fooBar";
  assertEquals(
    (handler as SimpleHandler).format(
      new LogRecord(msg, [], getLevelByName("INFO")),
    ),
    `[Dry Run] ${msg}`,
  );
});

Deno.test("Logger: should set info level", async () => {
  await configLog({ quiet: false, dry: false });
  assertEquals(getLogger().levelName, "INFO");
});

Deno.test("Logger: should set warning level", async () => {
  await configLog({ quiet: true, dry: false });
  assertEquals(getLogger().levelName, "WARNING");
});
