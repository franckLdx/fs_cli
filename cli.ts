import { Command } from "./deps.ts";
import { rmDirCommand } from "./lib/rm_dir.ts";
import { emptyDirCommand } from "./lib/empty_dir.ts";

await new Command()
  .version("0.1.0")
  .command("rmDir <dirs...:string>")
  .action(rmDirCommand)
  .command("emptyDir <dirs...:string>")
  .action(emptyDirCommand)
  .parse(Deno.args);
