#!/bin/bash
echo "## BUILD SERVER ##"
npm run build
echo "## GENERATE OPENAPI CLIENT ##"
node ./dist/generate-api
echo "## BUILD OPENAPI CLIENT ##"
cd ../openapi
npm run build
