const R = require('ramda')
const { 
	standardRes, 
	trimValue, 
	validateEditableUserData, 
	validateRequiredUserData, 
	authorizeRequest 
} = require('../../utils/utility')
const { requiredUserProperties } = require('../../constants/user')

module.exports = (app, knex) => {
	
	// get all users
	app.get('/api/users', async (req, res) => {
		
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		
		try{	
			const users = await knex.select().from('users')
			res.send(standardRes(users))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving users : ${err}`, true))
		}
		
	})
	
	// create new user
	app.post('/api/users', async(req, res) => {
		
		const { body } = req
		
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		
		if (R.isEmpty(body)) return res.send(standardRes([], 'An error occurred when creating this user : You must specify all required user properties', true))
		
		// validate key/value and trim each applicable value
		const data = R.map(trimValue, R.pickBy(validateRequiredUserData, body))
		
    // be sure we have the exact keys that are required
		if(R.isEmpty(data) || !R.equals(Object.keys(data).sort(), requiredUserProperties.sort())) return res.send(standardRes([], 'An error occurred when creating this user : You must specify all required user properties', true))

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
	app.get('/api/users/:id', async (req, res) => {
		
		const { id } = req.params

		if(req.user === undefined || req.user.id != id){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		try{
			const user = await knex.select().from('users').where('id','=',id)
			user.length ? res.send(standardRes(user))	: res.send(standardRes([], `An error occurred when retrieving this user : User with id: ${id} does not exist`, true))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving this user : ${err}`, true))
		}
		
	})

	// edit 
	app.post('/api/users/:id', async (req, res) => {
		
		const { body } = req
		const { id } = req.params
		
		if(req.user === undefined || req.user.id != id){
			const authorization = authorizeRequest(req)
			if(authorization.error) return res.status(401).send(standardRes([], authorization.msg, true))
		}
		
		if (R.isEmpty(body)) return res.send(standardRes([], 'An error occurred when retrieving this user : You must specify at least one user property to update', true))
		
		const user = await knex.select().from('users').where('id','=',id)
		if (!user.length) return res.send(standardRes([], `An error occurred when retrieving this user : User with id: ${id} does not exist`, true))
		
	  // validate key/value and trim each applicable value
		const data = R.map(trimValue, R.pickBy(validateEditableUserData, body))
		
		if(R.isEmpty(data)) return res.send(standardRes([], 'An error occurred: there were no valid user values provided. Please check your values and try again', true))
		
		try {
			await knex('users').update(data).where('id','=',id)
			res.send(standardRes(data, 'User updated successfully. NOTE - some properties may have been removed if invalid keys were specified'))	
		} catch(err) {
			res.send(standardRes([], `An error occurred when updating this user : ${err}`, true))
		}	

	})
	
	// delete
	app.delete('/api/users/:id', async (req, res) => {
		
		const authorization = authorizeRequest(req)
		if(authorization.error) return res.send(standardRes([], authorization.msg, true))
		
		const { id } = req.params
		
		const user = await knex.select().from('users').where('id','=',id)
		if (!user.length) return res.send(standardRes([], `No user exists with id: ${id}`, true))
		
		try {
			await knex('users').where('id','=',id).del()
			res.send(standardRes({}, `Successfully deleted user with id: ${id}`))	
		} catch(err) {
			res.send(standardRes([], `An error occurred when deleting this user : ${err}`, true))
		}	

	})
	
}