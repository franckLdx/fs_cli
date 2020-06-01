import { Command, ICommandOption } from "../../deps.ts";

export interface Options {
  dry: boolean;
  quiet: boolean;
}

export function addGlobalOptions(command: Command<any, any>) {
  const opts: ICommandOption<any, any> = {
    default: false,
    global: true,
  };
  return command
    .option("-d, --dry [dryRun:boolean]", "dry run mode", opts)
    .option("-q, --quiet [quiet:boolean]", "quiet mode", opts);
}

export function isOptions(options: any): options is Options {
  return "quiet" in options && "dry" in options;
}
