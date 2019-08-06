import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('events', table => {
    table.increments('id')
      .unsigned()
      .primary()
      .notNullable();
    table.date('eventDate')
      .notNullable();
    table.string('eventType')
      .index()
      .notNullable();
    table.integer('dog')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('dogs')
      .onDelete('CASCADE');
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('events');
}

