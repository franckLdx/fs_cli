import { createFsCliLogger } from "./Logger.ts";
import { assertEquals, blue } from "../../dev_deps.ts";
import {
  getLogger,
  LogRecord,
  getLevelByName,
  BaseHandler,
} from "../../deps.ts";

Deno.test("Logger: should use relevant handler: not dry mode", async () => {
  const logger = await createFsCliLogger({ quiet: false, dry: false });
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
  const logger = await createFsCliLogger({ quiet: false, dry: true });
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
  const logger = await createFsCliLogger({ quiet: false, dry: false });
  assertEquals(logger.levelName, "INFO");
});

Deno.test("Logger: should set warning level", async () => {
  const logger = await createFsCliLogger({ quiet: true, dry: false });
  assertEquals(logger.levelName, "WARNING");
});
