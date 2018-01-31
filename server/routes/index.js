module.exports = (app, knex) => {
	require('./users')(app, knex)
}
