import { IFlags, exists, getLogger, Command, info } from "../deps.ts";
import { setup } from "./logger.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .action(rmCommand);
}

export async function rmCommand(options: IFlags, paths: string[]) {
  await setup(options);
  const remove = removeHOF(options);
  for await (const path of paths) {
    await remove(path);
  }
}

const removeHOF = (options: IFlags) => {
  return async (path: string) => {
    if (options.dryRun) {
      info(`Shoudl delete ${path}`);
    } else {
      info(`Deleting ${path}`);
      await Deno.remove(path, { recursive: true });
    }
  };
};
