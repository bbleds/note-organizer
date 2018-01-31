const { standardRes, trimValue, validateUserData } = require('../../utils/utility')
const { authorizeRequest } = require('../../utils/utility')
const R = require('ramda')

module.exports = (app, knex) => {

	app.get('/api/notes', async (req, res) => {
		
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.send(standardRes([], authorization.msg, true))
		
		try{	
			const notes = await knex.select().from('notes')
			res.send(standardRes(notes))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving notes: ${err}`, true))
		}
	})

}