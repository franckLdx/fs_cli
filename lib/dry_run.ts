import { Command } from "../deps.ts";

export function addDryRunOption(command: Command<any, any>) {
  return command.option("-d, --dryRun [dry:boolean]", "dry run mode", {
    default: false,
    global: true,
  });
}
