import { Scripts } from "https://deno.land/x/deno_scripts/mod.ts";

Scripts(
  {
    // ds test
    test: {
      run: "deno test -A --unstable",
      // Enable watch mode
      watch: true,
      // Add environment variables
      env: {
        DENO_ENV: "test",
      },
    },
    // ds dev
    dev: {
      file: "./mod.ts",
      // Enable watch mode
      watch: true,
      // Add environment variables
      env: {
        DENO_ENV: "development",
      },
    },
    // ds start
    start: {
      file: "./mod.ts",
      // Add environment variables
      env: {
        DENO_ENV: "production",
      },
    },
  },
  {
    // Shared default watch options
    watch: {
      // Only watch for files with extension ".ts"
      extensions: ["ts"],
    },
    // Default permissions added to
    // every "file script".
    permissions: {
      allowNet: true,
    },
    // Automatic `deno fmt` call
    fmt: true,
  },
);
