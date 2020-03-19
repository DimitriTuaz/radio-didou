import { RadiodApplication } from './application';
import { DataSource, ModelDefinition } from '@loopback/repository';

import { Collection } from 'mongodb'

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  const app = new RadiodApplication();
  await app.boot();

  console.log('~ USING CONNECTOR MIGRATION ~');

  await app.migrateSchema({ existingSchema });
  console.log('-> done!\n');

  console.log('~ ADDING DEFAULT VALUES IF NECESSARY ~');

  let datasource: DataSource = await app.get('datasources.mongo');
  let connector: any = datasource.connector;
  const promises = Object.entries(datasource.models).map(([key, model]: [string, any]) => {
    return update_collection(connector.collection(key), model.definition);
  });
  await Promise.all(promises);
  console.log('-> done!\n');
  process.exit(0);
}

async function update_collection(collection: Collection, definition: ModelDefinition) {
  let objects = await collection.find().toArray();
  let defaults = new Map<string, any>();
  let count: number = 0;

  for (let key in definition.properties) {
    let property = definition.properties[key];
    if (property.required == true && property.default != undefined)
      defaults.set(key, property.default);
  }

  for (let object of objects) {
    let updated: boolean = false;
    let update: any = {};
    for (let [key, value] of defaults) {
      if (object[key] == undefined) {
        update[key] = value;
        updated = true;
      }
    }
    if (updated) {
      ++count;
      await collection.updateOne({ _id: object['_id'] }, { "$set": update });
    }
  }
  console.log('| ' + definition.name + ' (' + count + ' updated)')
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
