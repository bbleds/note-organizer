const expect = require('chai').expect
const knex = require('../db/knex')

describe('Database', () => {
    describe('Connection', () => {
        it('should connect successfully', async () => {
						const users = await knex.select().from('users')
						expect(users).to.be.an('array')
						expect(users[0]).to.be.an('object')
        })
    })
})
