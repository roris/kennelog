import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('hip_scores', table => {;
    table.integer('id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('measures')
      .onDelete('CASCADE');
    // Norberg angle
    table.integer('na_l')
      .notNullable();
    table.integer('na_r')
      .notNullable();
    // subluxation
    table.integer('s_l')
      .notNullable();
    table.integer('s_l')
      .notNullable();
    // cranial acetabular edge
    table.integer('crae_l')
      .notNullable();
    table.integer('crae_r')
      .notNullable();
    // dorsal acetabular edge
    table.integer('dae_l')
      .notNullable();
    table.integer('dae_r')
      .notNullable();
    // cranial effective acetabular rim
    table.integer('craer_l')
      .notNullable();
    table.integer('craer_r')
      .notNullable();
    // acetabular fossa
    table.integer('af_l')
      .notNullable();
    table.integer('af_r')
      .notNullable();
    // caudal acetabular edge
    table.integer('cdae_l')
      .notNullable();
    table.integer('cdae_r')
      .notNullable();
    // femoral head/neck exostosis
    table.integer('fhne_l')
      .notNullable();
    table.integer('fhne_r')
      .notNullable();
    // femoral head recontouring
    table.integer('fhrc_l')
      .notNullable();
    table.integer('fhrc_r')
      .notNullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('hip_scores');
}

