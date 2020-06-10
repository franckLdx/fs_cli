import { assert } from "../dev_deps.ts";
import { exists } from "../deps.ts";
import {
  makeFile,
  makeDirectory,
  makeSubDirectory,
  assertExists,
} from "./tools/test/fs.ts";
import { cleanTest } from "./tools/test/misc.ts";
import {
  checkProcess,
  runProcess,
  getPrefixMessage,
} from "./tools/test/process.ts";
import { sortPath } from "./tools/search_test.ts";

const runRmProcess = runProcess("rm");
const assertDeleted = (paths: string[]) => assertExists(paths, false);

export function getDeletingMsgs(paths: string[], dryRun = false) {
  const prefix = getPrefixMessage(dryRun);
  const sortedPath = sortPath(paths);
  return sortedPath.map(
    (path) => `${prefix}Deleting ${path}`,
  );
}

Deno.test("rm: path exist, quiet mode -> sucess without output", async () => {
  let p: Deno.Process | undefined;
  try {
    const paths = [await makeFile("foo.bar")];
    p = await runRmProcess({ paths, options: ["-q"] });
    await checkProcess(
      p,
      { success: true, expectedOutputs: [""], expectedErrors: [""] },
    );
    await assertExists(paths, false);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: path exist, no quiet -> sucess with output", async () => {
  let p;
  try {
    const paths = [await makeFile("foo.bar")];
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs: getDeletingMsgs([paths[0]]),
        expectedErrors: [""],
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: nothing when path does not exist, quiet -> sucess without output", async () => {
  let p;
  try {
    const paths = ["foo.bar1"];
    p = await runRmProcess({ paths, options: ["-q"] });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs: [""],
        expectedErrors: [""],
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: nothing when path does not exist, not quiet -> sucess with output", async () => {
  let p;
  try {
    const paths = ["foo.bar1"];
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs: [""],
        expectedErrors: [""],
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: mix path that exist and path that exist", async () => {
  let p;
  const dir = await makeDirectory();
  try {
    const paths = await Promise.all([
      makeFile("foo.bar1"),
      makeFile("foo.bar2"),
      "./foo.bar3",
      makeFile("foo/foo.bar2"),
      "./foo/foo.bar2",
    ]);
    const expectedOutputs = getDeletingMsgs([paths[0], paths[1], paths[3]]);
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs,
        expectedErrors: [""],
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: glob", async () => {
  let p;
  try {
    const dirPath = await makeDirectory();
    const paths = await Promise.all([
      makeFile("foo1.bar"),
      makeFile("foo2.bar"),
    ]);
    const expectedOutputs = getDeletingMsgs(paths);
    p = await runRmProcess(
      { paths: ["**/*.bar"], options: ["--glob-root", dirPath] },
    );
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs,
        expectedErrors: [""],
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: glob excluding files", async () => {
  let p;
  try {
    const dirPath = await makeDirectory();
    p = await runRmProcess(
      {
        paths: ["**/*.bar"],
        options: ["--glob-root", dirPath, "--no-glob-files"],
      },
    );
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs: [""],
        expectedErrors: [""],
      },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: glob excluding dirs", async () => {
  let p;
  try {
    const dirPath = await makeDirectory();
    await Promise.all(
      [
        makeSubDirectory("foo"),
        makeSubDirectory("fooBar"),
        makeSubDirectory("fooBaz"),
      ],
    );
    p = await runRmProcess(
      {
        paths: [`**/foo*`],
        options: ["--glob-root", dirPath, "--no-glob-dirs"],
      },
    );
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs: [""],
        expectedErrors: [""],
      },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: dryRun -> nothing deleted", async () => {
  let p;
  try {
    const paths = [await makeFile("foo.bar")];
    const expectedOutputs = getDeletingMsgs([paths[0]]);
    p = await runRmProcess({ paths, options: ["-d"] });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutputs,
        expectedErrors: [""],
      },
    );
    assert(await exists(paths[0]));
  } finally {
    await cleanTest(p);
  }
});
