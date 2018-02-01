const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const knex = require('../db/knex')
const { ADMIN_SECRET_KEY } = require('../../config')

chai.use(chaiHttp)

describe('/api/notes endpoints', () => {
	
	describe('GET /api/notes', () => {
		it('Should get all notes regardless of user when valid credentials are passed in', done => {
			chai.request('http://localhost:4000')
			.get('/api/notes')
			.set('authorization', ADMIN_SECRET_KEY)
			.end((err, res) => {
				expect(res.body.error).to.equal(false)
				done()
			})
		})
	}

})