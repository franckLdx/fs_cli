import { IFlags } from "../deps.ts";

export function rmDirCommand(options: IFlags, dirs: string[]) {
  dirs.forEach((dir: string) => {
    console.log("rmdir %s", dir);
  });
  console.log(options);
}
