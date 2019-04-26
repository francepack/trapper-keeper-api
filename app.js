import express from 'express'; //importing express after having installed
import cors from 'cors'; //adding security, allows cross-domain requests
import shortid from 'shortid'; //how we will generate id's

const app = express(); //creating express app by invoking express
app.use(cors()); //gives app use of cors, allowing cross domain requests
app.use(express.json()); //defaults parsing of request body

app.locals.notes = []; //where we will be adding notes. app.locals comes from express

// Get api/v1/notes
app.get('/api/v1/notes', (request, response) => { //a get request to the path holding all the notes
  const notes = app.locals.notes; //setting our locals store to a variable
  if (!notes) return response.status(400).json('No notes stored in the backend') //error handling if no notes exist
  response.status(200).json( {notes} ); //otherwise, return the notes along with a status code 200
});

// get api/v1/notes/:id
app.get('/api/v1/notes/:id', (request, response) => { //a get request to a specific note, hence /:id at the end of path
  const notes = app.locals.notes; //setting our locals store to notes variable
  const note = notes.find(note => note.id == request.params.id); //array prototype method to find the note that matches our request parameter
  if (!note) return response.status(404).json('Note not found'); //error handling if note w/that id doesnt exist with a 404 status
  response.status(200).json( {note} ); //returning found note with status 200
});

// Post api/v1/notes
const send422 = (response, message) => { //creating a response status variable
  response.status(422).json(message); //this will be an error response with the message argument returned
};

app.post('/api/v1/notes', (request, response) => { //POST method to add a note. uses /notes path
  const { title, items } = request.body; //destructuring the title and id from the requests body
  if (!title && !items.length) return send422(response, 'Missing title and list'); //error handler for missing title and list item using our error variable
  if (!title) return send422(response, 'Missing title'); //error for mssing title
  if (!items.length) return send422(response, 'Missing list'); //error for missign list items in request
  const newNote = { //creating a new note
    id: shortid.generate(), //generating an id using shortid
    title, //passing in the destructured title
    items //passing in the destructured items
  }; //closing bracket
  app.locals.notes.push(newNote); //'pushing' our newly created note into the app.locals store
  response.status(201).json(newNote); //response 201 for successfully created note and returning new note
});

// put api/v1/notes/:id
app.put('/api/v1/notes/:id', (request, response) => { //'PUT' method to edit an existing note, using /:id to specify the note
  const { title, items, id } = request.body; //destructuring title, items, and id from the note
  let note = app.locals.notes.find(note => note.id == id); //finding note using the destructured id
  let noteIndex = app.locals.notes.indexOf(note); // retrieving index of existing note in app.locals.notes store
  if (!title && !items.length) return send422(response, 'Missing title and list'); //error handling for empty title and list in request.body
  if (!title) return send422(response, 'Missing title'); //error handling for missing title in request.body
  if (!items.length) return send422(response, 'Missing list'); //error handling for missing list items in request.body
  const editedNote = { //creating the replacement note
    id, //destructured id
    title, //destructured title
    items //destructured items
  };
  app.locals.notes.splice(noteIndex, 1, editedNote); //replacing existing note with edited note at the specific index in app.locals.notes
  response.status(200).json('Your note has been edited'); //status message 200 for successfully edited note with message
});

// delete api/v1/notes/:id
app.delete('/api/v1/notes/:id', (request, response) => { //'DELETE' method to 'destroy' a note with /:id in path the specify note
  if(!request.params.id) response.status(404).json('Error deleting note'); //if there's a missing id return error
  app.locals.notes = app.locals.notes.filter(note => note.id !== request.params.id); //create new app.locals.notes with deleted note filtered out by id
  response.status(202).json('Your note is gone!'); //status 202 for successful deletion with message
});

export default app; //exporting app