import {
  IFlags,
  LogRecord,
  BaseHandler,
  LoggerConfig,
  setupLogger,
  Command,
} from "../deps.ts";

export function addLogOptions(command: Command<any, any>) {
  return command.option("-q, --quiet [quiet:boolean]", "quiet mode", {
    default: false,
    global: true,
  });
}

export async function setup(option: IFlags) {
  const handlerName = "console";
  const quiet = option.quiet ?? true;
  const config: LoggerConfig = {
    level: quiet ? "WARNING" : "INFO",
    handlers: [handlerName],
  };
  const handler = new SimpleHandler("DEBUG", { formatter });
  await setupLogger({
    handlers: {
      [handlerName]: handler,
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
