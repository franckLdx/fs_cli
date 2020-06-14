import { cleanTest } from "./tools/test/misc.ts";
import {
  makeFile,
  assertCreated,
  assertNotCreated,
} from "./tools/test/fs.ts";
import { runProcess, checkProcess } from "./tools/test/process.ts";
import { join, dirname } from "../deps.ts";

const runCpProcess = runProcess("cp");

Deno.test({
  only: true,
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
  only: true,
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
      await assertCreated(destFile);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: true,
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
        expectedOutputs: [`[Dry Run] Copying ${sourceFile} to ${destFile}`],
        expectedErrors: [""],
      });
      await assertNotCreated(destFile);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  only: true,
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
        expectedErrors: [`'${destFile}' already exists`],
      });
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to an existing file with overridend: file copied",
  async fn() {},
});

Deno.test({
  name: "copy: copy a file to a new directory: directory and file created",
  async fn() {},
});

Deno.test({
  name:
    "copy: copy a file to a new directory in dry mode: directory and file not created",
  async fn() {},
});

Deno.test({
  name: "copy: copy files to a new directory: directory and files created",
  async fn() {},
});

Deno.test({
  name:
    "copy: copy files to a new directory in dry mode: directory and files not created",
  async fn() {},
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
