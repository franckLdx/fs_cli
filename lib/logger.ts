import { Log, IFlags } from "../deps.ts";

export async function setup(option: IFlags) {
  const verbose = option.verbose ?? false;
  const config: Log.LoggerConfig = {
    level: verbose ? "INFO" : "WARNING",
    handlers: ["console"],
  };
  await Log.setup({
    handlers: {
      console: new Log.handlers.ConsoleHandler("DEBUG"),
    },
    loggers: {
      default: config,
    },
  });
}
