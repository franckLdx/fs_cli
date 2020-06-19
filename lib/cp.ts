import {
  Command,
  IFlags,
  copy as denoCopy,
  ensureDir,
  SEP,
  join,
  basename,
  dirname,
  Logger,
  CopyOptions,
} from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger } from "./tools/logger.ts";

export function addCpCommand(command: Command<any, any>) {
  return command
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
    )
    .action(cpCommand);
}

type CpOptions = GlobalOptions & CopyOptions;

async function cpCommand(options: IFlags, inputs: string[]) {
  const cpOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(cpOptions);
  if (inputs.length < 2) {
    throw new Error("Must have at least one source and the destination");
  }

  const sources = inputs.slice(0, inputs.length - 1);
  const dest = inputs[inputs.length - 1];

  await ensureDest(sources, dest, cpOptions);
  const copy = copyHOF(logger, cpOptions);

  for await (const source of sources) {
    await copy(source, dest);
  }
}

const copyHOF = (logger: Logger, cpOptions: CpOptions) => {
  return async (source: string, dest: string) => {
    logger.info(`Copying ${source} to ${dest}`);
    const actualDest = await getActualDest(source, dest);
    if (!cpOptions.dry) {
      await denoCopy(source, actualDest, cpOptions);
    }
  };
};

const getActualDest = async (
  source: string,
  dest: string,
) => {
  try {
    const destStat = await Deno.lstat(dest);
    if (!destStat.isDirectory) {
      return dest;
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return dest;
    }
  }
  const sourceStat = await Deno.lstat(source);
  if (sourceStat.isDirectory) {
    return dest;
  }
  const fileName = basename(source);
  return join(dest, fileName);
};

const parseCliOptions = (options: IFlags): CpOptions => {
  assertValidCliOptions(
    options,
    "force",
    "preserve",
  );
  return {
    ...parseGlobalOptions(options),
    overwrite: options["force"] as boolean,
    preserveTimestamps: options["preserve"] as boolean,
  };
};

const ensureDest = async (
  sources: string[],
  dest: string,
  cpOptions: CpOptions,
) => {
  const destIsDir = sources.length > 1 || dest.includes(SEP);
  if (destIsDir && !cpOptions.dry) {
    const dir = dest.endsWith(SEP) ? dest : dirname(dest);
    await ensureDir(dir);
  }
};
