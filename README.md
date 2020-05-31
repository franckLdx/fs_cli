# fs-cli
 A deno tool to handle directories a files. Inspired by [rimraf](https://www.npmjs.com/package/rimraf) and [mkdirp](https://www.npmjs.com/package/mkdirp), fs-cli aims to write build scripts that can run under any shells.

 This first release implements only rm (delete list of files/directories), but will come soon:
* add glob support and dry-run mode
* Empty dir
* Make dir
* Copy files/directories
* Move files/directories
* Rename files/directories

# Installation

```sh
$ deno install --allow-read --allow-write --allow-env --allow-run -n fs_cli https://deno.land/x/fs_cli@v0.1.0/cli.ts
```
The above command will always install the latest version. If you're updating from an older version you might need to run the command with the `-f` flag.

### To install a specific version
To install a specific version, run the install command with a specific version tag:

```sh
$ deno install --allow-read --allow-write --allow-env --allow-run -n fs_cli https://deno.land/x/fs_cli@<version>/cli.ts
```
For more information see [Deno's installer manual](https://deno.land/manual/tools/script_installer)

# Usage
## rm
Syntax:
```
fs-cli rm <path1> <path2> ... <pathN>
```
Perform an rm -rf on each directory and file.
If a path does not exist, fs-cli ignores it and processes the next one.

## quiet mode
Output can be disable using -q/--quiet option:
```
fs-cli rm <path1> <path2> ... <pathN> -q
```
```
fs-cli rm -q 1 <path1> <path2> ... <pathN>
```
```
fs-cli rm -q true <path1> <path2> ... <pathN>
```