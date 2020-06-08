import { configLog } from "./Logger.ts";
import { assertEquals, blue } from "../../dev_deps.ts";
import {
  getLogger,
  LogRecord,
  getLevelByName,
  BaseHandler,
} from "../../deps.ts";

Deno.test("Logger: should use relevant handler: not dry mode", async () => {
  await configLog({ quiet: false, dry: false });
  const logger = getLogger();
  assertEquals(logger.handlers.length, 1);
  const handler = logger.handlers[0] as BaseHandler;
  const msg = "fooBar";
  assertEquals(
    handler.format(
      new LogRecord(msg, [], getLevelByName("INFO")),
    ),
    blue(msg),
  );
});

Deno.test("Logger: should use relevant handler: dry mode", async () => {
  await configLog({ quiet: false, dry: true });
  const logger = getLogger();
  assertEquals(logger.handlers.length, 1);
  const handler = logger.handlers[0] as BaseHandler;
  const msg = "fooBar";
  assertEquals(
    handler.format(
      new LogRecord(msg, [], getLevelByName("INFO")),
    ),
    blue(`[Dry Run] ${msg}`),
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
