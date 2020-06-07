import { isGlob, globToRegExp, walk } from "../../deps.ts";

export interface SearchOptions {
  root: string;
  includeDirs: boolean;
  includeFiles: boolean;
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
