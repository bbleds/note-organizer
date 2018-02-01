const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const knex = require('../db/knex')
const { ADMIN_SECRET_KEY } = require('../../config')

chai.use(chaiHttp)

describe('/api/users endpoints', () => {
		
	// create a promise for creating a new user
	const userCreation = new Promise((resolve, reject) => {
		
		// Test creation of new user
		describe('POST /users - New User Creation', () => {
			it('should not create a new user if invalid credentials are specified', done => {
				chai.request('http://localhost:4000')
				.post('/api/users')
				.set('authorization', 'testing')
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not create a new user if invalid properties specified', done => {
				chai.request('http://localhost:4000')
				.post('/api/users')
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'some_invalid_key': 'testing'})
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should create a new user if all properties and credentials are valid', done => {
				chai.request('http://localhost:4000')
				.post('/api/users')
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'first_name': 'testing', 'last_name':'testing', 'email':Date.now().toString()+'@testing.com'})
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					if(!res.body.error) {
						resolve(res.body.data[0].user_id)
					} else {
						reject('Could not create user id')
					}
					done()
				})
			})
		})
	})
		
	userCreation
	.then((newUserId)=>{
		
		// test general listing of all users
	  describe('GET /users - Get Users', () => {
	      it('should not retrieve users if authorization header does not exist', done => {
					chai.request('http://localhost:4000')
				  .get('/api/users')
				  .end((err, res) => {
				    expect(res.body.error).to.equal(true)
				    done()
				  })
	      })
				it('should not retrieve users if authorization header is incorrect', done => {
					chai.request('http://localhost:4000')
					.get('/api/users')
					.set('authorization', 'foobar')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						expect(res.status).to.equal(401)
						done()
					})
				})
				it('should retrieve users if authorization header is correct', done => {
					chai.request('http://localhost:4000')
					.get('/api/users')
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						done()
					})
				})
	  })
		
		// test general listing of one user
		describe('GET /users/:id - Get Single User', () => {
				it('should not retrieve user if invalid id is passed in', done => {
					chai.request('http://localhost:4000')
					.get('/api/users/someInvalidId')
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not retrieve user if no user exists with specified id', done => {
					chai.request('http://localhost:4000')
					.get('/api/users/9999999999')
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not retrieve user if no valid credentials are passed in', done => {
					chai.request('http://localhost:4000')
					.get('/api/users/1')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should retrieve user if valid id and credentials are specified', done => {
					chai.request('http://localhost:4000')
					.get(`/api/users/${newUserId}`)
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						expect(res.body.data[0].id).to.equal(newUserId)
						done()
					})
				})
		})
		
		// test ability to edit a user
		describe('POST /users/:id - Edit User', () => {
			const firstName = 'testing_from_tests'+Date.now().toString()
				it('should not update user if invalid id is passed in', done => {
					chai.request('http://localhost:4000')
					.post('/api/users/someInvalidId')
					.set('authorization', ADMIN_SECRET_KEY)
					.send({first_name: firstName})
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not update user if no user exists with specified id', done => {
					chai.request('http://localhost:4000')
					.post('/api/users/88888888888')
					.set('authorization', ADMIN_SECRET_KEY)
					.send({first_name: firstName})
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not update user if invalid credentials are provided', done => {
					chai.request('http://localhost:4000')
					.post('/api/users/1')
					.set('authorization', 'testing')
					.send({first_name: firstName})
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should update user if valid id is specified and valid credentials are passed', done => {
					chai.request('http://localhost:4000')
					.post(`/api/users/${newUserId}`)
					.set('content-type', 'application/x-www-form-urlencoded')
					.set('authorization', ADMIN_SECRET_KEY)
					.send({first_name: firstName})
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						expect(res.body.data[0].first_name).to.equal(firstName)
						done()
					})
				})
		})
		
		// test ability to edit a user
		describe('DELETE /users/:id - Delete User', () => {
				it('should not delete user if invalid id is passed in', done => {
					chai.request('http://localhost:4000')
					.delete('/api/users/someInvalidId')
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not delete user if no user exists with specified id', done => {
					chai.request('http://localhost:4000')
					.delete('/api/users/88888888888')
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not delete user if invalid credentials are provided', done => {
					chai.request('http://localhost:4000')
					.delete('/api/users/1')
					.set('authorization', 'testing')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should delete user if valid id is specified and valid credentials are passed', done => {
					chai.request('http://localhost:4000')
					.delete(`/api/users/${newUserId}`)
					.set('authorization', ADMIN_SECRET_KEY)
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						done()
					})
				})
		})
	})
	.catch((err)=>{
		describe('Error: failed user creation', () => {
			it('should fail because we could not create a user. Check user creation endpoint.', () => {
				expect(1).to.equal(0)
			})
		})
	})
})
