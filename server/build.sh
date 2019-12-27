#!/bin/bash
echo "## BUILD COMMON ##"
cd ../common
tsc
echo "## BUILD SERVER ##"
cd ../server
npm run build

