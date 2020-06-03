import {
  IFlags,
  exists,
  Command,
  getLogger,
  Logger,
} from "../deps.ts";
import { configLog } from "./tools/logger.ts";
import { Options, isOptions } from "./tools/options.ts";
import { mapInputs } from "./tools/inputs.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .option(
      "-r, --root [root:string]",
      "root for the glob search",
      { default: "." },
    )
    .action(rmCommand);
}

type RmOptions = Options & { root: string };

const isRmOptions = (options: any): options is RmOptions =>
  isOptions(options) && "root" in options;

export async function rmCommand(options: IFlags, inputs: string[]) {
  if (!isRmOptions(options)) {
    throw new Error(
      `Receive invalid command line options: ${JSON.stringify(options)}`,
    );
  }

  await configLog(options);
  const logger = getLogger();
  const remove = removeHOF(logger, options);

  const paths = await mapInputs(options.root, inputs);

  for await (const path of paths) {
    await remove(path);
  }
}

const removeHOF = (logger: Logger, { dry }: Options) => {
  return async (path: string) => {
    if (await exists(path)) {
      logger.info(`Deleting ${path}`);
      if (!dry) {
        await Deno.remove(path, { recursive: true });
      }
    } else {
      logger.info(`${path} does not exist`);
    }
  };
};
