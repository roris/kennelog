import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('elbow_scores', table => {;
    table.integer('id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('measures')
      .onDelete('CASCADE');
    table.integer('left')
      .unsigned()
      .notNullable();
    table.integer('right')
      .unsigned()
      .notNullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('elbow_scores');
}

