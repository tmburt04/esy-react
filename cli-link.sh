npm i
npm run build
cp package.json dist/package.json
cp -r ./archetypes/_templates dist/_templates/
cd dist
npm pack
npm install -g esy-react-cli-1.0.0.tgz