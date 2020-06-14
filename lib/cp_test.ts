import { cleanTest } from "./tools/test/misc.ts";
import { makeFile } from "./tools/test/fs.ts";
import { runProcess, checkProcess } from "./tools/test/process.ts";

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
  name: "copy: copy a file to a new file: create the file",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const file = await makeFile("foo.bar");
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "copy: copy a file to a new file in dry mode: file not created",
  async fn() {},
});

Deno.test({
  name: "copy: copy a file to an existing file: copy rejected",
  async fn() {},
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
