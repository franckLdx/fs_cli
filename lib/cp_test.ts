import { cleanTest } from "./tools/test/misc.ts";
import {
  makeFile,
  assertDirCreated,
  assertNotCreated,
  makeDirectory,
  assertFileCreated,
} from "./tools/test/fs.ts";
import {
  runProcess,
  checkProcess,
  getPrefixMessage,
} from "./tools/test/process.ts";
import { join, dirname, basename, SEP } from "../deps.ts";

const runCpProcess = runProcess("cp");

const getCopyingMessage = (source: string, dest: string, dryRun = false) =>
  `${getPrefixMessage(dryRun)}Copying ${source} to ${dest}`;

const getAlreadyExistMessage = (dest: string, dryRun = false) =>
  `${getPrefixMessage(dryRun)}${dest}' already exists`;

Deno.test({
  name: "copy: wrong parameter",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      p = await runCpProcess({ paths: ["foo"] });
      await checkProcess(p, {
        success: false,
        expectedOutputs: [""],
        expectedErrors: ["Must have at least one source and the destination"],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to a new file: create the file",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = join(dirname(sourceFile), "destFile");
      p = await runCpProcess({ paths: [sourceFile, destFile] });
      await checkProcess(p, {
        success: true,
        expectedOutputs: [`Copying ${sourceFile} to ${destFile}`],
        expectedErrors: [""],
      });
      await assertFileCreated(destFile);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to a new file in dry mode: file not created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = join(dirname(sourceFile), "destFile");
      p = await runCpProcess(
        { paths: [sourceFile, destFile], options: ["--dry"] },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [
          getCopyingMessage(sourceFile, destFile, true),
        ],
        expectedErrors: [""],
      });
      await assertNotCreated(destFile);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to an existing file: copy rejected",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = await makeFile("destFile");
      p = await runCpProcess(
        { paths: [sourceFile, destFile] },
      );
      await checkProcess(p, {
        success: false,
        expectedOutputs: [""],
        expectedErrors: [getAlreadyExistMessage(destFile)],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name:
    "copy: copy a file to an existing file with overwrite option: file copied",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = await makeFile("destFile");
      p = await runCpProcess(
        { paths: [sourceFile, destFile], options: ["--overwrite"] },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceFile, destFile)],
        expectedErrors: [""],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to a new directory: directory and file created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const sourceFile = await makeFile("sourceFile");
      const destDir = join(dir, "Dir") + SEP;
      p = await runCpProcess(
        { paths: [sourceFile, destDir] },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceFile, destDir)],
        expectedErrors: [""],
      });
      await assertDirCreated(destDir);
      await assertFileCreated(join(destDir, basename(sourceFile)));
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name:
    "copy: copy a file to a new directory in dry mode: directory and file not created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const sourceFile = await makeFile("sourceFile");
      const destDir = join(dir, "Dir") + "/";
      p = await runCpProcess(
        { paths: [sourceFile, destDir], options: ["--dry"] },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceFile, destDir, true)],
        expectedErrors: [""],
      });
      await assertNotCreated(destDir);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy files to a a directory that contains the file: rejected",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = await makeFile(join("destDir", "destFile"));

      p = await runCpProcess(
        { paths: [sourceFile, destFile] },
      );
      await checkProcess(p, {
        success: false,
        expectedOutputs: [""],
        expectedErrors: [`'${destFile}' already exists`],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy files to a directory: files created",
  async fn() {},
});

Deno.test({
  name: "copy: copy files to a directory in dry mode: files not created",
  async fn() {},
});

Deno.test({
  name: "copy: copy a directory to a new directory: directory created",
  async fn() {},
});

Deno.test({
  name:
    "copy: copy a directory to a new directory in dry mode: directory not created",
  async fn() {},
});

Deno.test({
  name: "copy: copy a directory to an existing directory: copy rejected",
  async fn() {},
});

Deno.test({
  name:
    "copy: copy a directory to an existing directory with overriden: direcctory copied",
  async fn() {},
});
