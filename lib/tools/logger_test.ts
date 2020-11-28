import { createFsCliLogger } from "./logger.ts";
import { assertEquals, blue } from "../../dev_deps.ts";
import {
  getLogger,
  LogRecord,
  getLevelByName,
  BaseHandler,
} from "../../deps.ts";

const getLogRecort = (msg: string, args = []) =>
  new LogRecord(
    {
      msg,
      args: [],
      level: getLevelByName("INFO"),
      loggerName: "console",
    },
  );

Deno.test({
  name: "Logger: should use relevant handler: not dry mode",
  async fn() {
    const logger = await createFsCliLogger({ quiet: false, dry: false });
    assertEquals(logger.handlers.length, 1);
    const handler = logger.handlers[0] as BaseHandler;
    const msg = "fooBar";
    assertEquals(
      handler.format(getLogRecort(msg)),
      blue(msg),
    );
  },
});

Deno.test({
  name: "Logger: should use relevant handler: dry mode",
  async fn() {
    const logger = await createFsCliLogger({ quiet: false, dry: true });
    assertEquals(logger.handlers.length, 1);
    const handler = logger.handlers[0] as BaseHandler;
    const msg = "fooBar";
    assertEquals(
      handler.format(getLogRecort(msg)),
      blue(`[Dry Run] ${msg}`),
    );
  },
});

Deno.test({
  name: "Logger: should set info level",
  async fn() {
    const logger = await createFsCliLogger({ quiet: false, dry: false });
    assertEquals(logger.levelName, "INFO");
  },
});

Deno.test({
  name: "Logger: should set warning level",
  async fn() {
    const logger = await createFsCliLogger({ quiet: true, dry: false });
    assertEquals(logger.levelName, "WARNING");
  },
});
