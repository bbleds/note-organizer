
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, first_name: 'bob', last_name: 'user', google_id: 'something'},
        {id: 2, first_name: 'sarah', last_name: 'user', google_id: 'something-else'},
        {id: 3, first_name: 'bill', last_name: 'user', google_id: 'something-else-else'}
      ])
    })
}
