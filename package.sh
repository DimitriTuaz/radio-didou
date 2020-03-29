#!/bin/bash
#
# Create a tarball from a RADIO-DIDOU build.
#
#
echo '# CREATE PACKAGE HIERARCHY'
mkdir -p package/client/
mkdir -p package/server/
mkdir -p package/static/

echo '# COPY BUILT FILES'
cp LICENSE package
cp run.sh package
cp -r client/build package/client
cp -r server/dist package/server
cp server/index.js package/server
cp server/migrate.sh package/server
cp server/package.json package/server
cp -r static package/static

echo '# INSTALL NODE-MODULES'
cd package/server
npm install --only=prod --loglevel=error

echo '# CLEAN PACKAGE.JSON'
rm package.json
rm package-lock.json

echo '# COMPRESS PACKAGE'
cd ..
tar -zcf ../radio-didou.tar.gz .
cd ..
rm -rf package/

echo '# DONE!'

