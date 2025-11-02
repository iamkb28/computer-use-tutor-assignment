
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' http://localhost:3001;"
  );
  next();
});

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL
  )`);
});

app.get('/events', (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ events: rows });
  });
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body);
  const { title, date } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Missing title or date' });
  }
  db.run('INSERT INTO events (title, date) VALUES (?, ?)', [title, date], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.put('/events/:id', (req, res) => {
  console.log('Updating event:', req.params.id, req.body);
  const { title, date } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Missing title or date' });
  }
  db.run('UPDATE events SET title = ?, date = ? WHERE id = ?', [title, date, req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.delete('/events/:id', (req, res) => {
  console.log('Deleting event:', req.params.id);
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
