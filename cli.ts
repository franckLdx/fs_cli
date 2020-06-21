import { Command } from "./deps.ts";
import { addRmCommand } from "./lib/rm.ts";
import { addMkDirpCommand } from "./lib/mkdirp.ts";
import { addCpCommand } from "./lib/cp.ts";
import { addGlobalOptions } from "./lib/tools/options.ts";

const command = new Command()
  .description("fs_cli tools: handle files through command line")
  .version("0.5.1");

addGlobalOptions(command);
addCpCommand(command);
addRmCommand(command);
addMkDirpCommand(command);

await command.parse(Deno.args);
