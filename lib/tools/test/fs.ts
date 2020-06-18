import {
  ensureFile,
  ensureDir,
  assert,
  assertEquals,
} from "../../../dev_deps.ts";
import { exists, join, basename, dirname } from "../../../deps.ts";

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

export async function makeFile(filePath: string) {
  const fileName = basename(filePath);
  const fileDir = dirname(filePath);
  const fullFilePath = join(await makeDirectory(fileDir), filePath);
  await ensureFile(fullFilePath);
  return fullFilePath;
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

export async function assertDirCreated(...paths: string[]) {
  for await (const path of paths) {
    try {
      const stat = await Deno.lstat(path);
      assert(stat.isDirectory, `${path} is not a directory`);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        assert(false, `${path} does not exist`);
      }
      throw err;
    }
  }
}

export async function assertFileCreated(...paths: string[]) {
  for await (const path of paths) {
    try {
      const stat = await Deno.lstat(path);
      assert(stat.isFile, `${path} is not a file`);
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        assert(false, `${path} does not exist`);
      }
      throw err;
    }
  }
}

export async function assertNotCreated(...paths: string[]) {
  await assertExists(paths, false);
}
