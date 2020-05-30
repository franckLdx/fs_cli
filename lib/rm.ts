import { IFlags, exists, getLogger } from "../deps.ts";
import { setup } from "./logger.ts";

export async function rmCommand(options: IFlags, dirs: string[]) {
  await setup(options);
  const logger = getLogger();
  for await (const dir of dirs) {
    if (await exists(dir)) {
      logger.info(`Deleting ${dir}`);
      await Deno.remove(dir, { recursive: true });
    } else {
      logger.info(`${dir} does not exist`);
    }
  }
}
