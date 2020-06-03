import {
  IFlags,
  exists,
  Command,
  getLogger,
  Logger,
} from "../deps.ts";
import { configLog } from "./tools/logger.ts";
import { Options, isGlobalOptions, isOptions } from "./tools/options.ts";
import { mapInputs, InputOptions } from "./tools/inputs.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .option(
      "--root [root:string]",
      "root for the glob search",
      { default: "." },
    )
    .option(
      "--dirs [dirs:boolean]",
      "include directories",
      { default: true },
    )
    .option(
      "--files [files:boolean]",
      "include files",
      { default: true },
    )
    .action(rmCommand);
}

type RmOptions = Options & InputOptions;

const isRmOptions = (options: any): options is RmOptions =>
  isOptions<RmOptions, keyof InputOptions>(
    options,
    "root",
    "dirs",
    "files",
  );

export async function rmCommand(options: IFlags, inputs: string[]) {
  if (!isRmOptions(options)) {
    throw new Error(
      `Receive invalid command line options: ${JSON.stringify(options)}`,
    );
  }
  if (!options.dirs && !options.files) {
    throw new Error("Without files and dirs, won't find much to delete !");
  }

  await configLog(options);
  const logger = getLogger();
  const remove = removeHOF(logger, options);

  const paths = await mapInputs(inputs, options);

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
