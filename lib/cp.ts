import {
  Command,
  IFlags,
  SEP,
  join,
  basename,
  dirname,
  Logger,
  DenoCopyOptions,
} from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger } from "./tools/logger.ts";
import { ensureDir, copy, CopyOptions } from "./tools/fs.ts";

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

type CpOptions = GlobalOptions & DenoCopyOptions;

async function cpCommand(options: IFlags, inputs: string[]) {
  const cpOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(cpOptions);

  const [sources, dest] = parseIpnuts(inputs);

  const doCopy = copyHOF(logger, cpOptions);
  for await (const source of sources) {
    await doCopy(source, dest);
  }
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
  const sourceStat = await Deno.lstat(source);
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

const parseIpnuts = (inputs: string[]) => {
  if (inputs.length < 2) {
    throw new Error("Must have at least one source and the destination");
  }
  const sources = inputs.slice(0, inputs.length - 1);
  let dest = inputs[inputs.length - 1];
  if (sources.length > 1 && !dest.endsWith(SEP)) {
    dest += SEP;
  }
  return [sources, dest] as const;
};

const isDirPath = (path: string) => path.includes(SEP);

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
