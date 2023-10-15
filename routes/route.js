// route.js

// import the express package to create the web server
import express from "express"

// import the path package to help navigate the file system
import path from "path"

// create a new express route
const router = express.Router()

// when the router receives a request at the root, send the homepage file
router.get('/', (request, response) => {
  response.sendFile(path.resolve("./views/index.html"))
})

// export the router
export { router }