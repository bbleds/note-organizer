const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CALLBACK_URL
} = require('../../config')


module.exports = (app, knex) => {
	passport.serializeUser((user, done) => {
	  console.log('serialize', user);
	  done(null, user.id)
	})

	passport.deserializeUser((userID, done) => {
	  console.log('deserialize', userID);
		knex('users').select().where({id:userID})
		.then((user) => {
			done(null, user[0])
		})
		.catch((err)=>{
			done(null, false)
		})
	})

	// register google oauth with passport and specify callback url
	passport.use(
	  new GoogleStrategy(
	    {
	      clientID: GOOGLE_CLIENT_ID,
	      clientSecret: GOOGLE_CLIENT_SECRET,
	      callbackURL: GOOGLE_CALLBACK_URL
	    },
	    async (accessToken, refreshToken, profile, done) => {
	      try {
	        // if no existing user is found, we should create one and then continue auth flow
					const existingUser = await knex('users').select().where({google_id: profile.id})
					
					if( existingUser.length ) return done(null, existingUser[0])
					// console.log('made it here after', profile);
					const newUserCreationResp = await knex('users').insert({
						first_name : profile.name.familyName,
						last_name: profile.name.givenName,
						google_id: profile.id,
						raw_google_api_response: profile._raw,
						profile_img_url: profile.photos[0] ? profile.photos[0].value.split('?')[0] : null
					})
					console.log('new user', newUserCreationResp);
					const newUser = await knex('users').select().where({id:newUserCreationResp[0]})

					done(null, newUser[0])
	      }
	      catch(error) {
	        console.log('an error occurred during auth', error)
	      }
	}))
}
