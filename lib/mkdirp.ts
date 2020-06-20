import {
  Command,
  IFlags,
  Logger,
} from "../deps.ts";
import { createFsCliLogger } from "./tools/logger.ts";
import {
  assertValidCliOptions,
  GlobalOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { ensureDir } from "./tools/fs.ts";

export function addMkDirpCommand(command: Command<any, any>) {
  return command
    .command("mkdirp <paths...:string>")
    .action(mkDirpCommand)
    .description("mkdir -p an each path");
}

export async function mkDirpCommand(options: IFlags, paths: string[]) {
  const mkDirpOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(mkDirpOptions);
  const mkDirp = mkDirHOF(logger, mkDirpOptions);

  for await (const path of paths) {
    await mkDirp(path);
  }
}

const parseCliOptions = (options: IFlags): GlobalOptions => {
  assertValidCliOptions(options);
  return parseGlobalOptions(options);
};

const mkDirHOF = (logger: Logger, options: GlobalOptions) => {
  return async (path: string) => {
    logger.info(`Creating ${path}`);
    await ensureDir(path, options);
  };
};
