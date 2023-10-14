// mongodb.js

// import mongodb
import { MongoClient, ServerApiVersion } from 'mongodb'

// get environment variables for connecting to the database and names of the database & collection
const { MONGO_URI: URI, DATABASE_NAME, TRIPS_COLLECTION_NAME} = process.env

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

// the retrieved collection for trips
let tripsCollection = null;

// create the initial connection to mongodb
const setupDB = async () => {
  return new Promise(async (res, rej) => {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      // get the database and trips collection
      appDatabase = client.db(DATABASE_NAME)
      tripsCollection = appDatabase.collection(TRIPS_COLLECTION_NAME)

      // Send a ping to confirm a successful connection
      await appDatabase.command({ ping: 1 });
      console.log("connected to mongodb 😄");
      res()
    } catch {
      // Ensures that the client will close when an error
      await client.close();
      rej('failed to connect to mongodb 😭')
    }
  })
}

// export the database
export { setupDB }