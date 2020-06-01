import { isGlob, globToRegExp, walk } from "../../deps.ts";

export async function mapInputs(
  inputs: string[],
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
  return [...paths, ...await mapGlobToPath(globs)];
}

const mapGlobToPath = async (globs: Array<string>) => {
  const paths = [];
  const regExps = globs.map((glob) => globToRegExp(glob));
  for await (const entry of walk(".", { match: regExps })) {
    paths.push(entry.path);
  }
  return paths;
};
