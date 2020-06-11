require ('../conection')
const Usr = require('../models/user/users');

const collectionName = 'ads';

async function insertAd(ad) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(ad);
  return insertedId;
}

//app.get()
async function getAds() {
  const getUsers = await Usr.find();
  console.log(getUsers);
  return getUsers;
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