// ./src/database/ads.js
const {getDatabase} = require('./mongo');
// ... leave the other require statements untouched ...
const {ObjectID} = require('mongodb');

const collectionName = 'ads';

async function insertAd(ad) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(ad);
  return insertedId;
}

async function getAds() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

// ... leave collectionName, insertAd, and getAds untouched ...

async function deleteAd(id) {
    const database = await getDatabase();
    await database.collection(collectionName).deleteOne({
      _id: new ObjectID(id),
    });
  }
  
  async function updateAd(id, ad) {
    const database = await getDatabase();
    delete ad._id;
    await database.collection(collectionName).update(
      { _id: new ObjectID(id), },
      {
        $set: {
          ...ad,
        },
      },
    );
  }  

module.exports = {
  insertAd,
  getAds,
  deleteAd,
  updateAd,
};