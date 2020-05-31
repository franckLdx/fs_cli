# fs-cli
 A deno tool to handle directories a files. Inspired by [rimraf](https://www.npmjs.com/package/rimraf) and [mkdirp](https://www.npmjs.com/package/mkdirp), fs-cli aims to write build scripts that can run under any shells.

 This first release implements only rm (delete list of files/directories), but will come soon:
* add glob support
* Empty dir
* Make dir
* Copy files/directories
* Move files/directories
* Rename files/directories

# Installation

# Usage
## rm
Syntax:
```
fs-cli rm <path1> <path2> ... <pathN>
```
Perform an rm -rf on each directory and file.
If a path does not exist, fs-cli ignores it and processes the next one.