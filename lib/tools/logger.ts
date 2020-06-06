import {
  LogRecord,
  BaseHandler,
  LoggerConfig,
  setupLogger,
} from "../../deps.ts";
import { GlobalOptions } from "./options.ts";

export async function configLog(option: GlobalOptions) {
  const handlerName = "console";
  const quiet = option.quiet ?? true;
  const config: LoggerConfig = {
    level: quiet ? "WARNING" : "INFO",
    handlers: [handlerName],
  };
  const handler = new SimpleHandler(
    "DEBUG",
    { formatter: getFormatter(option) },
  );
  await setupLogger({
    handlers: {
      [handlerName]: handler,
    },
    loggers: {
      default: config,
    },
  });
}

const getFormatter = (option: GlobalOptions) => {
  return option.dry ? "[Dry Run] {msg}" : "{msg}";
};

export class SimpleHandler extends BaseHandler {
  public isSimpleHandled = true;

  format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }

  log(msg: string): void {
    console.log(msg);
  }
}
