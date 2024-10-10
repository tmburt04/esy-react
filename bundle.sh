npm i
npm run build
cp package.json dist/package.json
cp README.md dist/README.md
cp -r ./archetypes/_templates dist/_templates/
cd dist
npm pack