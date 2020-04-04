FROM node:latest

WORKDIR /opt/builder
COPY . .
RUN bash make-builder.sh

# DEFAULT RUN COMMAND
CMD ["bash", "build.sh"]

