import { assertEquals } from "../../dev_deps.ts";
import { makeFile, makeDirectory, cleanDir } from "./tests.ts";
import { search } from "./search.ts";

export function sortPath(paths: Array<string>) {
  return paths
    .sort();
}

Deno.test("Inputs: with paths only should return all paths", async () => {
  const inputs = ["foo.json", "bar.ts"];
  const actualPaths = await search(
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
    const actualPaths = await search(
      ["**/*.json"],
      { root: dirPath, includeFiles: true, includeDirs: true },
    );
    assertEquals(actualPaths, sortPath(paths));
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
    const actualPaths = await search(
      [...inputs, "**/*.json"],
      { root: dirPath, includeFiles: true, includeDirs: true },
    );
    assertEquals(actualPaths, [...inputs, ...sortPath(paths)]);
  } finally {
    await cleanDir();
  }
});