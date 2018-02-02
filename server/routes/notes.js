const R = require('ramda')
const { requiredNoteProperties } = require('../../constants/notes')
const {
	authorizeRequest,
	standardRes,
	trimValue,
	validateRequiredNoteData
} = require('../../utils/utility')
const {
	requireGeneralAuthorization,
	requireUserOrGeneralAuthorization,
	validateRequestBody,
	validateUserAndNoteIds,
	validateUserId
} = require('../middlewares/requestValidation')

module.exports = (app, knex) => {

  // get all notes
	app.get('/api/notes',
		requireGeneralAuthorization,
		async (req, res) => {
			try{
				res.send(standardRes(await knex('notes').select()))
			} catch(err){
				res.send(standardRes([], `An error occurred when retrieving notes: ${err}`, true))
			}
	})

	// get all notes for a user
	app.get('/api/users/:userId/notes',
		validateUserId,
		requireUserOrGeneralAuthorization,
		async (req, res) => {
			try{
				const notes = await knex('notes').select().where({user_id: req.params.userId})
				res.send(standardRes(notes))
			} catch(err){
				res.send(standardRes([], `An error occurred when retrieving a note: ${err}`, true))
			}
	})

	// get a single note
	app.get('/api/users/:userId/notes/:noteId',
		requireUserOrGeneralAuthorization,
		async (req, res) => {
			const { userId, noteId } = req.params
			try{
				const note = await knex('notes').select().where({id: noteId, user_id: userId})
				if(!note.length) return res.send(standardRes([], `An error occurred when retrieving this note: a note with id ${id} on user with id ${userId} does not exist`, true))
				res.send(standardRes(note))
			} catch(err){
				res.send(standardRes([], `An error occurred when retrieving a note: ${err}`, true))
			}
	})

	// create new note
	app.post('/api/users/:userId/notes',
		requireUserOrGeneralAuthorization,
		validateRequestBody,
		async (req, res) => {
			// validate key/value and trim each applicable value
			const data = R.map(trimValue, R.pickBy(validateRequiredNoteData, req.body))

			if (R.isEmpty(data) || R.intersection(R.keysIn(data), requiredNoteProperties).length !== requiredNoteProperties.length) {
				return res.send(standardRes([], 'An error occurred when creating a note : You must specify all required properties', true))
			}

			try{
				const additionalData = {updated_at: knex.fn.now(), created_at: knex.fn.now(), user_id: req.params.userId}
				const note = await knex('notes').insert(R.merge(additionalData,data)).returning('*')
				res.send(standardRes({'note_id':note[0]}))
			} catch(err){
				res.send(standardRes([], `An error occurred when adding a note: ${err}`, true))
			}
	})

	// edit existing note
	app.post('/api/users/:userId/notes/:noteId',
		requireUserOrGeneralAuthorization,
		validateRequestBody,
		validateUserAndNoteIds,
		async (req, res) => {
			const { noteId } = req.params

			// validate key/value and trim each applicable value
			const data = R.map(trimValue, R.pickBy(validateRequiredNoteData, req.body))

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
	app.delete('/api/users/:userId/notes/:noteId',
		requireUserOrGeneralAuthorization,
		validateUserAndNoteIds,
		async (req, res) => {
			const { userId, noteId } = req.params
			const { body } = req

			try{
				const delRes = await knex('notes').where('id','=',noteId).del()
				res.send(standardRes({success:delRes}))
			} catch(err){
				res.send(standardRes([], `An error occurred when deleting a note: ${err}`, true))
			}
	})
}
