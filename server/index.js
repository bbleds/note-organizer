const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000
const app = express()
const knex = require('./db/knex.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/users', (req, res) => {
	knex.select().from('users')
		.then((data) => {
			res.send(data)
		})
})

app.listen(PORT, () => console.log('App listening on port', PORT))
