import { cleanTest } from "./tools/test/misc.ts";
import { makeDirectory, assertExists } from "./tools/test/fs.ts";
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
  name: "empty: create a new dir",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const destDirPath = join(dir, "dest");
      p = await runEmptyDirProcess({ paths: [destDirPath] });
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: [getOutputMessage(destDirPath)],
          expectedErrors: [""],
        },
      );
      await assertExists([destDirPath]);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "empty: create a new dir in dry mode: not created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const destDirPath = join(dir, "dest");
      p = await runEmptyDirProcess(
        { paths: [destDirPath], options: optionsDry },
      );
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: [getOutputMessage(destDirPath, true)],
          expectedErrors: [""],
        },
      );
      await assertNotExists([destDirPath]);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "empty: create new dirs",
  async fn() {
    let p: Deno.Process | undefined;
    const destDirNames = [join("des1", "sub"), "des2"];
    try {
      const dir = await makeDirectory();
      const destDirPaths = destDirNames.map((dest) => join(dir, dest));
      p = await runEmptyDirProcess({ paths: destDirPaths });
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(destDirPaths),
          expectedErrors: [""],
        },
      );
      await assertExists(destDirPaths);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: false,
  name: "empty: create new dirs in dry mode: not created",
  async fn() {
    let p: Deno.Process | undefined;
    const destDirNames = [join("des1", "sub"), "des2"];
    try {
      const dir = await makeDirectory();
      const destDirPaths = destDirNames.map((dest) => join(dir, dest));
      p = await runEmptyDirProcess(
        { paths: destDirPaths, options: optionsDry },
      );
      await checkProcess(
        p,
        {
          success: true,
          expectedOutputs: getoutputMessages(destDirPaths, true),
          expectedErrors: [""],
        },
      );
      await assertNotExists(destDirPaths);
    } finally {
      await cleanTest(p);
    }
  },
});
