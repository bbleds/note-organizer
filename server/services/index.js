module.exports = (app, knex) => {
	require('./passport')(app, knex)	
}
