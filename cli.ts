import { Command } from "./deps.ts";
import { rmCommand, addRmCommand } from "./lib/rm.ts";
import { addLogOptions } from "./lib/logger.ts";

const command = new Command()
  .version("0.1.0");

addLogOptions(command);
addRmCommand(command);

await command.parse(Deno.args);
