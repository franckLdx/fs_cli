import { mapInputs } from "./inputs.ts";
import { assertEquals } from "../../dev_deps.ts";
import { makeFile, makeDirectory, cleanDir } from "./tests.ts";

const sortByPath = (paths: Array<string>) =>
  paths
    .map((path) => path.replace("/", "\\")) // at that time of wring deno mix / and \\ in path
    .sort();

Deno.test("Inputs: with paths only should return all paths", async () => {
  const inputs = ["foo.json", "bar.ts"];
  const actualPaths = await mapInputs(
    inputs,
    { root: ".", includeFiles: true, includeDirs: true },
  );
  assertEquals(inputs, actualPaths);
});

Deno.test("Inputs: with globs only should return all paths", async () => {
  try {
    const dirPath = await makeDirectory();
    await makeFile("baz.ts");
    const paths = await Promise.all(
      [
        makeFile("foo.json"),
        makeFile("bar.json"),
      ],
    );
    const actualPaths = await mapInputs(
      ["**/*.json"],
      { root: dirPath, includeFiles: true, includeDirs: true },
    );
    assertEquals(actualPaths, sortByPath(paths));
  } finally {
    await cleanDir();
  }
});

Deno.test("Inputs: with globs and input should return all paths", async () => {
  try {
    const dirPath = await makeDirectory();
    const inputs = [
      "foo.json",
      "bar.ts",
    ];
    const paths = await Promise.all([
      makeFile("foo.json"),
      makeFile("bar.json"),
    ]);
    await makeFile("baz.ts");
    const actualPaths = await mapInputs(
      [...inputs, "**/*.json"],
      { root: dirPath, includeFiles: true, includeDirs: true },
    );
    assertEquals(actualPaths, [...inputs, ...sortByPath(paths)]);
  } finally {
    await cleanDir();
  }
});
