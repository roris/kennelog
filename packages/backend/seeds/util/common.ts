import * as Knex from 'knex';

export const getUserByEmail = async (knex: Knex, email: string) => {
  return getRecord(knex, 'users', { email: email });
};

export const getRecord = async (knex: Knex, table: string, query) => {
  const records = await getRecords(knex, table, 1, query);
  return records[0];
};

export const getRecords = async (
  knex: Knex,
  table: string,
  limit: number,
  query
) => {
  return knex
    .select()
    .from(table)
    .where(query)
    .limit(limit);
};

export const getAllRecords = async (knex: Knex, table: string) => {
  return knex.select().from(table);
};

export const getLastNRecords = async (
  knex: Knex,
  table: string,
  limit: number
) => {
  return knex
    .select()
    .from(table)
    .orderBy('id', 'desc')
    .limit(limit);
};

export const insertMeasures = async (
  knex: Knex,
  dog: number,
  datesMeasuredOn: string[]
) => {
  const data = datesMeasuredOn.map(date => {
    return {
      measuredOn: date,
      dog: dog,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  await knex('measures').insert(data);

  const inserted = await getLastNRecords(knex, 'measures', data.length);

  return inserted.map(measures => measures.id);
};
