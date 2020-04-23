#!/bin/bash

set -e

if [[ (-z "$1") || (! $1 == "openapi") ]];
then
echo "# TRANSPILE APPLICATION"
rm -rf dist/
yarn build
fi
echo "# GENERATE OPENAPI CLIENT"
node ./dist/codegen/
echo "# TRANSPILE OPENAPI CLIENT"
cd ../openapi
yarn build

