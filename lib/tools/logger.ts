import {
  LoggerConfig,
  setupLogger,
  handlers,
  getLogger,
  badge
} from "../../deps.ts";
import type { GlobalOptions } from "./options.ts";

export async function createFsCliLogger(option: GlobalOptions) {
  await configLog(option);
  return getLogger();
}

const configLog = async (option: GlobalOptions) => {
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
};

const getFormatter = (option: GlobalOptions) => {
  return option.dry ? "[Dry Run] {msg}" : "{msg}";
};

export function displayResult(message: string, count: number, options: GlobalOptions)  {
  const resultBadge = options.dry ? badge("Skipped", `${count}`, { msgBg: "yellow" }): badge(message, `${count}`, { msgBg: "green" });
  console.log('\n',resultBadge);
}