import { Command } from "./deps.ts";
import { addRmCommand } from "./lib/rm.ts";
import { addMkDirpCommand } from "./lib/mkdirp.ts";
import { addCopyCommand } from "./lib/copy.ts";
import { addGlobalOptions } from "./lib/tools/options.ts";

const command = new Command()
  .description("fs_cli tools: handle files through command line")
  .version("0.5.0");

addGlobalOptions(command);
addCopyCommand(command);
addRmCommand(command);
addMkDirpCommand(command);

await command.parse(Deno.args);
