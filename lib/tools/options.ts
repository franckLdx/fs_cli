import { Command, ICommandOption } from "../../deps.ts";

export interface GlobalOptions {
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

export function assertValidCliOptions<T>(
  options: any,
  ...keys: Array<string>
) {
  for (const key of ["quiet", "dry", ...keys]) {
    if (!(key in options)) {
      throw new Error(`cli options not valid, missing ${key}`);
    }
  }
}

export function parseGlobalOptions(options: any): GlobalOptions {
  return {
    dry: options["dry"] as boolean,
    quiet: options["quiet"] as boolean,
  };
}
