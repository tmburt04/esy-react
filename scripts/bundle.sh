npm i
npm run build

cp package.json dist/package.json
cp README.md dist/README.md

cd dist
# Find the name of the tarball
TARBALL=$(npm pack)


for arg in "$@"; do
    if [ "$arg" = "--link" ]; then
        npm i -g $TARBALL # Install the tarball locally
    fi
done