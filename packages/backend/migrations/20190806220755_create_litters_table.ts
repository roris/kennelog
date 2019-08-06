import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('litters', table => {
    table.increments('id')
      .unsigned()
      .notNullable()
      .primary();
    table.integer('parents')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('pairs');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('litters');
}

