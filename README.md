# fs-cli

 A deno tool to handle directories and files through script. Inspired by [rimraf](https://www.npmjs.com/package/rimraf) and mkdirp [mkdirp](https://www.npmjs.com/package/mkdirp), fs-cli aims to write build scripts that can run under any shell.

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black)](https://deno.land/x/fs_cli) 
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/franckLdx/fs_cli/blob/master/LICENSE)

### Table of content

- [Installation](#Installation)
- [Commands](#commands) 
  - [cp](#cp)
  - [emptyDir](#emptydir)
  - [mkdirp](#mkdirp)
  - [rm](#rm)
- [Options for glob search](#glob-options)
- [Global options](#global-options)
- [Acknowledgments](#acknowledgments)
- [What's new](#whats-new)
- [Todo](#todo)

 # Installation

```sh
$ deno install --unstable --allow-read --allow-write --allow-env --allow-run -n fs_cli https://deno.land/x/fs_cli@v0.5.1/cli.ts
```
The above command will always install the latest version. If you're updating from an older version you might need to run the command with the `-f` flag.

### To upgrade to latest version
To install a specific version, run the install command with a specific version tag:

```sh
$ deno install --unstable --allow-read --allow-write --allow-env --allow-run -n fs_cli https://deno.land/x/fs_cli@<version>/cli.ts
```


### To install a specific version
To install a specific version, run the install command with a specific version tag:

```sh
$ deno install --unstable --allow-read --allow-write --allow-env --allow-run -n fs_cli https://deno.land/x/fs_cli@<version>/cli.ts
```
For more information see [Deno's installer manual](https://deno.land/manual/tools/script_installer)

# Commands
## cp
Syntax:
```
fs-cli cp <source path1 or glob1>...<source pathN glob1> <dest>
```
Perform a cp -r. If <dest> includes directories, thos directories are created if they does not exists.

* To copy a file to anoter file:
```
fs-cli cp <source file> <dest dile>
```
* To copy a file to a directory (keeping the same file name), add an OS separator (/ under unix, \ under windows) at the end of dest:
```
fs-cli cp <source file> <dest dir>/ or fs-cli cp <source file> <dest dir>\ 
```
* To copy a file to directory (with another name) :
```
fs-cli cp <source file> <dest dir>/<dest file> or fs-cli cp <source file> <dest dir>\<dest file> 
 ```
 * To copy files to directory (with another name) :
```
fs-cli cp <source file1> ... <source filen> <dest dir>
 ```
* To copy a directory to another directory:
```
fs-cli cp <source dir path> <dest dir path>
```

### Options
cp supports [glob options](#glob-options)

# force mode: -f/--force
Be default the command failed if a file has to be over written. -f/--force option allow to over write existing file
# preserve timestamps: -p/--preserve
if use, set last modification and access times to the ones of the original source files. When not use, timestamp behavior is OS-dependent.

## emptyDir
Syntax:
```
fs-cli emptyDir <dir1>...<dirn>
```
Ensures that each dir is empty.
Deletes directory contents if the directory is not empty.
If the directory does not exist, it is created.

## mkdirp
Syntax:
```
fs-cli mkdirp <path1> <path2> <path3>
```
Perform an mkdir -p on each given directory.

## rm
Syntax:
```
fs-cli rm <path or glob 1> <path or glob 2> ... <path or glob N>
```
Perform an rm -rf on each given directory and file. Globs are also supported.
If a path does not exist, fs-cli ignores it and processes the next one.

### Options
rm supports [glob options](#glob-options)

# Glob Options
Following are used for [rm](#rm) and [cp](#cp)

**To use glob intergated search rather than shell glob interpollation, don't forget to use quote to avoid glob being interpreted by sheel use quote: <code>'\*\*/*.tmp'</code> rahter than <code>\*\*/*.tmp**</code>

## glob-root
root search for glob
```
fs-cli <command> <path or glob 1>...<path or glob N> --glob-root <path>
```

## no-glob-dirs
Directories are ignored when applying a glob
```
fs-cli <command> <path or glob 1>...<path or glob N> --no-glob-dirs
```

## no-glob-files
files are ignored when applying a glob
```
fs-cli <command> <path or glob 1>...<path or glob N> --no-glob-files
```

# Global options
## quiet mode: -q/--quiet
Output can be disable using -q/--quiet option:
```
fs-cli rm <path1> <path2> ... <pathN> -q
```
In case of failure, error message is always displayed, even in quiet mode.

### dry run mode: -d/--dry
-d/--dry: Output the behavior, but does nothing
```
fs-cli rm <path1> <path2> ... <pathN> -d
```

# Acknowledgments
Made with [Cliffy](https://deno.land/x/cliffy) and [Cli_badges](https://deno.land/x/cli_badges)


# What's new
fs_cli uses recent std lib but it is tested with deno 1.11.x
If you use older deno relesae, try fs-cli@0.7.12.

## 1.0.00
  * use std lib std@0.98.0, cliffy@v0.19.1

## 0.7.12
  * use std lib std@0.98.0

## 0.7.8
  * use std lib 0.81.0

## 0.7.7
  * use std lib 0.79.0

## 0.7.6
  * Set for testing new Deno third parties repo management

## 0.7.5
  * use std lib 0.76.0

## 0.7.4
  * use std lib 0.74.0

## 0.7.3
  * use std lib 0.73.0

## 0.7.2
  * use std lib 0.6.0
  * use cliffy 0.13.0

## 0.7.1
  * use std lib 0.61.0
  * use cliffy 0.11.0

## 0.7.0
  * Added empty command
  * use std lib 0.59.0

## 0.6.0
  * cp command now supports glob options

## 0.5.1
  * cp command

## 0.4.0
  * mkdirp command

# Todo
  * add follow Symlinks options to glob search

