import {
  IFlags,
  LogRecord,
  BaseHandler,
  LoggerConfig,
  setupLogger,
} from "../deps.ts";

export async function setup(option: IFlags) {
  const verbose = option.verbose ?? false;
  const config: LoggerConfig = {
    level: verbose ? "INFO" : "WARNING",
    handlers: ["console"],
  };
  const handler = new SimpleHandler("DEBUG", { formatter });
  await setupLogger({
    handlers: {
      console: handler,
    },
    loggers: {
      default: config,
    },
  });
}

const formatter = ({ msg }: LogRecord): string => {
  return msg;
};

class SimpleHandler extends BaseHandler {
  format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }

  log(msg: string): void {
    console.log(msg);
  }
}
