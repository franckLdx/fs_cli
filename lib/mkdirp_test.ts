import { SEP, join } from "../deps.ts";
import { makeDirectory, assertExists } from "./tools/test/fs.ts";
import {
  runProcess,
  checkProcess,
  getPrefixMessage,
} from "./tools/test/process.ts";
import { cleanTest } from "./tools/test/misc.ts";
import { optionsDry } from "./tools/test/options.ts";

const runMkProcess = runProcess("mkdirp");
const assertCreated = (paths: string[]) => assertExists(paths, true);
const assertNotCreated = (paths: string[]) => assertExists(paths, false);

export function getCreatingMsgs(paths: string[], dryRun = false) {
  const prefix = getPrefixMessage(dryRun);
  return paths.map(
    (path) => `${prefix}Creating ${path}`,
  );
}

Deno.test({
  name: "mkdirp: should create a dir",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const paths = [`${dir}${SEP}foo`];
      const expectedOutputs = getCreatingMsgs(paths);
      p = await runMkProcess({ paths });
      await checkProcess(
        p,
        { success: true, expectedOutputs, expectedErrors: [""] },
      );
      await assertCreated(paths);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "mkdirp: should create dirs",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const paths = [`${dir}${SEP}foo`, `${dir}${SEP}foo${SEP}bar${SEP}baz`];
      const expectedOutputs = getCreatingMsgs(paths);
      p = await runMkProcess({ paths });
      await checkProcess(
        p,
        { success: true, expectedOutputs, expectedErrors: [""] },
      );
      await assertCreated(paths);
    } finally {
      await cleanTest(p);
    }
  },
});

Deno.test({
  name: "mkdirp: in dry mode, should not should create dirs",
  async fn() {
    let p: Deno.Process | undefined;
    try {
      const dir = await makeDirectory();
      const paths = [join(dir, "foo"), join(dir, "foo", "bar", "baz")];
      const expectedOutputs = getCreatingMsgs(paths, true);
      p = await runMkProcess({ paths, options: optionsDry });
      await checkProcess(
        p,
        { success: true, expectedOutputs, expectedErrors: [""] },
      );
      await assertNotCreated(paths);
    } finally {
      await cleanTest(p);
    }
  },
});
