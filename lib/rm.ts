import {
  exists,
  Command,
  Logger,
} from "../deps.ts";
import { createFsCliLogger, displayResult } from "./tools/logger.ts";
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

async function rmCommand(options: any, inputs: string[]) {
  const rmOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(rmOptions);
  const remove = removeHOF(logger, rmOptions);

  const paths = await search(inputs, rmOptions);

  let actualyRemoved = 0;
  for await (const path of paths) {
    if (await remove(path)) {
      actualyRemoved++;
    }
  }

  displayResult("Removed", actualyRemoved, rmOptions);
}

const removeHOF = (logger: Logger, { dry }: GlobalOptions) => {
  return async (path: string) => {
    if (!(await exists(path))) {
      return false
    }
    logger.info(`Deleting ${path}`);
    if (!dry) {
      await Deno.remove(path, { recursive: true });
    }
    return true;
  };
};

const parseCliOptions = (options: any): RmOptions => {
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
