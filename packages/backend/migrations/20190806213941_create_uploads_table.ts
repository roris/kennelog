import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('uploads', table => {
    table.increments('id')
      .unsigned()
      .primary()
      .notNullable();
    table.string('uri')
      .unique()
      .index()
      .notNullable();
    table.timestamp('createdAt');
    table.timestamp('updatedAt');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('uploads');
}

