import {
  Command,
  SEP,
  join,
  basename,
  dirname,
  Logger,
  DenoCopyOptions,
  badge,
} from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger, displayResult } from "./tools/logger.ts";
import { ensureDir, copy, CopyOptions, lstat } from "./tools/fs.ts";
import {
  SearchOptions,
  searchOptionsName,
  parseSearchOptions,
  addSearchOptions,
  search,
} from "./tools/search.ts";

export function addCpCommand(command: Command<any, any>) {
  command
    .command("cp <inputs...:string>")
    .option(
      "-f, --force [force:boolean]",
      "overwrite destination if exist",
      { default: false },
    )
    .option(
      "-p, --preserve [preserve:boolean]",
      "set last modification and access times to the ones of the original source files (When `false`, timestamp behavior is OS-dependent)",
      { default: false },
    );
  addSearchOptions(command);
  command.action(cpCommand);
}

type CpOptions = GlobalOptions & DenoCopyOptions & SearchOptions;

async function cpCommand(options: any, inputs: string[]) {
  const cpOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(cpOptions);

  const [sources, dest] = await parseIpnuts(inputs, cpOptions);

  const doCopy = copyHOF(logger, cpOptions);
  for await (const source of sources) {
    await doCopy(source, dest);
  }

  displayResult("Copied", sources.length, cpOptions);
}

const copyHOF = (logger: Logger, cpOptions: CpOptions) => {
  const denoCopyOptions: DenoCopyOptions = {
    overwrite: cpOptions.overwrite,
    preserveTimestamps: cpOptions.preserveTimestamps,
  };
  const copyOptions: CopyOptions = { global: cpOptions, copy: denoCopyOptions };
  return async (source: string, dest: string) => {
    const actualDest = await getActualDest(source, dest, cpOptions);
    logger.info(`Copying ${source} to ${actualDest}`);
    if (!cpOptions.dry) {
      await copy(source, actualDest, copyOptions);
    }
  };
};

const getActualDest = async (
  source: string,
  dest: string,
  cpOptions: CpOptions,
) => {
  if (!dest.includes(SEP)) {
    return dest;
  }
  const sourceStat = await lstat(source);
  if (!sourceStat.isFile) {
    return dest;
  }
  if (dest.endsWith(SEP)) {
    await ensureDir(dest, cpOptions);
    const fileName = basename(source);
    return join(dest, fileName);
  } else {
    const dir = dirname(dest);
    await ensureDir(dir, cpOptions);
    return dest;
  }
};

const parseIpnuts = async (inputs: string[], options: CpOptions) => {
  if (inputs.length < 2) {
    throw new Error("Must have at least one source and the destination");
  }
  const rawSources = inputs.slice(0, inputs.length - 1);
  const sources = await search(rawSources, options);
  let dest = inputs[inputs.length - 1];
  if (sources.length > 1 && !dest.endsWith(SEP)) {
    dest += SEP;
  }
  return [sources, dest] as const;
};

const parseCliOptions = (options: any): CpOptions => {
  assertValidCliOptions(
    options,
    "force",
    "preserve",
    ...searchOptionsName,
  );
  return {
    ...parseGlobalOptions(options),
    ...parseSearchOptions(options),
    overwrite: options["force"] as boolean,
    preserveTimestamps: options["preserve"] as boolean,
  };
};
