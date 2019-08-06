import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('dogs_litters', table => {
    table.increments('id')
      .unsigned()
      .primary()
      .notNullable();
    table.integer('dog')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('dogs')
      .onDelete('CASCADE');
    table.integer('litter')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('litters')
      .onDelete('CASCADE');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('dogs_litters');
}

