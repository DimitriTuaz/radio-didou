#!/bin/bash
echo "## BUILD COMMON ##"
cd ../common
tsc
echo "## BUILD SERVER ##"
cd ../server
npm run build
echo "## GENERATE OPENAPI SPEC ##"
node -r tsconfig-paths/register ./dist/generate-api
