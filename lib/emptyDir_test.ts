import { cleanTest } from "./tools/test/misc.ts";
import {
  makeDirectory,
  assertExists,
  makeDirectories,
  makeFiles,
} from "./tools/test/fs.ts";
import {
  runProcess,
  checkProcess,
  getPrefixMessage,
} from "./tools/test/process.ts";
import { join } from "../deps.ts";
import { optionsDry } from "./tools/test/options.ts";

const runEmptyDirProcess = runProcess("emptyDir");
const assertNotExists = (paths: string[]) => assertExists(paths, false);

const getOutputMessage = (path: string, dryRun = false) =>
  `${getPrefixMessage(dryRun)}Emptying ${path}`;

const getoutputMessages = (paths: string[], dryRun = false) =>
  paths.map((path) => getOutputMessage(path, dryRun));

Deno.test({
  only: false,
  name: "emptyDir: create a new dir",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const tmpDir = await makeDirectory();
      const targetDirPath = join(tmpDir, "dest");
      p = await runEmptyDirProcess({ paths: [targetDirPath] });
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: [getOutputMessage(targetDirPath)],
          expectedErrors: [""],
        },
      );
      await assertExists([targetDirPath]);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "emptyDir: create a new dir in dry mode: not created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const tmpDir = await makeDirectory();
      const targetDirPath = join(tmpDir, "dest");
      p = await runEmptyDirProcess(
        { paths: [targetDirPath], options: optionsDry },
      );
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: [getOutputMessage(targetDirPath, true)],
          expectedErrors: [""],
        },
      );
      await assertNotExists([targetDirPath]);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "emptyDir: create new dirs",
  async fn() {
    let p: Deno.Process | undefined;
    const destDirNames = [join("des1", "sub"), "des2"];
    try {
      const tmpDir = await makeDirectory();
      const targetDirPaths = destDirNames.map((dest) => join(tmpDir, dest));
      p = await runEmptyDirProcess({ paths: targetDirPaths });
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(targetDirPaths),
          expectedErrors: [""],
        },
      );
      await assertExists(targetDirPaths);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "emptyDir: create new dirs in dry mode: not created",
  async fn() {
    let p: Deno.Process | undefined;
    const destDirNames = [join("des1", "sub"), "des2"];
    try {
      const tmpDir = await makeDirectory();
      const targetDirPaths = destDirNames.map((dest) => join(tmpDir, dest));
      p = await runEmptyDirProcess(
        { paths: targetDirPaths, options: optionsDry },
      );
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(targetDirPaths, true),
          expectedErrors: [""],
        },
      );
      await assertNotExists(targetDirPaths);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "emptyDir: empty existing dirs",
  async fn() {
    let p: Deno.Process | undefined;
    const targetDirsName = [join("des1", "sub"), "des2"];
    const targetFilesName = targetDirsName.flatMap(
      (targetDirName) =>
        ["file1", "file2"].map(
          (targetFileName) => join(targetDirName, targetFileName),
        ),
    );
    try {
      const targetDirsPath = await makeDirectories(targetDirsName);
      const targetFilsPath = await makeFiles(targetFilesName);
      p = await runEmptyDirProcess({ paths: targetDirsPath });
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(targetDirsPath),
          expectedErrors: [""],
        },
      );
      await assertNotExists(targetFilsPath);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "emptyDir: empty existing dirs in dry mode: nothing done",
  async fn() {
    let p: Deno.Process | undefined;
    const targetDirsName = [join("des1", "sub"), "des2"];
    const targetFilesName = targetDirsName.flatMap(
      (targetDirName) =>
        ["file1", "file2"].map(
          (targetFileName) => join(targetDirName, targetFileName),
        ),
    );
    try {
      const targetDirsPath = await makeDirectories(targetDirsName);
      const targetFilsPath = await makeFiles(targetFilesName);
      p = await runEmptyDirProcess(
        { paths: targetDirsPath, options: optionsDry },
      );
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(targetDirsPath, true),
          expectedErrors: [""],
        },
      );
      await assertExists(targetFilsPath);
    } finally {
      await cleanTest(p);
    }
  },
});
