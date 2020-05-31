import { Command } from "./deps.ts";
import { addRmCommand } from "./lib/rm.ts";
import { addLogOptions } from "./lib/logger.ts";

const command = new Command()
  .description("fs_cli tools: handle files through command line")
  .version("0.1.1");

addLogOptions(command);
addRmCommand(command);

await command.parse(Deno.args);
