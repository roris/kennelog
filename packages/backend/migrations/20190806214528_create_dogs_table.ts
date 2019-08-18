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
      .integer('ownerId')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('breederId')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('breedId')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('breeds')
      .onDelete('SET NULL');
    table
      .integer('pictureId')
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
