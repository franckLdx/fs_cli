import { Command, Logger, denoEmptyDir } from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger, displayResult } from "./tools/logger.ts";

export function addEmptyDirCommand(command: Command<any, any>) {
  return command
    .command("emptyDir <paths...:string>")
    .action(emptyDirCommand)
    .description("mkdir -p an each path");
}

export async function emptyDirCommand(options: any, paths: string[]) {
  const emptyDirOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(emptyDirOptions);
  const emptyDir = emptyDirHOF(logger, emptyDirOptions);

  for await (const path of paths) {
    await emptyDir(path);
  }

  displayResult("Emptied", paths.length, emptyDirOptions);
}

const parseCliOptions = (options: any): GlobalOptions => {
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
