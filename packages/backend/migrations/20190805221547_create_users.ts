import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table => {
        table.increments('id')
          .unsigned()
          .primary()
          .notNullable();
        table.string('licenseNo', 50)
          .nullable()
          .unique();
        // RFC 2821
        table.string('email', 254)
          .unique()
          .nullable();
        table.string('password', 60);
        table.string('name')
          .nullable();
        table.date('dateOfBirth')
          .nullable();
        table.string('avatar')
          .nullable();
        table.timestamp('createdAt');
        table.timestamp('updatedAt');
      })
        .then(() => console.log('Created users table')) // eslint-disable-line no-console
        .catch(e => console.error('Error creating users table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error creating users table', e)); // eslint-disable-line no-console
}

export async function down(knex: Knex): Promise<any> {
  return  knex.schema.hasTable('users').then(exists => {
    if (exists) {
      knex.schema.dropTable('users');
    }
  });
}

