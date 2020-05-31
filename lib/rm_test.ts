import { ensureDir, ensureFile, assertEquals } from "../dev_deps.ts";
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

const checkProcess = async (
  p: Deno.Process,
  { success, output, error }: {
    success: boolean;
    output: string;
    error: string;
  },
) => {
  const { success: actualSuccess } = await p.status();
  assertEquals(actualSuccess, success);
  const actualOutput = await p.output();
  assertEquals(new TextDecoder("utf-8").decode(actualOutput), output);
  const actualError = await p.stderrOutput();
  assertEquals(new TextDecoder("utf-8").decode(actualError), error);
};

Deno.test("rm: patth exist, no verbose -> sucess without output", async () => {
  let p: Deno.Process | undefined;
  try {
    const filePath = await makeFile("foo.bar");
    p = await runRmProcess({ paths: [filePath] });
    await checkProcess(p, { success: true, output: "", error: "" });
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: path exist, verbose -> sucess with output", async () => {
  let p;
  try {
    const filePath = await makeFile("foo.bar");
    p = await runRmProcess({ paths: [filePath], options: ["-v"] });
    await checkProcess(
      p,
      { success: true, output: `Deleting ${filePath}\n`, error: "" },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: nothing when path does not exist, no verbose -> sucess without output", async () => {
  let p;
  try {
    const paths = ["foo.bar1"];
    p = await runRmProcess({ paths });
    await checkProcess(
      p,
      {
        success: true,
        output: "",
        error: "",
      },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: nothing when path does not exist, verbose -> sucess with output", async () => {
  let p;
  try {
    const paths = ["foo.bar1"];
    p = await runRmProcess({ paths, options: ["-v"] });
    await checkProcess(
      p,
      {
        success: true,
        output: `${paths[0]} does not exist\n`,
        error: "",
      },
    );
  } finally {
    await cleanTest(p);
  }
});

Deno.test("rm: mix path taht exist and path that exist", async () => {
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
    p = await runRmProcess({ paths, options: ["-v"] });
    await checkProcess(
      p,
      {
        success: true,
        output: expectedOutput,
        error: "",
      },
    );
  } finally {
    await cleanTest(p);
  }
});
