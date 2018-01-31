const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000
const app = express()
const R = require('ramda')
const knex = require('./db/knex.js')
const { standardRes, trimValue } = require('../utils/utility')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// get all users
app.get('/users', async (req, res) => {
	
	try{	
		const users = await knex.select().from('users')
		res.send(standardRes(users))
	} catch(err){
		res.send(standardRes([], `An error occurred when retrieving users : ${err}`, true))
	}
	
})

// get specific user details
app.get('/users/:id', async (req, res) => {
	
	try{
		const { id } = req.params
		const user = await knex.select().from('users').where('id','=',id)
		user.length ? res.send(standardRes(user))	: res.send(standardRes([], `An error occurred when retrieving this user : User with id ${id} does not exist`, true))
	} catch(err){
		res.send(standardRes([], `An error occurred when retrieving this user : ${err}`, true))
	}
	
})

// edit 
app.post('/users/:id', async (req, res) => {
	
	const { body } = req
	const { id } = req.params
	
	if (R.isEmpty(body)) return res.send(standardRes([], `You must specify at least one user property to update`, true))
	
	const allowedProperties = ['first_name', 'last_name']
	
  // filter by allowedProperties and trim each value
	let data = R.map(trimValue, R.pickBy( (v,k) => (v.trim() && R.contains(k, allowedProperties)), body))
	
	if(R.isEmpty(data)) return res.send(standardRes([], 'An error occurred: there were no valid user values provided. Please check your values and try again', true))
	
	try {
		await knex('users').update(data).where('id','=',id)
		res.send(standardRes(data, 'User updated successfully. NOTE - some properties may have been removed if invalid keys were specified'))	
	} catch(err) {
		res.send(standardRes([], `An error occurred when updating this user : ${err}`, true))
	}
	

})

app.listen(PORT, () => console.log('App listening on port', PORT))
