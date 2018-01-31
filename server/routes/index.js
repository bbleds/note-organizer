module.exports = (app, knex) => {
	require('./users')(app, knex)
	require('./notes')(app, knex)
}
