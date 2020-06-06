import { assertEquals, assert, green, red } from "../dev_deps.ts";
import { exists } from "../deps.ts";
import { makeFile, makeDirectory, cleanDir } from "./tools/tests.ts";
import { sortPath } from "./tools/search_test.ts";

const getDeletingMsgs = (paths: string[], dryRun = false) => {
  const prefix = dryRun ? "[Dry Run] " : "";
  const sortedPath = sortPath(paths);
  return sortedPath.reduce(
    (acc, path) => acc + `${prefix}Deleting ${path}\n`,
    "",
  );
};

const runRmProcess = async (
  { paths, options }: { paths: string[]; options?: string[] },
) =>
  await Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-read",
      "--allow-write",
      "cli.ts",
      "rm",
      ...paths,
      ...options ?? "",
    ],
    stdout: "piped",
    stderr: "piped",
  });

const cleanTest = async (p: Deno.Process | undefined) => {
  p?.stdin?.close();
  p?.close();
  await cleanDir();
};

const assertDeleted = async (paths: string[]) => {
  for await (const path of paths) {
    assert(!(await exists(path)));
  }
};

const checkProcess = async (
  p: Deno.Process,
  { success, expectedOutput, expectedError }: {
    success: boolean;
    expectedOutput: string;
    expectedError: string;
  },
) => {
  const { success: actualSuccess } = await p.status();
  assertEquals(
    actualSuccess,
    success,
    "process exit code is not the expected one",
  );
  const decoder = new TextDecoder("utf-8");
  const actualOutput = decoder.decode(await p.output());
  assertEquals(
    actualOutput,
    expectedOutput,
    `wrong process std output ${green(actualOutput)}!=${red(expectedOutput)}`,
  );
  const actualError = decoder.decode(await p.stderrOutput());
  assertEquals(
    actualError,
    expectedError,
    `wrong proces error ${green(actualError)}!=${red(expectedError)}`,
  );
};

Deno.test("rm: path exist, quiet mode -> sucess without output", async () => {
  let p: Deno.Process | undefined;
  try {
    const paths = [await makeFile("foo.bar")];
    p = await runRmProcess({ paths, options: ["-q"] });
    await checkProcess(
      p,
      { success: true, expectedOutput: "", expectedError: "" },
    );
    await assertDeleted(paths);
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
        expectedOutput: getDeletingMsgs([paths[0]]),
        expectedError: "",
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
        expectedOutput: "",
        expectedError: "",
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
        expectedOutput: "",
        expectedError: "",
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
    const expectedOutput = getDeletingMsgs([paths[0], paths[1], paths[3]]);
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutput: expectedOutput,
        expectedError: "",
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
    const expectedOutput = getDeletingMsgs(paths);
    p = await runRmProcess(
      { paths: ["**/*.bar"], options: ["--glob-root", dirPath] },
    );
    await checkProcess(
      p,
      {
        success: true,
        expectedOutput: expectedOutput,
        expectedError: "",
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
    const expectedPaths = (await Promise.all([
      makeFile("foo1.bar"),
      makeFile("foo2.bar"),
    ])).map((path) => `Deleting ${path}\n`);
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
        expectedOutput: "",
        expectedError: "",
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
    const expectedOutput = `[Dry Run] Deleting ${paths[0]}\n`;
    p = await runRmProcess({ paths, options: ["-d"] });
    await checkProcess(
      p,
      {
        success: true,
        expectedOutput: expectedOutput,
        expectedError: "",
      },
    );
    assert(await exists(paths[0]));
  } finally {
    await cleanTest(p);
  }
});
