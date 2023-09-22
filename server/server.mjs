import db from './db.mjs';
import express from 'express';
import path from 'path';
import cors from 'cors';

// Express Server
const app = express();
const PORT = 3000;
app.use(cors())
const __dirname = path.join(...process.argv[1].split(/\/|\\/).slice(0, -1));

app.use(express.static(path.join(__dirname, '../client')));
app.listen(PORT, () => {
  
  console.log(`Express server listening on ${PORT}`);
});

// Routes

// Create
app.post('/create', async (req, res) => {
  await performAction('create', req, res);
});

// Read
app.post('/read', async (req, res) => {
  await performAction('read', req, res);
});

// Update
app.post('/update', async (req, res) => {
  await performAction('update', req, res);
});

// Delete
app.post('/delete', async (req, res) => {
  await performAction('delete', req, res);
});

async function performAction(action, req, res) {
  const {userId, collectionId, documentId, content} = req.query;
  try {
    const result = await db[action]({collectionId, documentId, content});
    res.json(result);
  } catch (e) {
    console.error(e);
    res.json(e);
  }

}

