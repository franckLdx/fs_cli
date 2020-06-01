import { isGlob, globToRegExp, walk } from "../../deps.ts";

export async function mapInputs(
  inputs: string[],
) {
  const paths: Array<string> = [];
  for (const input of inputs) {
    if (isGlob(input)) {
      paths.push(...await mapGlobToPath(input));
    } else {
      paths.push(input);
    }
  }
  return paths;
}

const mapGlobToPath = async (glob: string) => {
  const paths = [];
  const regExp = globToRegExp(glob);
  for await (const entry of walk(".", { match: [regExp] })) {
    paths.push(entry.path);
  }
  return paths;
};
