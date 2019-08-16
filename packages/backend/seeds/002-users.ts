import * as Knex from 'knex';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const createUser = async (name, email, dateOfBirth, licenseNo) => {
  const hash = crypto
    .createHash('md5')
    .update(email)
    .digest('hex');
  return {
    name: name,
    email: email,
    password: await bcrypt.hash('password', 10),
    dateOfBirth: dateOfBirth,
    licenseNo: licenseNo,
    avatar: `https://s.gravatar.com/avatar/${hash}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(async () => {
      // Inserts seed entries

      return knex('users').insert([
        await createUser(
          'John Smith',
          'johnsmith@email.local',
          '2001-01-01',
          '123456789'
        ),
        await createUser(
          'Jane Smith',
          'janesmith@email.local',
          '2001-01-01',
          '123456790'
        ),
        await createUser('', 'noname@mail.local', '2001-01-01', '123456791')
      ]);
    });
}
