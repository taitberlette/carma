// route.js

// import the express package to create the web server
import express from "express"

// import the path package to help navigate the file system
import path from "path"

// create a new express route
const tokenRouter = express.Router()

// when the router receives a request at the root, send the homepage file
tokenRouter.get('/mapbox', (request, response) => {
  response.json({token: process.env.MAPBOX_API_KEY})
})

// export the router
export { tokenRouter }