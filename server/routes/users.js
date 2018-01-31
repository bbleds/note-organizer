const { standardRes, trimValue, validateUserData } = require('../../utils/utility')
const { ADMIN_SECRET_KEY } = require('../../config')
const R = require('ramda')

module.exports = (app, knex) => {
	
	// get all users
	app.get('/api/users', async (req, res) => {
		
		if(req.headers.authorization !== ADMIN_SECRET_KEY) return res.send(standardRes([], 'You do not have access to perform this action', true))
		
		try{	
			const users = await knex.select().from('users')
			res.send(standardRes(users))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving users : ${err}`, true))
		}
		
	})

	// get specific user details
	app.get('/api/users/:id', async (req, res) => {
		
		try{
			const { id } = req.params
			const user = await knex.select().from('users').where('id','=',id)
			user.length ? res.send(standardRes(user))	: res.send(standardRes([], `An error occurred when retrieving this user : User with id ${id} does not exist`, true))
		} catch(err){
			res.send(standardRes([], `An error occurred when retrieving this user : ${err}`, true))
		}
		
	})

	// edit 
	app.post('/api/users/:id', async (req, res) => {
		
		const { body } = req
		const { id } = req.params
		
		if (R.isEmpty(body)) return res.send(standardRes([], 'You must specify at least one user property to update', true))
		
		const user = await knex.select().from('users').where('id','=',id)
		if (!user.length) return res.send(standardRes([], `No user exists with id: ${id}`, true))
		
	  // validate key/value and trim each applicable value
		const data = R.map(trimValue, R.pickBy(validateUserData, body))
		
		if(R.isEmpty(data)) return res.send(standardRes([], 'An error occurred: there were no valid user values provided. Please check your values and try again', true))
		
		try {
			await knex('users').update(data).where('id','=',id)
			res.send(standardRes(data, 'User updated successfully. NOTE - some properties may have been removed if invalid keys were specified'))	
		} catch(err) {
			res.send(standardRes([], `An error occurred when updating this user : ${err}`, true))
		}	

	})
	
	// edit 
	app.delete('/api/users/:id', async (req, res) => {
		
		if(req.headers.authorization !== ADMIN_SECRET_KEY) return res.send(standardRes([], 'You do not have access to perform this action', true))
		
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