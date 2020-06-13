import {
  Command,
  IFlags,
  getLogger,
  Logger,
  ensureDir,
} from "../deps.ts";
import { createFsCliLogger } from "./tools/logger.ts";
import {
  assertValidCliOptions,
  GlobalOptions,
  parseGlobalOptions,
} from "./tools/options.ts";

export function addMkDirpCommand(command: Command<any, any>) {
  return command
    .command("mkdirp <paths...:string>")
    .action(mkDirpCommand)
    .description("mkdir -p an each path");
}

export async function mkDirpCommand(options: IFlags, paths: string[]) {
  const mkDirpOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(mkDirpOptions);
  const mkDirp = mkDirpHOF(logger, mkDirpOptions);

  for await (const path of paths) {
    await mkDirp(path);
  }
}

const parseCliOptions = (options: any): GlobalOptions => {
  assertValidCliOptions(options);
  return parseGlobalOptions(options);
};

const mkDirpHOF = (logger: Logger, { dry }: GlobalOptions) => {
  return async (path: string) => {
    logger.info(`Creating ${path}`);
    if (!dry) {
      await ensureDir(path);
    }
  };
};
