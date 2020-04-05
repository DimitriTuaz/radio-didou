#!/bin/bash

echo '# PACKAGE.JSON'
mkdir -p package/server/
mkdir -p package/client/
mkdir -p package/openapi/

cp server.package.json package/server/package.json
cp client.package.json package/client/package.json
cp openapi.package.json package/openapi/package.json

echo '# INSTALL DEPS TO CACHE THEM'
yarn --cwd package/server/ install --no-lockfile --silent
yarn --cwd package/client/ install --no-lockfile --silent
yarn --cwd package/openapi/ install --no-lockfile --slient

echo '# CLEAN'
rm -rf package/

