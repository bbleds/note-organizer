
exports.up = (knex, Promise) => {
	return knex.schema.createTable('users', table => {
		table.increments() // create id field as primary key
		table.string('name').notNullable()
		table.string('email').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
};

exports.down = (knex, Promise) => {
	return knex.schema.dropTable('users')
};
