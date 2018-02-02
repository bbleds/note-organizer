const api = require('./api')
const notes = require('./notes')
const user = require('./user')

module.exports = {
	...api,
	...notes,
	...user
}
