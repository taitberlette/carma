// user.js (route)

// import the express package to create the web server
import express from "express"

// import the uuid package to generate user ids
import { v4 as uuidv4 } from 'uuid';

// import the database
import { createUser, findUser } from "../database/mongodb.js"

// create a new express route
const userRouter = express.Router()

// create a new user
userRouter.post('/create', async (request, response) => {
  const { username, password } = request.query
  
  try {
    let user = await findUser({ username })
    if(!!user) {
      response.status(422).json({msg: `user already exists`})
      return;
    }
  } catch (e) {
    response.status(422).json({msg: `failed to create account`})
    return;
  }

  const user = {
    username, password, id: uuidv4() 
  }

  try {
    await createUser(user)
  } catch (e) {
    response.status(422).json({msg: `failed to create account`})
    return;
  }

  response.status(200).json({msg: `success 🥳`, id: user.id})
})

// login
userRouter.post('/login', async (request, response) => {
  const { username, password } = request.query
  
  let user = null
  
  try {
    user = await findUser({ username })
  } catch (e) {
    response.status(401).json({msg: `failed to login account`})
    return;
  }

  if(!user) {
    response.status(401).json({msg: `user not found`})
    return;
  }

  if(user.password != password) {
    response.status(401).json({msg: `user not found`})
    return;
  }

  response.status(200).json({msg: `success 🥳`, id: user.id})
})

// export the router
export { userRouter }