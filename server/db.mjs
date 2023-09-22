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
  async read({collectionId, documentId}) {
    if (!collectionId) return {serverError: 'No collectionId provided'};
    const collection = db.collection(collectionId);
    return documentId ? collection.findOne({_id: convertId(documentId)}) : collection.find().toArray();
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
  }

}

function convertId(id) {
  return new ObjectId(id);
}