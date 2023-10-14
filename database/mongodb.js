// mongodb.js

// import mongodb
import { MongoClient, ServerApiVersion } from 'mongodb'

// get environment variables for connecting to the database and names of the database & collection
const { MONGO_URI: URI, DATABASE_NAME, TRIPS_COLLECTION_NAME, USER_COLLECTION_NAME } = process.env

// create the mongodb client
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// the retrieved application database
let appDatabase = null;

// the retrieved collections
let tripsCollection = null;
let userCollection = null;

// create the initial connection to mongodb
const setupDB = () => {
  return new Promise(async (res, rej) => {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      // get the database and trips collection
      appDatabase = client.db(DATABASE_NAME)
      tripsCollection = appDatabase.collection(TRIPS_COLLECTION_NAME)
      userCollection = appDatabase.collection(USER_COLLECTION_NAME)

      // Send a ping to confirm a successful connection
      await appDatabase.command({ ping: 1 });
      console.log("connected to mongodb 😄");
      res()
    } catch {
      // Ensures that the client will close when an error
      await client.close();
      rej(new Error('failed to connect to mongodb 😭'))
    }
  })
}

const createUser = (document) => {
  return new Promise(async (res, rej) => {
    try {
      const result = await userCollection.insertOne(document);
      if (!result.acknowledged) {
        rej(new Error('failed to insert'));
        return
      }
      res()
    } catch (e) {
      rej(e)
    }
  })
}

const findUser = ({username, id}) => {
  return new Promise(async (res, rej) => {

    console.log(username ? { username } : { id })
    try {
      const result = await userCollection.find(username ? { username } : { id }).toArray();

      if(result.length == 0) {
        res(null)
        return;
      }

      // return the result
      res(result[0])
    } catch (e) {
      rej(e)
    }
  })
}

const updateUser = ({id}, document) => {
  return new Promise(async (res, rej) => {
    try {
      const result = await userCollection.replaceOne({id}, document, {upsert:true});
    } catch (e) {
      rej(e)
    }
  })
}

// export the database
export { setupDB, createUser, findUser, updateUser }