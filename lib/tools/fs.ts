import {
  denoEnsureDir,
  denoCopy,
  DenoCopyOptions,
} from "../../deps.ts";

import type { GlobalOptions } from "./options.ts";

export async function ensureDir(path: string, { dry }: GlobalOptions) {
  if (!dry) {
    await denoEnsureDir(path);
  }
}

export interface CopyOptions {
  global: GlobalOptions;
  copy: DenoCopyOptions;
}

export async function copy(
  source: string,
  dest: string,
  options: CopyOptions,
) {
  if (!options.global.dry) {
    await denoCopy(source, dest, options.copy);
  }
}
