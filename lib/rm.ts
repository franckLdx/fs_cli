import { IFlags, exists, getLogger, Command, info } from "../deps.ts";
import { setup } from "./logger.ts";

export function addRmCommand(command: Command<any, any>) {
  return command
    .command("rm <paths...:string>")
    .action(rmCommand);
}

export async function rmCommand(options: IFlags, paths: string[]) {
  await setup(options);
  for await (const path of paths) {
    if (await exists(path)) {
      info(`Deleting ${path}`);
      await Deno.remove(path, { recursive: true });
    } else {
      info(`${path} does not exist`);
    }
  }
}
