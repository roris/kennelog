import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable('dogs').then(exists => {
    if (!exists) {
      knex.schema.createTable('dogs', table => {
        table.increments('id')
          .unsigned()
          .notNullable();
        table.integer('microchipNo')
          .unsigned()
          .unique()
          .index()
          .nullable();
        table.string('name')
          .nullable();
        table.string('gender', 1)
          .notNullable();
        table.date('dateOfBirth')
          .nullable();
        table.integer('owner')
          .unsigned()
          .nullable();
        table.integer('breeder')
          .unsigned()
          .nullable();
        table.foreign('owner')
          .references('id')
          .inTable('users');
        table.foreign('breeder')
          .references('id')
          .inTable('users');
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created dogs table')); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating dogs table', e));
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable('dogs').then(exists => {
    if (exists) {
      knex.schema.dropTable('dogs')
        .then(() => console.log('Dropped table dogs'));  // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error dropping dogs table', e));  // eslint-disable-line no-console
}

