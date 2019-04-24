import express from 'express'
//express is a small framework built on top of the web server functionality provided by Node.js. This way the developer is only responsible for the 'middleware' part of the request flow.
import cors from 'cors'
//Cross Origin Resource Sharing is a protocol that prevents domains from making requests to other domains. It's here for securite reasons. 
import shortid from 'shortid'
// npm package that helps us make random ids. It's better than Date.now() because we can be more certain that each id is unique. 

const app = express() // assigns our express app to the const app. 
app.use(cors()) // config cors. Without it, you will get cors errors if you try to make a request from a react repo hosted at another domain. 
app.use(express.json()) // allows app to parse the request body to json by default (for POST requests)

app.locals.notes = [] // default data

// Error handles
const send422 = (response, message) => {
  response.status(422).json(message)
} //variable for handling missing title and/or item. It gives a 422 status code and parses the passed message. 

const send404 = (response, message) => {
  response.status(404).json('404 error - Note not found')
} //variable for handling a note that's not found. It gives a 404 status code the hardcoded 404 message.

// GET api/v1/notes
app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes
  response.status(200).json( {notes} )
}) // calls the GET http method with the URL as the first param and a callback as the second param to get all notes. It assigns notes to the default app.locals.notes, and returns a response with status code 200 and the notes. 

// GET api/v1/notes/:id
app.get('/api/v1/notes/:id', (request, response) => {
  const notes = app.locals.notes
  const note = notes.find(note => note.id == request.params.id)
  if (!note) return send404(response)
  response.status(200).json( {note} )
}) // calls the GET http method with a URL that points to a particular note by its ID and a callback func to get a particular note. Line 32 finds the correct note by targeting the params property of the request and matching it to the correct note in the app.locals.notes array. If there's no match, it returns the send404 const described on line 19. Otherwise it returns a response with a 200 status code and the found note.  

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
}) // calls the POST HTTP method with the URL as the first param and a callback as the second param to add a new note. It destructures the body property on the request object into title and items variables. If there is no title and no items on the request body, it returns the send422 described on line 15 with the passed message. If there's no title, it returns the send422 described on line 15 with the passed message. If there are no items, it returns the send422 described on line 15 with the passed message. If there is a title and items, it creates a new note object with an id generated by shortid, pushes that new note into the app.locals.notes array, and returns a response with status code 201 and the new note. 

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
}) // calls the PUT HTTP method to update a particular note. It takes the URL specific to that note as the first param and a callback as the second param. It deconstructs the request body into title, items, and id variables. It matches the id to the note.id in app.locals.notes. If the note is not found, it returns the send404 described above. If the request is missing a title and items, it returns the send422 with the correct message. If it's missing a title, it returns a send422 with the correct message. If it's missing items, it returns a send422 with the correct message. If the note is found and the request body has both a title and items, it finds the index of the existing note in app.locals.notes and replacesthe found note with the edited note using the splice method. It returns a response with status code 200 and a message that the note has been updated. 

// DELETE api/v1/notes/:id
app.delete('/api/v1/notes/:id', (request, response) => {
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id)
  if (noteIndex === -1) return send404(response)

  app.locals.notes.splice(noteIndex, 1)
  return response.status(204)
}) // calls the DELETE HTTP method to remove a note. It takes the URL of the note to be removed as a the first param and a callback as the second param. It matches the id of the request.params to the id in app.locals.notes by index. If the request.params.id does not match the ids of any of the notes in app.locals.notes, it returns a send404. If there is a match, it uses the splice method it remove the note from app.locals.notes and returns a respones with status code 204. 

export default app