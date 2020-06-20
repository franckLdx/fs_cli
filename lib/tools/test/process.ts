import { green, red, assertEquals } from "../../../dev_deps.ts";
import { assert } from "../../../deps.ts";

export function getPrefixMessage(dryRun: boolean) {
  return dryRun ? "[Dry Run] " : "";
}

export function runProcess(command: string) {
  return async (
    { paths, options }: { paths: string[]; options?: string[] },
  ) => {
    return await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-read",
        "--allow-write",
        "cli.ts",
        command,
        ...paths,
        ...options ?? "",
      ],
      stdout: "piped",
      stderr: "piped",
    });
  };
}

export async function checkProcess(
  p: Deno.Process,
  { success, expectedOutputs, expectedErrors }: {
    success: boolean;
    expectedOutputs: string[];
    expectedErrors: string[];
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
  expectedOutputs.forEach((expectedOutput) =>
    assert(
      actualOutput.includes(expectedOutput),
      `wrong process std output ${green(actualOutput)}!=${red(expectedOutput)}`,
    )
  );

  const actualError = decoder.decode(await p.stderrOutput());
  expectedErrors.forEach((expectedError) =>
    assert(
      actualError.includes(expectedError),
      `wrong proces srd error ${green(actualError)}!=${red(expectedError)}`,
    )
  );
}

export async function cleanProcess<T extends Deno.RunOptions>(
  p: Deno.Process<T> | undefined,
) {
  p?.stdin?.close();
  // p?.stdout?.close();
  // p?.stderr?.close();
  p?.close();
}
