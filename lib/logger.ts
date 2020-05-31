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

export async function configLog(option: IFlags) {
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

const getFormatter = (option: IFlags) => {
  const stdformatter = ({ msg }: LogRecord): string => msg;
  const DryRunFormatter = ({ msg }: LogRecord): string => `[Dry Run] ${msg}`;
  return option.dry ? DryRunFormatter : stdformatter;
};

class SimpleHandler extends BaseHandler {
  format(logRecord: LogRecord): string {
    return super.format(logRecord);
  }

  log(msg: string): void {
    console.log(msg);
  }
}
