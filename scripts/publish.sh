npm i
npm run build -- --minify
cp package.json dist/package.json
cp README.md dist/README.md
cd dist
npm pack