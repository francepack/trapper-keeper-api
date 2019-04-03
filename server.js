const express = require('express');
const shortid = require('shortid');
const app = express();
app.use(express.json())



app.listen('3001', () => {
  console.log('Server is now running at http://localhost:3001');
});

app.locals.notes = [
  {
    id: 1,
    title: 'NoteApp',
    items: ['make backend', 'make front end', 'make pretty']
  }
];

// Get /notes
app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes;
  response.json({ notes });
});

// Post /notes
const send422 = (response, message) => {
  response.status(422).json(message);
};

app.post('/api/v1/notes', (request, response) => {
  const { title, items } = request.body;
  if (!title && !items.length) return send422(response, 'Missing title and list');
  if (!title) return send422(response, 'Missing title');
  if (!items.length) return send422(response, 'Missing list');
  const newNote = { 
    id: shortid.generate(),
    title,
    items
  };
  app.locals.notes.push(newNote);
  response.status(201).json(newNote);
});

// Put/patch /notes/:id
app.put('/api/v1/notes/:id', (request, response) => {
  const { title, items, id } = request.body;
  let note = app.locals.notes.find(note => note.id == id);
  let noteIndex = app.locals.notes.indexOf(note);
  if (!title && !items.length) return send422(response, 'Missing title and list');
  if (!title) return send422(response, 'Missing title');
  if (!items.length) return send422(response, 'Missing list');
  const editedNote = {
    id,
    title,
    items
  };
  app.locals.notes.splice(noteIndex, 1, editedNote);
  response.status(200).json(app.locals.notes);
});

// get notes/:id
app.get('/api/v1/notes/:id', (request, response) => {
  const notes = app.locals.notes;
  const note = notes.find(note => note.id == request.params.id);
  if (!note) return response.sendStatus(404)
  response.status(200).json({ note });
});

// delete notes/:id
app.delete('/api/v1/notes/:id', (request, response) => {
  app.locals.notes = app.locals.notes.filter(note => note.id !== request.params.id)
  response.status(202).json(app.locals.notes)
});
