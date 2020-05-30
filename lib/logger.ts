import { Log, IFlags, LogRecord, BaseHandler } from "../deps.ts";

export async function setup(option: IFlags) {
  const verbose = option.verbose ?? false;
  const config: Log.LoggerConfig = {
    level: verbose ? "INFO" : "WARNING",
    handlers: ["console"],
  };
  await Log.setup({
    handlers: {
      console: new SimpleHandler("DEBUG", { formatter }),
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
