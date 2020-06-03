import { isGlob, globToRegExp, walk } from "../../deps.ts";

export interface InputOptions {
  root: string;
  dirs: boolean;
  files: boolean;
}

export async function mapInputs(
  inputs: string[],
  options: InputOptions,
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
  return [...paths, ...await mapGlobToPath(globs, options)];
}

const mapGlobToPath = async (
  globs: Array<string>,
  { root, dirs, files }: InputOptions,
) => {
  const paths = [];
  const regExps = globs.map((glob) => globToRegExp(glob));
  for await (
    const entry of walk(
      root,
      { match: regExps, includeDirs: dirs, includeFiles: files },
    )
  ) {
    paths.push(entry.path);
  }
  return paths;
};
