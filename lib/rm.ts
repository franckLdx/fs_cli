import {
  IFlags,
  exists,
  Command,
  Logger,
} from "../deps.ts";
import { createFsCliLogger } from "./tools/logger.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { search, SearchOptions } from "./tools/search.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .description("rm -rf on each file and directory")
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

async function rmCommand(options: IFlags, inputs: string[]) {
  const rmOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(rmOptions);
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

const parseCliOptions = (options: IFlags): RmOptions => {
  assertValidCliOptions(
    options,
    "globRoot",
    "globDirs",
    "globFiles",
  );
  const rmOptions = {
    ...parseGlobalOptions(options),
    root: options["globRoot"] as string,
    includeDirs: options["globDirs"] as boolean,
    includeFiles: options["globFiles"] as boolean,
  };
  if (!rmOptions.includeFiles && !rmOptions.includeDirs) {
    throw new Error("Without files and dirs, won't find much to delete !");
  }
  return rmOptions;
};
