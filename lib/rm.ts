import { IFlags, Log, exists } from "../deps.ts";
import { setup } from "./logger.ts";

export async function rmCommand(options: IFlags, dirs: string[]) {
  await setup(options);
  for await (const dir of dirs) {
    if (await exists(dir)) {
      Log.info(`Deleting ${dir}`);
      await Deno.remove(dir, { recursive: true });
    }
  }
}
