import { Command, IFlags, Logger, denoEmptyDir } from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger } from "./tools/logger.ts";
import { optionsDry } from "./tools/test/options.ts";

export function addEmptyDirCommand(command: Command<any, any>) {
  return command
    .command("emptyDir <paths...:string>")
    .action(emptyDirCommand)
    .description("mkdir -p an each path");
}

async function emptyDirCommand(options: IFlags, paths: string[]) {
  const emptyDirOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(emptyDirOptions);
  const emptyDir = emptyDirHOF(logger, emptyDirOptions);

  for await (const path of paths) {
    await emptyDir(path);
  }
}

const parseCliOptions = (options: IFlags): GlobalOptions => {
  assertValidCliOptions(options);
  return parseGlobalOptions(options);
};

const emptyDirHOF = (logger: Logger, options: GlobalOptions) => {
  return async (path: string) => {
    logger.info(`Emptying ${path}`);
    if (!options.dry) {
      await denoEmptyDir(path);
    }
  };
};
