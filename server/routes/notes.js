const R = require('ramda')
const { 
	authorizeRequest, 
	standardRes, 
	trimValue,
	validateRequiredNoteData
} = require('../../utils/utility')
const { requiredNoteProperties } = require('../../constants/notes')

module.exports = (app, knex) => {
	
  // get all notes
	app.get('/api/notes', async (req, res) => {
		
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.send(standardRes([], authorization.msg, true))
		
		try{	
			const notes = await knex('notes').select()
			res.send(standardRes(notes))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving notes: ${err}`, true))
		}
	})
	
	// get a single note
	app.get('/api/users/:userId/notes/:noteId', async (req, res) => {
		
		const { userId, noteId } = req.params
		const { body } = req
		
		if(req.user === undefined || req.user.id != userId){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		try{	
			const note = await knex('notes').select().where({id: noteId, user_id: userId})
			if(!note.length) return res.send(standardRes([], `An error occurred when retrieving this note: a note with id ${id} on user with id ${userId} does not exist`, true))
			res.send(standardRes(note))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving a note: ${err}`, true))
		}
		
	})
	
	// create new note
	app.post('/api/users/:userId/notes', async (req, res) => {
		
		const { userId } = req.params
		const { body } = req
		
		if(req.user === undefined || req.user.id != userId){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		if (R.isEmpty(body)) return res.send(standardRes([], 'An error occurred when creating a note : You must specify all required properties', true)) 
		
		// validate key/value and trim each applicable value
		const data = R.map(trimValue, R.pickBy(validateRequiredNoteData, body))
		
		if (R.isEmpty(data) || R.intersection(R.keysIn(data), requiredNoteProperties).length !== requiredNoteProperties.length) return res.send(standardRes([], 'An error occurred when creating a note : You must specify all required properties', true)) 
		
		try{	
			const additionalData = {updated_at: knex.fn.now(), created_at: knex.fn.now(), user_id: userId}
			const note = await knex('notes').insert(R.merge(additionalData,data)).returning('*')
			res.send(standardRes({'note_id':note[0]}))
		} catch(err){
			res.send(standardRes([], `An error occurred when adding a note: ${err}`, true))
		}
	})
	
	// edit existing note
	app.post('/api/users/:userId/notes/:noteId', async (req, res) => {
		
		const { userId, noteId } = req.params
		const { body } = req
		
		if(req.user === undefined || req.user.id != userId){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		try{	
			const note = await knex('notes').select().where({id: noteId, user_id: userId})
			if(!note.length) return res.send(standardRes([], `An error occurred when editing a note: a note with the id ${noteId} on user with id :${userId} does not exist`, true))
		} catch(err){
			res.send(standardRes([], `An error occurred when editing a note: ${err}`, true))
		}
		
		if (R.isEmpty(body)) return res.send(standardRes([], 'An error occurred when editing a note : You must specify all required properties', true)) 
		
		// validate key/value and trim each applicable value
		const data = R.map(trimValue, R.pickBy(validateRequiredNoteData, body))
		
    // be sure that data exists and that it has the required fields
		if (R.isEmpty(data)) return res.send(standardRes([], 'An error occurred when editing a note : You must specify all required properties', true)) 
		
		try{	
			const additionalData = {updated_at: knex.fn.now()}
			const note = await knex('notes').update(R.merge(additionalData,data)).where('id','=',noteId)
			res.send(standardRes(data))
		} catch(err){
			res.send(standardRes([], `An error occurred when editing a note: ${err}`, true))
		}
	})
	
	// delete a note
	app.delete('/api/users/:userId/notes/:noteId', async (req, res) => {
		const { userId, noteId } = req.params
		const { body } = req
		
		if(req.user === undefined || req.user.id != userId){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		try{
			const note = await knex('notes').select().where({id: noteId, user_id: userId})
			if(!note.length) return res.send(standardRes([], `An error occurred when deleting a note: no notes exist with the id ${noteId} belonging to user with id ${userId}`, true))
		} catch(err){
			return res.send(standardRes([], `An error occurred when deleting a note: ${err}`, true))
		}
		
		try{	
			const delRes = await knex('notes').where('id','=',noteId).del()
			res.send(standardRes({success:delRes}))
		} catch(err){
			res.send(standardRes([], `An error occurred when deleting a note: ${err}`, true))
		}
	})

}