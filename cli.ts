import { Command } from "./deps.ts";
import { rmCommand } from "./lib/rm.ts";

await new Command()
  .version("0.1.0")
  .option("-v, --verbose [verbose:boolean]", "verbose mode", {
    default: false,
    global: true,
  })
  .command("rm <paths...:string>")
  .action(rmCommand)
  .parse(Deno.args);
