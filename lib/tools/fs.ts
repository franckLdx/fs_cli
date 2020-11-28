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

// Deno's NotFound exception message is bizare and not understable  
export async function lstat(path: string) {
  try {
    return await Deno.lstat(path);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      throw new Deno.errors.NotFound(`File not found ${path}`);
    }
    throw err;
  }
}