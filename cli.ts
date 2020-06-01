import { Command } from "./deps.ts";
import { addRmCommand } from "./lib/rm.ts";
import { addGlobalOptions } from "./lib/tools/options.ts";

const command = new Command()
  .description("fs_cli tools: handle files through command line")
  .version("0.1.1");

addGlobalOptions(command);
addRmCommand(command);

await command.parse(Deno.args);
