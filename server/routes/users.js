const R = require('ramda')
const { requiredUserProperties } = require('../../constants/user')
const {
	standardRes,
	trimValue,
	validateEditableUserData,
	validateRequiredUserData,
	authorizeRequest
} = require('../../utils/utility')
const {
	requireGeneralAuthorization,
	requireUserOrGeneralAuthorization,
	validateRequestBody,
	validateUserId
} = require('../middlewares/requestValidation')

module.exports = (app, knex) => {

	// get all users
	app.get('/api/users',
		requireGeneralAuthorization,
		async (req, res) => {
			try{
				res.send(standardRes(await knex.select().from('users')))
			} catch(err){
				res.send(standardRes([], `An error occurred when retrieving users : ${err}`, true))
			}
	})

	// create new user
	app.post('/api/users',
	 	requireGeneralAuthorization,
		validateRequestBody,
		async(req, res) => {
			const { body } = req

			// validate key/value and trim each applicable value
			const data = R.map(trimValue, R.pickBy(validateRequiredUserData, body))

	    // be sure we have the exact keys that are required
			if (R.isEmpty(data)) return res.send(standardRes([], 'An error occurred when creating this user : You must specify all required user properties', true))

			try{
				const existingUser = await knex('users').select().where('email','=',data.email)
				if (existingUser.length) return res.send(standardRes([], 'An error occurred: a user already exists with this email, please try again', true))
			} catch(err){
				return res.send(standardRes([], `An error occurred when validating this new user : ${err}`, true))
			}

			try{
				const user = await knex('users').insert(R.assoc('updated_at', knex.fn.now(), data)).returning('*')
				res.send(standardRes({user_id: user[0]}))
			} catch(err){
				res.send(standardRes([], `An error occurred when creating this user : ${err}`, true))
			}
	})

	// get specific user details
	app.get('/api/users/:id',
	 	requireUserOrGeneralAuthorization,
		async (req, res) => {
			try{
				const user = await knex.select().from('users').where('id','=',req.params.id)
				user.length ?
					res.send(standardRes(user))	:
					res.send(standardRes([], `An error occurred when retrieving this user : User with id: ${id} does not exist`, true))
			} catch(err){
				res.send(standardRes([], `An error occurred when retrieving this user : ${err}`, true))
			}
	})

	// edit
	app.post('/api/users/:id',
		requireUserOrGeneralAuthorization,
		validateRequestBody,
		validateUserId,
		async (req, res) => {
		  // validate key/value and trim each applicable value
			const data = R.map(trimValue, R.pickBy(validateEditableUserData, req.body))
			if (R.isEmpty(data)) return res.send(standardRes([], 'An error occurred: there were no valid user values provided. Please check your values and try again', true))

			try {
				await knex('users').update(R.merge({updated_at:knex.fn.now()},data)).where('id','=',req.params.id)
				res.send(standardRes(data, 'User updated successfully. NOTE - some properties may have been removed if invalid keys were specified'))
			} catch(err) {
				res.send(standardRes([], `An error occurred when updating this user : ${err}`, true))
			}
	})

	// delete
	app.delete('/api/users/:id',
		requireGeneralAuthorization,
		validateUserId,
		async (req, res) => {
			try {
				await knex('users').where('id','=',req.params.id).del()
				res.send(standardRes({}, `Successfully deleted user with id: ${req.params.id}`))
			} catch(err) {
				res.send(standardRes([], `An error occurred when deleting this user : ${err}`, true))
			}
	})
}
