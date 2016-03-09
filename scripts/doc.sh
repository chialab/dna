#!/bin/bash

TAG=$(git describe --abbrev=0 --tags)
BUILD_DIR="./docs"
REPO_DIR="./docs-deploy"
DIST_DIR="${REPO_DIR}/contents/api"
REPO_URL="git@gitlab.com:dna-components/dna-docs.git"

# build distribution scripts
npm run doc
# clone distribution repo
rm -rf $REPO_DIR
git clone $REPO_URL $REPO_DIR
# empty lib dir
rm -rf $DIST_DIR
# copy distribution files
cp -R $BUILD_DIR $DIST_DIR
# update distribution project
cd $REPO_DIR
git add .
git commit -m "release: ${TAG}"
git tag -a ${TAG} -m "release: ${TAG}"
git push origin
cd ..
rm -rf $REPO_DIR
