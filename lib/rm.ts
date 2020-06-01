import { IFlags, exists, Command, info } from "../deps.ts";
import { configLog } from "./tools/logger.ts";
import { Options, isOptions } from "./tools/options.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .action(rmCommand);
}

export async function rmCommand(options: IFlags, paths: string[]) {
  if (!isOptions(options)) {
    throw new Error(
      `Receive invalid command line options: ${JSON.stringify(options)}`,
    );
  }
  await configLog(options);
  const remove = removeHOF(options);
  for await (const path of paths) {
    await remove(path);
  }
}

const removeHOF = (options: Options) => {
  return async (path: string) => {
    if (await exists(path)) {
      info(`Deleting ${path}`);
      if (!options.dry) {
        await Deno.remove(path, { recursive: true });
      }
    } else {
      info(`${path} does not exist`);
    }
  };
};
