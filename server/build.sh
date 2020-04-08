#!/bin/bash
if [[ (-z "$1") || (! $1 == "openapi") ]];
then
echo "# LOOPBACK APPLICATION"
rm -rf dist/
yarn build
fi
echo "# GENERATE OPENAPI CLIENT"
node ./dist/generate-api
echo "# OPENAPI CLIENT"
cd ../openapi
yarn build

