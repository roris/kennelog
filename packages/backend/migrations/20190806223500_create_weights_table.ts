import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('weights', table => {;
    table.integer('id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('measures')
      .onDelete('CASCADE');
    table.float('weight')
      .notNullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('weights');
}

