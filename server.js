const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/db/db.json'))
);

app.get('/api/notes/:id', (req, res) => {
    let dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(dbNotes[Number(req.params.id)]);
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/404.html'))
);

app.post('/api/notes', (req, res) => {
  let dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let incomingNote = req.body;
  let id = dbNotes.length.toString();
  incomingNote.id = id;
  dbNotes.push(incomingNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(dbNotes));
  res.json(dbNotes);
});

app.delete('/api/notes/:id', (req, res) => {
  let dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  let incomingNoteId = req.params.id;
  let id = 0;
  dbNotes = dbNotes.filter((note) => {
    return note.id != incomingNoteId;
  });

  for(note of dbNotes) {
    note.id = id.toString();
    id++;
  }

  fs.writeFileSync('./db/db.json', JSON.stringify(dbNotes));
  res.json(dbNotes);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);