#!/bin/bash

set -e

####
## INSTALL
####
echo '# INSTALL NODE MODULES'
echo '# SERVER'
yarn install --cwd server/ --prefer-offline 2> >(grep -v warning 1>&2)
echo '# CLIENT'
yarn install --cwd client/ --prefer-offline 2> >(grep -v warning 1>&2)
echo '# OPENAPI'
yarn install --cwd openapi/ --prefer-offline 2> >(grep -v warning 1>&2)

####
## BUILD
####
echo '# BUILD SERVER'
cd server
./build.sh
echo '# BUILD CLIENT'
cd ../client
yarn build

####
## PACKAGE
####
echo '# CREATE PACKAGE'
cd ..
./package.sh

