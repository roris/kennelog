import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('breeds', table => {
    table.increments('id')
      .unsigned()
      .notNullable();
    table.string('name')
      .notNullable()
      .unique();
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('breeds');
}
