import { cleanProcess } from "./process.ts";
import { cleanDir } from "./fs.ts";

export async function cleanTest(p: Deno.Process | undefined) {
  return Promise.all([
    cleanProcess(p),
    cleanDir(),
  ]);
}
