#!/bin/bash

TAG=$(git describe --abbrev=0 --tags)
BUILD_DIR="./dist"
REPO_DIR="./deploy"
DIST_DIR="${REPO_DIR}/lib"
REPO_URL="git@gitlab.com:dna-components/dna-library.git"

# build distribution scripts
npm run build
# clone distribution repo
rm -rf $REPO_DIR
git clone $REPO_URL $REPO_DIR
# empty lib dir
rm -rf $DIST_DIR
# copy distribution files
cp -R $BUILD_DIR $DIST_DIR
# update distribution project
cd $REPO_DIR
sed -i "" "s/\"version\": \".*\"/\"version\": \"${TAG:1}\"/" package.json
sed -i "" "s/\"version\": \".*\"/\"version\": \"${TAG:1}\"/" bower.json
git add .
git commit -m "release: ${TAG}"
git tag -a ${TAG} -m "release: ${TAG}"
git push origin
cd ..
rm -rf $REPO_DIR
