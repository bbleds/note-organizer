const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const knex = require('../db/knex')
const { ADMIN_SECRET_KEY } = require('../../config')

chai.use(chaiHttp)

describe('/api/notes endpoints', () => {
	
	// create a promise for creating a new user
	const noteCreation = new Promise((resolve, reject) => {
		// create new note
		describe('POST /api/users/:id/notes - New Note Creation', () => {
			it('should not create a new note if invalid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.post('/api/users/1/notes')
				.set('authorization', 'testing')
				.send({'title':'testing', 'description':'test description', 'content':'hello world'})
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not create a new note if required note properties are missing', done => {
				chai.request('http://localhost:4000')
				.post('/api/users/1/notes')
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'title':'testing', 'description':'test description'})
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should create a new note under a user when valid credentials are passed in and required fields are passed in', done => {
				chai.request('http://localhost:4000')
				.post('/api/users/1/notes')
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'title':'testing','content':'hello world'})
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					if(!res.body.error){
						resolve(res.body.data[0].note_id)
					} else {
						reject('Note creation failed')
					}
					done()
				})
			})
		})
	})
	
	noteCreation
	.then((newNoteId) => {
		
		// get all notes
		describe('GET /api/notes - Get All Notes', () => {
			it('should not get notes when invalid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.get('/api/notes')
				.set('authorization', 'testing')
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not get notes when no credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.get('/api/notes')
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should get all notes when valid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.get('/api/notes')
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					done()
				})
			})
		})
		
		// get note
		describe('GET /api/users/:userId/notes/:noteId - Get Single Note', () => {
			it('should not retrieve a single note when invalid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.get(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', 'testing')
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should retrieve a single note when valid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.get(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					expect(res.body.data.length).to.equal(1)
					done()
				})
			})
		})
		
		// edit note
		describe('POST /api/users/:id/notes/noteId - Edit Note', () => {
			it('should not edit a note when invalid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.post(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', 'testing')
				.send({'title':'testing title','content':'my content', 'description':'my test desc'})
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not edit a note when no properties are specified', done => {
				chai.request('http://localhost:4000')
				.post(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not edit a note when invalid user and note ids are specified', done => {
				chai.request('http://localhost:4000')
				.post(`/api/users/99999999999999/notes/999999999999999999`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should edit a note when valid credentials and note properties are passed in', done => {
				chai.request('http://localhost:4000')
				.post(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'title':'testing title','content':'my content', 'description':'my test desc'})
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					done()
				})
			})
			it('should edit a note when valid credentials and at least one note property are passed in', done => {
				chai.request('http://localhost:4000')
				.post(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.send({'title':'testing title final'})
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					done()
				})
			})
		})
		
		// delete note
		describe('DELETE /api/users/:userId/notes/:noteId - Delete Single Note', () => {
			it('should not delete a note when invalid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.delete(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', 'testing')
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should not delete a note when the note does not exist on a particular user', done => {
				chai.request('http://localhost:4000')
				.delete(`/api/users/999999999999999999/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should return an error when the note id does not exist', done => {
				chai.request('http://localhost:4000')
				.delete(`/api/users/1/notes/999999999999999999999999999999999999`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(true)
					done()
				})
			})
			it('should delete a note when valid credentials are passed in', done => {
				chai.request('http://localhost:4000')
				.delete(`/api/users/1/notes/${newNoteId}`)
				.set('authorization', ADMIN_SECRET_KEY)
				.end((err, res) => {
					expect(res.body.error).to.equal(false)
					done()
				})
			})
		})
		
	})
	.catch((err) => {
		describe('Error: failed note creation', () => {
			it('should fail because we could not create a note. Check note creation endpoint.', () => {
				expect(1).to.equal(0)
			})
		})
	})
})