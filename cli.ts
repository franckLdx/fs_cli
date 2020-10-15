import { Command } from "./deps.ts";
import { addRmCommand } from "./lib/rm.ts";
import { addMkDirpCommand } from "./lib/mkdirp.ts";
import { addCpCommand } from "./lib/cp.ts";
import { addGlobalOptions } from "./lib/tools/options.ts";
import { addEmptyDirCommand } from "./lib/emptyDir.ts";

const command = new Command()
  .description("fs_cli tools: handle files through command line")
  .version("0.7.4");

addGlobalOptions(command);

addCpCommand(command);
addEmptyDirCommand(command);
addMkDirpCommand(command);
addRmCommand(command);

await command.parse(Deno.args);
