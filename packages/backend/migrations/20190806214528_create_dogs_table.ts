import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dogs', table => {
    table
      .increments('id')
      .unsigned()
      .primary()
      .notNullable();
    table
      .string('microchipNo', 15)
      .unique()
      .index()
      .nullable();
    table.string('name').nullable();
    table.string('gender', 1).notNullable();
    table.date('dateOfBirth').nullable();
    table
      .integer('owner')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('breeder')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('breed')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('breeds')
      .onDelete('SET NULL');
    table
      .integer('picture')
      .unsigned()
      .nullable()
      .unique()
      .references('id')
      .inTable('uploads')
      .onDelete('SET NULL');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dogs');
}
