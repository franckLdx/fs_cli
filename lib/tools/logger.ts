import {
  LoggerConfig,
  setupLogger,
  handlers,
} from "../../deps.ts";
import { GlobalOptions } from "./options.ts";

export async function configLog(option: GlobalOptions) {
  const handlerName = "console";
  const quiet = option.quiet ?? true;
  const config: LoggerConfig = {
    level: quiet ? "WARNING" : "INFO",
    handlers: [handlerName],
  };
  const handler = new handlers.ConsoleHandler("DEBUG", {
    formatter: getFormatter(option),
  });
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
