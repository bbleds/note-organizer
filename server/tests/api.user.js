const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const knex = require('../db/knex')
const { ADMIN_SECRET_KEY } = require('../../config')

chai.use(chaiHttp)

describe('/api/users endpoints', () => {
		
    // test general listing of all users
    describe('/users', () => {
        it('should not retrieve users if authorization header does not exist', (done) => {
					chai.request('http://localhost:4000')
				  .get('/api/users')
				  .end((err, res) => {
				    expect(res.body.error).to.equal(true)
				    done()
				  })
        })
				it('should not retrieve users if authorization header is incorrect', (done) => {
					chai.request('http://localhost:4000')
					.get('/api/users')
					.set('authorization', 'foobar')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						expect(res.status).to.equal(401)
						done()
					})
				})
				it('should retrieve users if authorization header is correct', (done) => {
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
		describe('GET /users/:id', () => {
				it('should not retrieve user if invalid id is passed in', (done) => {
					chai.request('http://localhost:4000')
					.get('/api/users/someInvalidId')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not retrieve user if no user exists with specified id', (done) => {
					chai.request('http://localhost:4000')
					.get('/api/users/9999999999')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should retrieve user if valid id is specified', (done) => {
					chai.request('http://localhost:4000')
					.get('/api/users/1')
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						expect(res.body.data[0].id).to.equal(1)
						done()
					})
				})
		})
		
    // test ability to edit a user
		describe('POST /users/:id', () => {
				it('should not update user if invalid id is passed in', (done) => {
					chai.request('http://localhost:4000')
					.post('/api/users/someInvalidId')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should not update user if no user exists with specified id', (done) => {
					chai.request('http://localhost:4000')
					.post('/api/users/88888888888')
					.end((err, res) => {
						expect(res.body.error).to.equal(true)
						done()
					})
				})
				it('should update user if valid id is specified', (done) => {
					const firstName = 'testing_from_tests'+Date.now().toString()
					
					chai.request('http://localhost:4000')
					.post('/api/users/1')
					.set('content-type', 'application/x-www-form-urlencoded')
					.send({first_name: firstName})
					.end((err, res) => {
						expect(res.body.error).to.equal(false)
						expect(res.body.data[0].first_name).to.equal(firstName)
						done()
					})
				})
		})
		
})
