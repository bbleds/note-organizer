const config = require('../config')

module.exports = {
	'development':{
		client: 'mysql',
	  connection: config.KNEX_MYSQL_CONNECTION
	}
}
