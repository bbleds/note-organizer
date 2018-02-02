const passport = require('passport')

module.exports = (app, knex) => {
  // google oauth
  app.get('/api/auth/google',
    passport.authenticate('google', {
      // request certain permissions
      scope: ['profile', 'email']
    }
  ))

  // get requested google profile information
  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => res.redirect('/dashboard')
  )

  app.get('/api/auth/current_user', (req, res) => {
    res.send(req.user)
  })

  app.get('/api/auth/logout', (req, res) => (req.logout(),res.redirect('/')))
}
