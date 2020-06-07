import {
  IFlags,
  exists,
  Command,
  getLogger,
  Logger,
} from "../deps.ts";
import { configLog } from "./tools/logger.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
} from "./tools/options.ts";
import { search, SearchOptions } from "./tools/search.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .option(
      "--glob-root [glob-root:string]",
      "root for the glob search",
      { default: "." },
    )
    .option(
      "--glob-dirs [glob-dirs:boolean]",
      "include directories in the glob search",
      { default: true },
    )
    .option(
      "--glob-files [glob-files:boolean]",
      "include files in the glob search",
      { default: true },
    )
    .action(rmCommand);
}

type RmOptions = GlobalOptions & SearchOptions;

export async function rmCommand(options: IFlags, inputs: string[]) {
  const rmOptions = parseCliOptions(options);

  await configLog(rmOptions);
  const logger = getLogger();
  const remove = removeHOF(logger, rmOptions);

  const paths = await search(inputs, rmOptions);

  for await (const path of paths) {
    await remove(path);
  }
}

const removeHOF = (logger: Logger, { dry }: GlobalOptions) => {
  return async (path: string) => {
    if (await exists(path)) {
      logger.info(`Deleting ${path}`);
      if (!dry) {
        await Deno.remove(path, { recursive: true });
      }
    }
  };
};

const parseCliOptions = (options: any): RmOptions => {
  assertValidCliOptions(
    options,
    "globRoot",
    "globDirs",
    "globFiles",
  );
  const rmOptions = {
    dry: options["dry"] as boolean,
    quiet: options["quiet"] as boolean,
    root: options["globRoot"] as string,
    includeDirs: options["globDirs"] as boolean,
    includeFiles: options["globFiles"] as boolean,
  };
  if (!rmOptions.includeFiles && !rmOptions.includeDirs) {
    throw new Error("Without files and dirs, won't find much to delete !");
  }
  return rmOptions;
};
