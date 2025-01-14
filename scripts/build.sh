#!/usr/bin/env bash
set -eo pipefail

optionalFlags=""

[[ " $* " =~ " --minify " ]] && optionalFlags+=" --minify"


APP_VERSION=$(node -p "require('./package.json').version") 
[ -n "$APP_VERSION" ] && optionalFlags+=" --define:process.env.APP_VERSION=\"$APP_VERSION\""

npm i
esbuild ./bin/index.js ${optionalFlags} --bundle --platform=node --target=node16 --outfile=dist/index.js --packages=external