import {
  ensureFile,
  ensureDir,
  assert,
  assertEquals,
} from "../../../dev_deps.ts";
import { exists, SEP } from "../../../deps.ts";

let tmpDirectory: string | undefined;

export async function makeDirectory() {
  if (!tmpDirectory) {
    tmpDirectory = await Deno.makeTempDir({ prefix: "fs_cli" });
  }
  return tmpDirectory;
}

export async function makeSubDirectory(path: string) {
  const fullPath = await getFullPath(await makeDirectory(), path);
  await ensureDir(fullPath);
  return fullPath;
}

export async function makeFile(fileName: string) {
  const filePath = getFullPath(await makeDirectory(), fileName);
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
    assertEquals(await exists(path), exist);
  }
}

const getFullPath = (...paths: string[]) => {
  const fullPath = paths.reduce(
    (acc, path) => `${acc}${path}${SEP}`,
    "",
  );
  return fullPath.slice(0, fullPath.length - 1);
};
