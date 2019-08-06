import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pairs', table => {
    table.increments('id')
      .unsigned()
      .primary()
      .notNullable();
    table.integer('sire')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('dogs');
    table.integer('dame')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('dogs');
    table.integer('pairedBy')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users');
    table.date('pairedOn')
      .nullable();
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('pairs');
}

