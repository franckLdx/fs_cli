import { emptyDir, IFlags } from "../deps.ts";

export function emptyDirCommand(options: IFlags, dirs: string[]) {
  dirs.forEach((dir: string) => {
    console.log("emptyDir %s", dir);
  });
  console.log(options);
}
