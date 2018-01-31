const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000
const app = express()
const R = require('ramda')
const knex = require('./db/knex.js')
const { standardRes, trimValue, validateUserData } = require('../utils/utility')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

require('./routes')(app, knex)

app.listen(PORT, () => console.log('App listening on port', PORT))
