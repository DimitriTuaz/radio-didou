FROM node:latest

WORKDIR /opt/builder

# PACKAGE.JSON
COPY server.package.json package/server/package.json
COPY client.package.json package/client/package.json
COPY openapi.package.json package/openapi/package.json

# INSTALL DEPS TO CACHE THEM
RUN yarn --cwd package/server/ install --no-lockfile --silent
RUN yarn --cwd package/client/ install --no-lockfile --silent
RUN yarn --cwd package/openapi/ install --no-lockfile --slient

# CLEAN
RUN rm -rf package/

# BUILD SCRIPT
COPY config.yaml .
COPY build.sh .

# DEFAULT RUN COMMAND
CMD ["bash", "build.sh"]

