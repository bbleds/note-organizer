const R = require('ramda')
const knex = require('../db/knex.js')
const {
	authorizeRequest,
	standardRes,
	trimValue,
	validateRequiredNoteData
} = require('../../utils/utility')

// requires that the request contains a valid authorization header
const requireGeneralAuthorization = (req, res, next) => {
	const authorization = authorizeRequest(req)
	if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
	next()
}

// requires that the request originates from a particular user or that the request contains a valid authorization header
const requireUserOrGeneralAuthorization = (req, res, next) => {
	const { userId, noteId } = req.params

	if(req.user === undefined || req.user.id != userId){
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
	}
	next()
}

// checks that the request body is not empty
const validateRequestBody = (req, res, next) => {
	const { body } = req
	if (R.isEmpty(body)) return res.send(standardRes([], 'An error occurred : You must specify all required properties', true))
	next()
}

// checks that a record exists in the notes table with a particular user and note id
const validateUserAndNoteIds = async (req, res, next) => {
	const { userId, noteId } = req.params

	try{
		const note = await knex('notes').select().where({id: noteId, user_id: userId})
		if(!note.length) return res.send(standardRes([], `An error occurred: no notes exist with the id ${noteId} belonging to user with id ${userId}`, true))
	} catch(err){
		return res.send(standardRes([], `An error occurred: ${err}`, true))
	}
	next()
}

// checks that a record exists in the users table with a particular id
const validateUserId = async(req, res, next) => {

	const id = req.params.userId || req.params.id

	try{
		const user = await knex.select().from('users').where('id','=',id)
		if (!user.length) return res.send(standardRes([], `An error occurred when retrieving this user : User with id: ${id} does not exist`, true))
	} catch(err){
		res.send(standardRes([], `An error occurred when updating this user : ${err}`, true))
	}
	next()
}

module.exports = {
	requireGeneralAuthorization,
	requireUserOrGeneralAuthorization,
	validateRequestBody,
	validateUserAndNoteIds,
	validateUserId
}
