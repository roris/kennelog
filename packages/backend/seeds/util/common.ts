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

export const insertMeasures = async (knex: Knex) => {
  const measurementDates = ['2015-01-01', '2016-01-01', '2017-01-01'];
  const user = await getUserByEmail(knex, 'johnsmith@email.local');
  const dog = await getEldestDogByOwnerAndGender(knex, user.id, 'M');
  const data = measurementDates.map(date => {
    return {
      measuredOn: date,
      dog: dog.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  await knex('measures').insert(data);

  const inserted = await getLastNRecords(knex, 'measures', data.length);

  return inserted.map(measures => measures.id);
};

export const updateRecord = async (
  knex: Knex,
  table: string,
  id: number,
  params
) => {
  if (params.id) {
    delete params['id'];
  }

  await knex(table)
    .where({ id: id })
    .update(params);
};

export const mergeIdAndData = (ids: number[], data: any[]) => {
  const shorter = ids.length < data.length ? ids : data;
  const mergedData = new Array(shorter.length).fill({}).map((value, index) => {
    return {
      id: ids[index],
      ...data[index]
    };
  });

  return mergedData;
};

export const getEldestDogByOwnerAndGender = async (
  knex: Knex,
  ownerId: number,
  gender: string
) => {
  const dogs = await knex
    .select()
    .from('dogs')
    .where({ owner: ownerId })
    .andWhere({ gender: gender })
    .orderBy('dateOfBirth', 'asc')
    .limit(1);
  return dogs[0];
};
