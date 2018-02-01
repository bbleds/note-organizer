const R = require('ramda')
const { 
	authorizeRequest, 
	standardRes, 
	trimValue
} = require('../../utils/utility')

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