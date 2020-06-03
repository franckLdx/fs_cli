import { ensureFile } from "../../dev_deps.ts";
import { exists } from "../../deps.ts";

let tmpDirectory: string | undefined;

export async function makeDirectory() {
  tmpDirectory = await Deno.makeTempDir({ prefix: "fs_cli" });
  return tmpDirectory;
}

export async function makeFile(fileName: string) {
  if (!tmpDirectory) {
    await makeDirectory();
  }
  const filePath = `${tmpDirectory}/${fileName}`;
  await ensureFile(filePath);
  return filePath;
}

export async function cleanDir() {
  if (!tmpDirectory) {
    return;
  }
  if (await exists(tmpDirectory)) {
    await Deno.remove(tmpDirectory, { recursive: true });
  }
}
