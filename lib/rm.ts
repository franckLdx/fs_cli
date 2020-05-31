import { IFlags, exists, Command, info } from "../deps.ts";
import { configLog } from "./logger.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .action(rmCommand);
}

export async function rmCommand(options: IFlags, paths: string[]) {
  await configLog(options);
  const remove = removeHOF(options);
  for await (const path of paths) {
    await remove(path);
  }
}

const removeHOF = (options: IFlags) => {
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
