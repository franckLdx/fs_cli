import { sortPath } from "../search_test.ts";
import { assertEquals, green, red } from "../../../dev_deps.ts";

export function getDeletingMsgs(paths: string[], dryRun = false) {
  const prefix = dryRun ? "[Dry Run] " : "";
  const sortedPath = sortPath(paths);
  return sortedPath.reduce(
    (acc, path) => acc + `${prefix}Deleting ${path}\n`,
    "",
  );
}

export async function runRmProcess(
  { paths, options }: { paths: string[]; options?: string[] },
) {
  return await Deno.run({
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
}

export async function checkProcess(
  p: Deno.Process,
  { success, expectedOutput, expectedError }: {
    success: boolean;
    expectedOutput: string;
    expectedError: string;
  },
) {
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
}

export async function cleanProcess(p: Deno.Process | undefined) {
  p?.stdin?.close();
  p?.close();
}