import db from './db.mjs';
import express from 'express';
import path from 'path';
import cors from 'cors';

const accessChecker = (allowedRoles) => {
  return async(req, res, next) => {
      try {
          const {userId, collectionId} = req.query;
          const accessRights = await db.getRolesCollection(userId)

          console.log(allowedRoles.includes(userId))
          console.log(collectionId)
          if (allowedRoles.includes(userId)) {
            if(accessRights.tableAccess.includes(collectionId)){
              console.log("Accepted")
            } else {
              throw new Error("Access denied");
            }
              next();
          } else {
              throw new Error("Access denied");
          }
      } catch (err) {
          const error = err;
          res.json(error.message);
      }
  };
};
// Express Server
const app = express();
const PORT = 3000;
app.use(cors())
const __dirname = path.join(...process.argv[1].split(/\/|\\/).slice(0, -1));

app.use(express.static(path.join(__dirname, '../client')));
app.listen(PORT, () => {
  db.createRolesCollection([
    {_id: Math.random() ,role:"director", tableAccess: ["orders", "payments"]},
    {_id: Math.random() ,role:"manager", tableAccess:["orders", "payments"]},
    {_id: Math.random() ,role:"employee", tableAccess: ["orders"]}])
  console.log(`Express server listening on ${PORT}`);
});

// Routes

// Create
app.post('/create', accessChecker(['director']), async (req, res) => {
  await performAction('create', req, res);
});

// Read
app.post('/read', accessChecker(['director', 'manager', 'employee']), async (req, res) => {
  await performAction('read', req, res);
});

// Update
app.post('/update', accessChecker(['director', 'manager', 'employee']), async (req, res) => {
  await performAction('update', req, res);
});

// Delete
app.post('/delete', accessChecker(['director']), async (req, res) => {
  await performAction('delete', req, res);
});

async function performAction(action, req, res) {
  const {userId, collectionId, documentId, content} = req.query;
  try {
    const result = await db[action]({collectionId, documentId, content, userId});
    res.json(result);
  } catch (e) {
    console.error(e);
    res.json(e);
  }

}

