import {
  Command,
  IFlags,
  getLogger,
  Logger,
  ensureDir,
} from "../deps.ts";
import { configLog } from "./tools/logger.ts";
import { assertValidCliOptions, GlobalOptions } from "./tools/options.ts";

export function addMkDirpCommand(command: Command<any, any>) {
  return command
    .command("mkdirp <paths...:string>")
    .action(mkDirpCommand)
    .description("mkdir -p an each path");
}

export async function mkDirpCommand(options: IFlags, paths: string[]) {
  const mkDirpOptions = parseCliOptions(options);
  await configLog(mkDirpOptions);
  const logger = getLogger();
  const mkDirp = mkDirpHOF(logger, mkDirpOptions);

  for await (const path of paths) {
    await mkDirp(path);
  }
}

type MkdirpOptions = GlobalOptions;

const parseCliOptions = (options: any): MkdirpOptions => {
  assertValidCliOptions(options);
  const mkdirpOptions = {
    dry: options["dry"] as boolean,
    quiet: options["quiet"] as boolean,
  };
  return mkdirpOptions;
};

const mkDirpHOF = (logger: Logger, { dry }: MkdirpOptions) => {
  return async (path: string) => {
    logger.info(`Creating ${path}`);
    if (!dry) {
      await ensureDir(path);
    }
  };
};
