import { Command, IFlags, copy, assert, exists, ensureDir } from "../deps.ts";
import {
  GlobalOptions,
  assertValidCliOptions,
  parseGlobalOptions,
} from "./tools/options.ts";
import { createFsCliLogger } from "./tools/logger.ts";

export function addCopyCommand(command: Command<any, any>) {
  return command
    .command("copy <inputs...:string>")
    .action(copyCommand);
}

async function copyCommand(options: IFlags, inputs: string[]) {
  const copyOptions = parseCliOptions(options);
  const logger = await createFsCliLogger(copyOptions);

  assert(
    inputs.length >= 2,
    "must have at least one source and the destination",
  );
  const sources = inputs.slice(0, inputs.length - 1);
  const dest = inputs[inputs.length - 1];

  if (sources.length > 1 && !copyOptions.dry && !await exists(dest)) {
    await ensureDir(dest);
  }

  for await (const source of sources) {
    logger.info(`Copying ${source}`);
    if (!copyOptions.dry) {
      await copy(source, dest);
    }
  }
}

const parseCliOptions = (options: any): GlobalOptions => {
  assertValidCliOptions(
    options,
  );
  return parseGlobalOptions(options);
};
