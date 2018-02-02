
exports.up = (knex, Promise) => {
	return knex.schema.createTable('users', table => {
		table.increments() // create unique id field as primary key
		table.string('first_name').notNullable()
		table.string('last_name').notNullable()
		table.string('google_id').notNullable().unique()
		table.text('raw_google_api_response')
		table.string('profile_img_url', 1000)
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	}).createTable('notes', table => {
		table.increments() // create id field as primary key
		table.integer('user_id').unsigned().references('id').inTable('users')
		table.string('title').notNullable()
		table.string('description')
		table.text('content').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

exports.down = (knex, Promise) => {
	return knex.schema.dropTable('notes').dropTable('users')
}
