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
  const { username, password } = request.body
  
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
    username,
    password, 
    id: uuidv4(), 
    trips: {
      driving: [],
      joined: [],
      history: []
    }, 
    statistics: {
      distance: 0,
      footprint: 0,
      trips: 0
    },
    vehicle: {
      active: false,
      make: "",
      model: "",
      mpg: 0,
      offset: 0
    }
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
  const { username, password } = request.body
  
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

userRouter.get('/trips/:type', async (request, response) => {
  const { id } = request.query
  const { type } = request.params

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `user not found`})
    return;
  }

  if(!user.trips[type]) {
    response.status(404).json({msg: `failed to find trip type`})
    return;
  }

  response.status(200).json({msg: `success 🥳`, trips: user.trips[type]})
})

// export the router
export { userRouter }