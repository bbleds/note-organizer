
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, first_name: 'bob', last_name: 'user', email: 'bob@example.com'},
        {id: 2, first_name: 'sarah', last_name: 'user', email: 'sarah@example.com'},
        {id: 3, first_name: 'bill', last_name: 'user', email: 'bill@example.com'}
      ])
    })
}
