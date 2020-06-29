import {
  ensureFile,
  ensureDir,
  assert,
  assertEquals,
} from "../../../dev_deps.ts";
import { exists, join, basename, dirname } from "../../../deps.ts";

let tmpDirectory: string | undefined;

export async function makeDirectories(dirsPath: string[]) {
  let fullDirsPath = [];
  for await (const dirPath of dirsPath) {
    fullDirsPath.push(await makeDirectory(dirPath));
  }
  return fullDirsPath;
}

export async function makeDirectory(path?: string) {
  if (!tmpDirectory) {
    tmpDirectory = await Deno.makeTempDir({ prefix: "fs_cli_" });
  }
  let result = tmpDirectory!;
  if (path) {
    result = join(result, path);
    await ensureDir(result);
  }
  return result;
}

export async function makeFiles(filesPath: string[]) {
  let fullFilesPath = [];
  for await (const filePath of filesPath) {
    fullFilesPath.push(await makeFile(filePath));
  }
  return fullFilesPath;
}

export async function makeFile(filePath: string) {
  const fileName = basename(filePath);
  const fileDir = dirname(filePath);
  const fullDirPath = await makeDirectory(fileDir);
  const fullFilePath = join(fullDirPath, fileName);
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
