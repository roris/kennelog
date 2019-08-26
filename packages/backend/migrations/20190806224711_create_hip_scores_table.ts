import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('hip_scores', table => {
    table
      .integer('id')
      .unsigned()
      .notNullable()
      .primary()
      .references('id')
      .inTable('measures')
      .onDelete('CASCADE');
    // Norberg angle
    table.integer('norbergAngleLeft').notNullable();
    table.integer('norbergAngleRight').notNullable();
    // subluxation
    table.integer('subluxationLeft').notNullable();
    table.integer('subluxationRight').notNullable();
    // cranial acetabular edge
    table.integer('cranialAcetabularEdgeLeft').notNullable();
    table.integer('cranialAcetabularEdgeRight').notNullable();
    // dorsal acetabular edge
    table.integer('dorsalAcetabularEdgeLeft').notNullable();
    table.integer('dorsalAcetabularEdgeRight').notNullable();
    // cranial effective acetabular rim
    table.integer('cranialEffectiveAcetabularRimLeft').notNullable();
    table.integer('cranialEffectiveAcetabularRimRight').notNullable();
    // acetabular fossa
    table.integer('acetabularFossaLeft').notNullable();
    table.integer('acetabularFossaRight').notNullable();
    // caudal acetabular edge
    table.integer('caudalAcetabularEdgeLeft').notNullable();
    table.integer('caudalAcetabularEdgeRight').notNullable();
    // femoral head/neck exostosis
    table.integer('femoralHeadNeckExostosisLeft').notNullable();
    table.integer('femoralHeadNeckExostosisRight').notNullable();
    // femoral head recontouring
    table.integer('femoralHeadRecontouringLeft').notNullable();
    table.integer('femoralHeadRecontouringRight').notNullable();
    // total score
    table.integer('totalScore').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('hip_scores');
}
