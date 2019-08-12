import { Application } from './declarations';
import { Model } from 'objection';

export default function (app: Application): void {
  const pg = app.get('postgres');
  const sqlite = app.get('sqlite');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const {client, connection} = (isDevelopment ? sqlite : pg);

  const knex = require('knex')({ client, connection, useNullAsDefault: false });

  Model.knex(knex);
  app.set('knex', knex);
}
