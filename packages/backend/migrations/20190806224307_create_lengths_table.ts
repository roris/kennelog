import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('lengths', table => {;
    table.integer('id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('measures')
      .onDelete('CASCADE');
    table.float('length')
      .notNullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('lengths');
}

