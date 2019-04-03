import express from 'express';
import cors from 'cors';
import shortid from 'shortid';

const app = express();
app.use(cors());
app.use(express.json());

app.locals.notes = [
  {
    id: 1,
    title: 'NoteApp',
    items: ['make backend', 'make front end', 'make pretty']
  }
];

// Get api/v1/notes
app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes;
  response.status(200).json( {notes} );
});

// get api/v1/notes/:id
app.get('/api/v1/notes/:id', (request, response) => {
  const notes = app.locals.notes;
  const note = notes.find(note => note.id == request.params.id);
  if (!note) return response.status(404).json('Note not found');
  response.status(200).json( {note} );
});

// Post api/v1/notes
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

// put api/v1/notes/:id
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
  response.status(200).json('Your note has been edited');
});

// delete api/v1/notes/:id
app.delete('/api/v1/notes/:id', (request, response) => {
  app.locals.notes = app.locals.notes.filter(note => note.id !== request.params.id);
  response.status(202).json('Your note is gone!');
});

export default app;