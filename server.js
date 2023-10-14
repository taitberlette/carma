// server.js

// import environment variables
import 'dotenv/config'

// import the express package to create the web server
import express from "express";

// import the path package to help navigate the file system
import path from "path"

// import the http package for websocket
import http from "http"

// import the custom router
import { router } from "./routes/route.js"

// import the websocket server
import { setupSocket } from "./websocket/websocket.js"

// import the database
import { setupDB } from "./database/mongodb.js"

// create a new express application
const app = express();

// create a web server from the express application
const server = http.createServer(app);

// read the preferred port from the environment variable, otherwise use http port 80
const PORT = process.env.PORT || 80;

// use the json middleware to read json data from an api request
app.use(express.json());

// use the static middleware to make static files available to requests
app.use(express.static(path.resolve('public')));

// use the router middleware to accept requests at the root
app.use('/', router)

// listen for web requests
const listen = async () => {
  return new Promise((res, rej) => {
    // start the app on the specified port and check for errors
    app.listen(PORT, (error) => {
      if (error) {
        rej('failed to start the server 😭')
        return;
      }
      
      console.log(`server running on port ${PORT} 👍`);
      res()
    });
  })
}

// start the application
const start = async () => {
  try {
    console.log('starting the application')

    // connect to the database
    await setupDB();

    // setup the websocket server
    await setupSocket(server);

    // listen for web requests
    await listen();

    console.log('application running! 😁')
  } catch (e) {
    console.error("failed to start the application", e)
  }
}

start()
