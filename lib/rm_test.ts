import { ensureDir, ensureFile, assertEquals, assert } from "../dev_deps.ts";
import { exists } from "../deps.ts";

const dirPath = `./test-resource`;

const makeFile = async (fileName: string) => {
  const filePath = `${dirPath}/${fileName}`;
  await ensureDir(dirPath);
  await ensureFile(filePath);
  return filePath;
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
  if (await exists(dirPath)) {
    await Deno.remove(dirPath, { recursive: true });
  }
};

const assertDeleted = async (paths: string[]) => {
  for await (const path of paths) {
    assert(!(await exists(path)));
  }
};

const checkProcess = async (
  p: Deno.Process,
  { success, output, error }: {
    success: boolean;
    output: string;
    error: string;
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
    output,
    "wrong process output",
  );
  const actualError = decoder.decode(await p.stderrOutput());
  assertEquals(
    actualError,
    error,
    "wrong proces error",
  );
};

Deno.test("rm: path exist, quiet mode -> sucess without output", async () => {
  let p: Deno.Process | undefined;
  try {
    const paths = [await makeFile("foo.bar")];
    p = await runRmProcess({ paths, options: ["-q"] });
    await checkProcess(p, { success: true, output: "", error: "" });
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
      { success: true, output: `Deleting ${paths[0]}\n`, error: "" },
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
        output: "",
        error: "",
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
        output: `${paths[0]} does not exist\n`,
        error: "",
      },
    );
    await assertDeleted(paths);
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: mix path that exist and path that exist", async () => {
  let p;
  try {
    const paths = await Promise.all([
      makeFile("foo.bar1"),
      makeFile("foo.bar2"),
      "./foo.bar3",
      makeFile("foo/foo.bar2"),
      "./foo/foo.bar2",
    ]);
    const expectedOutput = `Deleting ${paths[0]}
Deleting ${paths[1]}
${paths[2]} does not exist
Deleting ${paths[3]}
${paths[4]} does not exist
`;
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        output: expectedOutput,
        error: "",
      },
    );
    await assertDeleted(paths);
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
        output: expectedOutput,
        error: "",
      },
    );
    assert(await exists(paths[0]));
  } finally {
    await cleanTest(p);
  }
});
