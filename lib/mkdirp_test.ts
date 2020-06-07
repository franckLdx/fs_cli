import { SEP } from "../deps.ts";
import { makeDirectory } from "./tools/test/fs.ts";
import {
  runProcess,
  checkProcess,
  getPrefixMessage,
} from "./tools/test/process.ts";
import { cleanTest } from "./tools/test/misc.ts";

const runMkProcess = runProcess("mkdirp");

export function getCreatingMsgs(paths: string[], dryRun = false) {
  const prefix = getPrefixMessage(dryRun);
  return paths.reduce(
    (acc, path) => acc + `${prefix}Creating ${path}\n`,
    "",
  );
}

Deno.test("mkdirp: should create a dir", async () => {
  let p: Deno.Process | undefined;
  try {
    const dir = await makeDirectory();
    const paths = [`${dir}${SEP}foo`];
    const expectedOutput = getCreatingMsgs(paths);
    p = await runMkProcess({ paths });
    await checkProcess(
      p,
      { success: true, expectedOutput, expectedError: "" },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("mkdirp: should create dirs", async () => {
  let p: Deno.Process | undefined;
  try {
    const dir = await makeDirectory();
    const paths = [`${dir}${SEP}foo`, `${dir}${SEP}foo${SEP}bar${SEP}baz`];
    const expectedOutput = getCreatingMsgs(paths);
    p = await runMkProcess({ paths });
    await checkProcess(
      p,
      { success: true, expectedOutput, expectedError: "" },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("mkdirp: in dry mode, should not should create dirs", async () => {
  let p: Deno.Process | undefined;
  try {
    const dir = await makeDirectory();
    const paths = [`${dir}${SEP}foo`, `${dir}${SEP}foo${SEP}bar${SEP}baz`];
    const expectedOutput = getCreatingMsgs(paths, true);
    p = await runMkProcess({ paths, options: ["-d"] });
    await checkProcess(
      p,
      { success: true, expectedOutput, expectedError: "" },
    );
  } finally {
    await cleanTest(p);
  }
});