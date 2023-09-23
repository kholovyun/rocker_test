import {MongoClient, ObjectId} from 'mongodb';

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);
const db = client.db('default');

export default {

  // Create
  async create({collectionId, content}) {
    if (!collectionId) return {serverError: 'No collectionId provided'};
    const collection = db.collection(collectionId);
    return collection.insertOne({
      ...(content && {content}),
      created: Date.now()
    });
  },

  // Read
  async read({collectionId, userId}) {
    if (!collectionId) return {serverError: 'No collectionId provided'};
    const collection = db.collection(collectionId);
    if(userId === 'manager'){
      return documentId ? collection.findOne({_id: convertId(documentId)}) : collection.find().toArray();
    }
    if(userId === 'employee'){
      return documentId ? collection.findOne({_id: convertId(documentId)}) : collection.find().toArray();
    }
    if(userId === 'director'){
      return documentId ? collection.findOne({_id: convertId(documentId)}) : collection.find().toArray();
    } 
  },

  // Update
  async update({collectionId, documentId, content}) {
    if (!collectionId) return {serverError: 'No collectionId provided'};
    if (!documentId) return {serverError: 'No documentId provided'};
    const collection = db.collection(collectionId);
    return collection.updateOne({_id: convertId(documentId)}, {$set: {
      ...(content && {content}),
      updated: Date.now()
    }});
  },

  // Delete
  async delete({collectionId, documentId}) {
    if (!collectionId) return {serverError: 'No collectionId provided'};
    if (!documentId) return {serverError: 'No documentId provided'};
    const collection = db.collection(collectionId);
    return collection.deleteOne({_id: convertId(documentId)});
  },
  
  // Roles collection for access
  async createRolesCollection(roles) {
    const rolesCollection = db.collection('roles');
    const collectionExists = await rolesCollection.findOne({});
    if (!collectionExists) {
      await rolesCollection.insertMany(roles, {ordered: false});
      console.log(`Collection "roles" created and role ${roles.role} added.'`);
    } else {
      console.log('Collection "roles" already exists.');
    }
  },
// Get access rights
  async getRolesCollection (role) {
    try {
      const rolesCollection = db.collection('roles');
      return await rolesCollection.findOne({ role: role })
    } catch (error) {
      return error.message
    }  
  },
}


function convertId(id) {
  return new ObjectId(id);
}