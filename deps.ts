export { exists } from "https://deno.land/std@0.54.0/fs/exists.ts";

export {
  setup as setupLogger,
  getLogger,
  LoggerConfig,
} from "https://deno.land/std@0.54.0/log/mod.ts";
export { BaseHandler } from "https://deno.land/std@0.54.0/log/handlers.ts";
export { LogRecord } from "https://deno.land/std@0.54.0/log/logger.ts";

export { Command } from "https://deno.land/x/cliffy@v0.8.2/command.ts";
export { IFlags } from "https://deno.land/x/cliffy@v0.8.2/flags.ts";
