
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'bob', email: 'bob@bob.com'},
        {id: 2, name: 'bill', email: 'bill@bob.com'},
        {id: 3, name: 'sarah', email: 'sarah@bob.com'}
      ]);
    });
};
