import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.alterTable('users', t => {
        t.string('avatar');
      })
        .then(() => console.log('Altered users table: added avatar column')) // eslint-disable-line no-console
        .catch(e => console.error('Error altering users table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error altering users table', e)); // eslint-disable-line no-console

}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable('users').then(exists => {
    if (exists) {
      return knex.schema.table('users', t => {
        t.dropColumn('avatar');
      })
        .then(() => console.log('Altered users table')) // eslint-disable-line no-console
        .catch(e => console.error('Error altering users table', e)); // eslint-disable-line no-console
    }
  })
    .catch(e => console.error('Error altering users table', e)); // eslint-disable-line no-console
}

