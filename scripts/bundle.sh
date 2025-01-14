#!/usr/bin/env bash
set -eo pipefail

npm run build

cp package.json dist/package.json
cp README.md dist/README.md

cd dist

# Find the name of the tarball
TARBALL=$(npm pack)

 # Install the tarball locally if flag present
[[ " $* " =~ " --link " ]] && npm i -g "$TARBALL"