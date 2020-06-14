import {
  ensureFile,
  ensureDir,
  assert,
  assertEquals,
} from "../../../dev_deps.ts";
import { exists, join } from "../../../deps.ts";

let tmpDirectory: string | undefined;

export async function makeDirectory(path?: string) {
  if (!tmpDirectory) {
    tmpDirectory = await Deno.makeTempDir({ prefix: "fs_cli" });
  }
  let result = tmpDirectory!;
  if (path) {
    result = join(result, path);
    await ensureDir(result);
  }
  return result;
}

export async function makeSubDirectory(path: string) {
  const fullPath = join(await makeDirectory(), path);
  await ensureDir(fullPath);
  return fullPath;
}

export async function makeFile(fileName: string) {
  const filePath = join(await makeDirectory(), fileName);
  await ensureFile(filePath);
  return filePath;
}

export async function cleanDir() {
  if (!tmpDirectory) {
    return;
  }
  if (await exists(tmpDirectory)) {
    await Deno.remove(tmpDirectory, { recursive: true });
    tmpDirectory = undefined;
  }
}

export async function assertExists(paths: string[], exist = true) {
  for await (const path of paths) {
    assertEquals(
      await exists(path),
      exist,
      `${path} should ${!exist ? "not" : ""} exist`,
    );
  }
}

export async function assertCreated(...paths: string[]) {
  await assertExists(paths, true);
}

export async function assertNotCreated(...paths: string[]) {
  await assertExists(paths, false);
}
