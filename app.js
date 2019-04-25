import express from 'express'
// a popular, minimalist framework for node js that is frequently used for building web apps and APIs. Allows developers to write requests with different HTTP verbs at different URL paths. Also, many middleware packages are compatible to solve any number of issues
import cors from 'cors'
// used to enble cors, cross-origin resource sharing. Normally, resources from different domains cannot communicate by default for security reasons, we need cors to allow our server and client to communicate
import shortid from 'shortid'
// npm package utilized for id creation. 

const app = express()
// 'app' is assigned to our express app
app.use(cors())
// uses cors so client/server communicates. Otherwise, errors would be thrown since they are on different domains
app.use(express.json())
// the app will parse json of the request body by default

app.locals.notes = []
// 'locals' is given to us by express, I believe. We use it here as a storage space. We assign a key of notes to locals with a default value of an empty array and it will hold our notes on the server.

// Error handles
const send422 = (response, message) => {
// create 'send422' variable to be called when user input is missing fields
  response.status(422).json(message)
// in this case, a status 422 will be sent, and the desired message will be parsed and displayed
}

const send404 = (response, message) => {
// create 'send404' variable to be called when the requested note is not found
  response.status(404).json('404 error - Note not found')
// in this case, a status 404 will be bent, and a hard-coded message will be displayed
}

// GET api/v1/notes
app.get('/api/v1/notes', (request, response) => {
// calls get method on notes. This gets all notes as no id is specified in url
  const notes = app.locals.notes
// define notes as our storage space in apps.locals for readability
  response.status(200).json( {notes} )
// This get responds with a status of 200 and parses out/displays all notes that have been stored in app.locals.notes
})

// GET api/v1/notes/:id
app.get('/api/v1/notes/:id', (request, response) => {
// calls get method on a specific note, indicated by its id in the url
  const notes = app.locals.notes
// define notes as our storage space in apps.locals for readability
  const note = notes.find(note => note.id == request.params.id)
// Here, we find the requested note by looking through notes in app.locals.notes, and finding the id that matches the one in the request params
  if (!note) return send404(response)
// if note is undefined, meaning no note was found that matched the request params, we return the appropriate error handle
  response.status(200).json( {note} )
// this line is reached if no error is thrown. We return a status 200 and parse/display the requested note
})

// POST api/v1/notes
app.post('/api/v1/notes', (request, response) => {
// calls post on notes. Url is location of all notes as we are addinbg a note to that whole list with this method
  const { title, items } = request.body
// define title and items for readability. We look at these to make sure a user has filled in required info for a post
  if (!title && !items.length) return send422(response, 'Missing title and list')
// first of 3 error checks, if user forgot to fill in anything. We customized methods for each situation, though there are many stategies for this, some perhaps more 'clean'
  if (!title) return send422(response, 'Missing title')
// second error- if user forgot a title. I don't want to display notes as [untitled], so we're just not gonna let that happen
  if (!items.length) return send422(response, 'Missing list')
// third error- if user forgot any list items. Why use this app if you aren't gonna make a checklist, you know?
  const newNote = { 
    id: shortid.generate(),
    title,
    items
  }
// If user input survives the round of error checks, it will reach the code that grabs the info and makes a note object out of it
  app.locals.notes.push(newNote)
// this new note is pushed into the array of stored notes. The note array will never be the same. unless we delete the new note.
  response.status(201).json(newNote)
// with a nice status of 201, and their newNote returned, the user kn ows they added a note successfully, if they are looking for that sorta indication
})

// PUT api/v1/notes/:id
app.put('/api/v1/notes/:id', (request, response) => {
// calls the put method on a particular note. This will be used to ammend notes. Really, take a note and replace it with a new one.
  const { title, items, id } = request.body
// define title, items, and id for readability.
  let note = app.locals.notes.find(note => note.id == id)
// First, lets see if the requested note to change exists at all. We look thru app.locals.notes to pluck out a note that has an id matching the one in the request params.
  if (!note) return send404(response)
// if note is falsey, meaning no note was found, we make a return of an error to end this request.
  if (!title && !items.length) return send422(response, 'Missing title and list')
// We see if the put request has enough info to process. We return an error if both title and items are missing...
  if (!title) return send422(response, 'Missing title')
// if the title is missing...
  if (!items.length) return send422(response, 'Missing list')
// or no list items are created
  let noteIndex = app.locals.notes.indexOf(note)
// since we will be replacing a note, we find where it lives in the array. We will use its index to splice in a new note
  const editedNote = {
    id,
    title,
    items
  }
// if a user supplies the right info, lets make a new note based on the info given. If info is unchanged, the original info will still be there
  app.locals.notes.splice(noteIndex, 1, editedNote)
// Here, we mutate the array by removing the old note, just that note (indicated by the 1), then add in the new note
  response.status(200).json('Your note has been edited')
// Let the user know it worked with a status of 200 and a custom message telling them the note was edited
})

// DELETE api/v1/notes/:id
app.delete('/api/v1/notes/:id', (request, response) => {
// calls delete on a particular note. 
  const noteIndex = app.locals.notes.findIndex(note => note.id == request.params.id)
// We check for the notes existance and find its index in one go, here. We find the index of the note in the app.locals array that matches the request params id
  if (noteIndex === -1) return send404(response)
// if no note is found, findIndex gives us -1. If this is the case, we will return a 404 error
  app.locals.notes.splice(noteIndex, 1)
// if the note was found and we have a valid index, we go to its index and splice out that particular note
  return response.status(204)
// status 204 is returned
})

export default app
// We shouldn't keep this nice code just for ourselves. Send it forth to server.js!