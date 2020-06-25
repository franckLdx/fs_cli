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
import {
  search,
  SearchOptions,
  searchOptionsName,
  parseSearchOptions,
  addSearchOptions,
} from "./tools/search.ts";

export function addRmCommand(command: Command<any, any>) {
  command
    .command("rm <paths...:string>")
    .description("rm -rf on each file and directory");
  addSearchOptions(command);
  command.action(rmCommand);
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
    ...searchOptionsName,
  );
  const rmOptions = {
    ...parseGlobalOptions(options),
    ...parseSearchOptions(options),
  };
  if (!rmOptions.includeFiles && !rmOptions.includeDirs) {
    throw new Error("Without files and dirs, won't find much to delete !");
  }
  return rmOptions;
};
