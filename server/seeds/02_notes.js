
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('notes').del()
    .then(() => {
      // Inserts seed entries
      return knex('notes').insert([
        {id: 1, user_id: 1, title: 'test', content: 'my content here'},
        {id: 2, user_id: 2, title: 'testing user 2', description: 'has description', content: 'my content here'},
        {id: 3, user_id: 3, title: 'test user 3', content: 'my content here for user 3'}
      ])
    })
}
