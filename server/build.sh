#!/bin/bash
if [[ (-z "$1") || (! $1 == "openapi") ]];
then
echo "## BUILD SERVER ##"
rm -rf dist/
npm run build
fi
echo "## GENERATE OPENAPI CLIENT ##"
node ./dist/generate-api
echo "## BUILD OPENAPI CLIENT ##"
cd ../openapi
rm -rf dist/
npm run build
