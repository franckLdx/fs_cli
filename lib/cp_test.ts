import { cleanTest } from "./tools/test/misc.ts";
import {
  makeFile,
  assertDirCreated,
  assertNotCreated,
  makeDirectory,
  assertFileCreated,
} from "./tools/test/fs.ts";
import { optionsDry, force } from "./tools/test/options.ts";
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
        { paths: [sourceFile, destFile], options: optionsDry },
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
  name: "copy: copy a file to an existing file with force option: file copied",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = await makeFile("destFile");
      p = await runCpProcess(
        { paths: [sourceFile, destFile], options: force },
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
        { paths: [sourceFile, destDir], options: optionsDry },
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
  name:
    "copy: copy files to a directory that contains the file with force: file copied",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceFile = await makeFile("sourceFile");
      const destFile = await makeFile(join("destDir", "destFile"));

      p = await runCpProcess(
        { paths: [sourceFile, destFile], options: force },
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
  name:
    "copy: copy a directory to a new directory: directory created and it's content is copied",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const sourceName = "source";
      const sourceDir = await makeDirectory(sourceName);
      const subDir1Name = "subDir1";
      const subDir2Name = "subDir2";
      await makeFile(join(sourceName, "file1"));
      await makeFile(join(sourceName, "file2"));
      await makeFile(join(sourceName, subDir1Name, "file1_1"));
      await makeFile(join(sourceName, subDir1Name, "file1_2"));
      await makeFile(join(sourceName, subDir1Name, "file1_3"));
      await makeFile(join(sourceName, subDir2Name, "file2_1"));
      const destDir = join(dir, "dest");
      p = await runCpProcess(
        { paths: [sourceDir, destDir] },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceDir, destDir)],
        expectedErrors: [""],
      });
      const destFiles = [
        join(destDir, "file1"),
        join(destDir, "file2"),
        join(destDir, subDir1Name, "file1_1"),
        join(destDir, subDir1Name, "file1_2"),
        join(destDir, subDir1Name, "file1_3"),
        join(destDir, subDir2Name, "file2_1"),
      ];
      for await (const file of destFiles) {
        await assertFileCreated(file);
      }
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name:
    "copy: copy a directory to a new directory in dry mode: directory not created",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const sourceName = "source";
      const sourceDir = await makeDirectory(sourceName);
      const subDir1Name = join(sourceName, "subDir1");
      const subDir2Name = join(sourceName, "subDir2");
      await makeFile(join(sourceName, "file1"));
      await makeFile(join(sourceName, "file2"));
      await makeFile(join(subDir1Name, "file1_1"));
      await makeFile(join(subDir1Name, "file1_2"));
      await makeFile(join(subDir1Name, "file1_3"));
      await makeFile(join(subDir2Name, "file2_1"));
      const destDir = join(dir, "dest");
      p = await runCpProcess(
        { paths: [sourceDir, destDir], options: optionsDry },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceDir, destDir, true)],
        expectedErrors: [""],
      });
      await assertNotCreated(destDir);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a directory to an existing directory: copy rejected",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceName = "source";
      const sourceDir = await makeDirectory(sourceName);
      const subDir1Name = "subDir1";
      const subDir2Name = "subDir2";
      await makeFile(join(sourceName, "file1"));
      await makeFile(join(sourceName, "file2"));
      await makeFile(join(sourceName, subDir1Name, "file1_1"));
      await makeFile(join(sourceName, subDir1Name, "file1_2"));
      await makeFile(join(sourceName, subDir1Name, "file1_3"));
      await makeFile(join(sourceName, subDir2Name, "file2_1"));
      const destName = "dest";
      const destDir = await makeDirectory(destName);
      p = await runCpProcess(
        { paths: [sourceDir, destDir] },
      );
      await checkProcess(p, {
        success: false,
        expectedOutputs: [],
        expectedErrors: [
          `'${destDir}' already exists`,
        ],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name:
    "copy: copy a directory to an existing directory with overriden: direcctory copied",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const sourceName = "source";
      const sourceDir = await makeDirectory(sourceName);
      const subDir1Name = "subDir1";
      const subDir2Name = "subDir2";
      await makeFile(join(sourceName, "file1"));
      await makeFile(join(sourceName, "file2"));
      await makeFile(join(sourceName, subDir1Name, "file1_1"));
      await makeFile(join(sourceName, subDir1Name, "file1_2"));
      await makeFile(join(sourceName, subDir1Name, "file1_3"));
      await makeFile(join(sourceName, subDir2Name, "file2_1"));
      const destName = "dest";
      const destDir = await makeDirectory(destName);
      p = await runCpProcess(
        { paths: [sourceDir, destDir], options: force },
      );
      await checkProcess(p, {
        success: true,
        expectedOutputs: [getCopyingMessage(sourceDir, destDir)],
        expectedErrors: [""],
      });
    } finally {
      await cleanTest(p);
    }
  },
});
