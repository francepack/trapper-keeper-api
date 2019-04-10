import express from 'express'
import cors from 'cors'
import shortid from 'shortid'

const app = express()
app.use(cors())
app.use(express.json())

app.locals.notes = []

// Error handles
const send422 = (response, message) => {
  response.status(422).json(message)
}

const send404 = (response, message) => {
  response.status(404).json('404 error - Note not found')
}

// GET api/v1/notes
app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes
  response.status(200).json( {notes} )
})

// GET api/v1/notes/:id
app.get('/api/v1/notes/:id', (request, response) => {
  const notes = app.locals.notes
  const note = notes.find(note => note.id == request.params.id)
  if (!note) return send404(response)
  response.status(200).json( {note} )
})

// POST api/v1/notes
app.post('/api/v1/notes', (request, response) => {
  const { title, items } = request.body
  if (!title && !items.length) return send422(response, 'Missing title and list')
  if (!title) return send422(response, 'Missing title')
  if (!items.length) return send422(response, 'Missing list')
  const newNote = { 
    id: shortid.generate(),
    title,
    items
  }
  app.locals.notes.push(newNote)
  response.status(201).json(newNote)
})

// PUT api/v1/notes/:id
app.put('/api/v1/notes/:id', (request, response) => {
  const { title, items, id } = request.body
  let note = app.locals.notes.find(note => note.id == id)
  if (!note) return send404(response)
  if (!title && !items.length) return send422(response, 'Missing title and list')
  if (!title) return send422(response, 'Missing title')
  if (!items.length) return send422(response, 'Missing list')
  let noteIndex = app.locals.notes.indexOf(note)
  const editedNote = {
    id,
    title,
    items
  }
  app.locals.notes.splice(noteIndex, 1, editedNote)
  response.status(200).json('Your note has been edited')
})

// DELETE api/v1/notes/:id
app.delete('/api/v1/notes/:id', (request, response) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id)
  if (noteIndex === -1) return send404(response)

  app.locals.notes.splice(noteIndex, 1)
  return response.status(204)
})

export default app