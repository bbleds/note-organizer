const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const knex = require('../db/knex')
const { ADMIN_SECRET_KEY } = require('../../config')

chai.use(chaiHttp)

describe('/api/users endpoints', () => {
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
})
