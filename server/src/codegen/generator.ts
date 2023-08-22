import fs from 'fs-extra';
import path from 'path';
import ejs, { Data } from 'ejs';
import klaw, { Item } from 'klaw';

import RefParser from "@apidevtools/json-schema-ref-parser";
import { OpenApiSpec, PathItemObject, OperationObject } from '@loopback/rest';

export interface CodegenOptions {
  openAPI: OpenApiSpec,
  basePath: string,
  templatePath: string
}

interface RouteObject {
  path: string,
  operation: OperationObject,
  operationType: string,
  operationName: string
}

interface ControllerInfo {
  fileName: string,
  routes: RouteObject[]
}

interface ByController {
  [controller: string]: ControllerInfo;
}

export async function generate(options: CodegenOptions) {
  options.openAPI = await RefParser
    .dereference(options.openAPI) as OpenApiSpec;

  let controllers: ByController = {};

  Object.entries(options.openAPI.paths).map(([key, value]: [string, PathItemObject]) => {
    let operationType = Object.keys(value)[0];
    let operation: OperationObject = value[operationType];
    let controllerName: string = operation['x-controller-name'];

    if (!(controllerName in controllers)) {
      controllers[controllerName] = {
        fileName: controllerName.replace(/Controller/, '').toLowerCase(),
        routes: []
      };
    }

    controllers[controllerName].routes.push({
      path: key,
      operation: operation,
      operationType: operationType,
      operationName: operation['x-operation-name']
    });
  });

  await walk(
    options.templatePath,
    item => handler(options, controllers, item)
  );
}

function handler(options: CodegenOptions, controllers: ByController, item: Item) {
  let relative = path
    .relative(options.templatePath, path.dirname(item.path));
  let fileName = path.basename(item.path);
  let targetDir = path.resolve(options.basePath, relative);

  fs.mkdirpSync(targetDir);

  if (fileName.includes('#controller')) {
    Object.entries(controllers).map(([key, value]: [string, ControllerInfo]) => {
      let name = fileName.replace(/#controller/, value.fileName);
      handleFile(
        item.path,
        path.join(targetDir, name),
        {
          controllerName: key,
          routes: value.routes
        });
    })
  }
  else {
    handleFile(
      item.path,
      path.join(targetDir, fileName),
      {
        openAPI: options.openAPI,
        controllers: controllers
      });
  }
}

function handleFile(source: string, target: string, data: Data) {
  if (path.extname(target) === '.ejs') {
    ejs.renderFile(source, data, {}, (err, result) => {
      if (err !== null)
        throw err;
      else
        fs.writeFileSync(target.replace(/.ejs$/, ''), result);
    });
  }
  else {
    fs.copyFileSync(source, target);
  }
}

function walk(path: string, handleFile: (item: Item) => void) {

  return new Promise<void>((resolve, reject) => {
    klaw(path)
      .on("data", item => {
        if (!item.stats.isDirectory())
          handleFile(item);
      })
      .on('end', () => resolve())
      .on('error', (err: Error) => reject(err));
  });
}
