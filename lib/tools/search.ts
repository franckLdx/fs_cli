import { Command, globToRegExp, isGlob, walk } from "../../deps.ts";

export function addSearchOptions(command: Command<any, any>) {
  command.option(
    "--glob-root [glob-root:string]",
    "root for the glob search",
    { default: "." },
  )
    .option(
      "--no-glob-dirs [glob-dirs:boolean]",
      "exclude directories from glob search",
      { default: true },
    )
    .option(
      "--no-glob-files",
      "exclude files from glob search",
    );
}
export const searchOptionsName = ["globRoot", "globDirs", "globFiles"];

export interface SearchOptions {
  root: string;
  includeDirs: boolean;
  includeFiles: boolean;
}

export function parseSearchOptions(options: any): SearchOptions {
  return {
    root: options["globRoot"] as string,
    includeDirs: options["globDirs"] as boolean,
    includeFiles: options["globFiles"] as boolean,
  };
}

export async function search(
  inputs: string[],
  options: SearchOptions,
) {
  const paths: Array<string> = [];
  const globs: Array<string> = [];
  for (const input of inputs) {
    if (isGlob(input)) {
      globs.push(input);
    } else {
      paths.push(input);
    }
  }
  return [...paths, ...await resolveGlob(globs, options)];
}

const resolveGlob = async (
  globs: Array<string>,
  { root, ...otherOptions }: SearchOptions,
) => {
  const paths = [];
  const regExps = globs.map((glob) => globToRegExp(glob));
  for await (
    const entry of walk(
      root,
      { match: regExps, ...otherOptions },
    )
  ) {
    paths.push(entry.path);
  }
  return paths;
};
