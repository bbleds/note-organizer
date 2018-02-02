const express = require('express')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const R = require('ramda')
const knex = require('./db/knex.js')
const app = express()
const PORT = process.env.PORT || 4000
const { COOKIE_KEY } = require('../config')
require('./services')(app, knex)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [COOKIE_KEY] // key used for encryption
  })
)

app.use(passport.initialize())
app.use(passport.session())

require('./routes')(app, knex)

app.listen(PORT, () => console.log('App listening on port', PORT))
