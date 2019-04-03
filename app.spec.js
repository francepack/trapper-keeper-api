import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid'

describe('api', () => {
  let notes;
  beforeEach(() => {
    notes = [
      { id: 1, title: 'MockNote1', items: ['a', 'b', 'c'] },
      { id: 2, title: 'MockNote2', items: ['d', 'e', 'f'] },
      { id: 3, title: 'MockNote3', items: ['g', 'h', 'i'] }
    ];
    app.locals.notes = notes;
  });

  describe('get /api/v1/notes', () => {
    it('should return a 200 status and an array of notes', async () => {
      const response = await request(app).get('/api/v1/notes')
      expect(response.status).toBe(200)
      expect(response.body).toEqual( {notes} )
    });

  });

  describe('get /api/v1/notes/:id', () => {
    it('should return a 200 status and a note that matches the request params id', async () => {
      const response = await request(app).get('/api/v1/notes/1')
      const note = { id: 1, title: 'MockNote1', items: ['a', 'b', 'c'] }
      expect(response.status).toBe(200)
      expect(response.body).toEqual( {note} )
    })
    it('should return a 404 status if there is no note that id', async () => {
      const response = await request(app).get('/api/v1/notes/8')
      expect(response.status).toBe(404)
      expect(response.body).toEqual('Note not found')
    })
  });

  describe('post /api/v1/notes', () => {
    it('shoud return a 201 status and a new note', async () => {
      const { notes } = app.locals;
      expect(notes.length).toBe(3);
      shortid.generate = jest.fn().mockImplementation(() => '17')
      const newNote = { title: 'New note', items: ['one', 'two']}
      const response = await request(app).post('/api/v1/notes/')
        .send( newNote )
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: '17',
        ...newNote
      })
      expect(notes.length).toBe(4)
    })

    it('should return a 422 status and correct error message if title or items are missing', async () => {
      const { notes } = app.locals;
      expect(notes.length).toBe(3)
      const response = await request(app).post('/api/v1/notes')
        .send( { title: '', items: [] })
      expect(response.status).toBe(422)
      expect(response.body).toEqual('Missing title and list')
      expect(notes.length).toBe(3)
    })
  });

  describe('put /api/v1/notes/:id', () => {
    it('should return a 200 status and a message that the note has been successfully edited', async () => {
      const { notes } = app.locals;
      expect(notes.length).toBe(3)
      const editedNote = {id: 1, title: 'title', items: ['hello', 'bye']}

      const response = await request(app).put('/api/v1/notes/1')
        .send( editedNote )

      expect(response.status).toBe(200)
      expect(response.body).toEqual('Your note has been edited')
      expect(notes.length).toBe(3)
    })
    
  });

  describe('delete /api/v1/notes/:id', () => {
    it('should delete the correct note and return a 202 message', async () => {
      const { notes } = app.locals;
      expect(notes.length).toBe(3)
      const deleteNote = { id: 3, title: 'MockNote3', items: ['g', 'h', 'i'] }
      const response = await request(app).delete(`/api/v1/notes/${deleteNote.id}`)
      expect(response.status).toBe(202)
      expect(response.body).toEqual('Your note is gone!')
      expect(notes.length).toBe(2)
    })
  });
});