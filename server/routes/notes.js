const { standardRes, trimValue, validateUserData } = require('../../utils/utility')
const { ADMIN_SECRET_KEY } = require('../../config')
const R = require('ramda')

module.exports = (app, knex) => {

	app.get('/api/notes', async (req, res) => {
		
		if(req.headers.authorization !== ADMIN_SECRET_KEY) return res.send(standardRes([], 'You do not have access to perform this action', true))
		
		try{	
			const notes = await knex.select().from('notes')
			res.send(standardRes(notes))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving notes: ${err}`, true))
		}
	})

}