// user.js (route)

// import the express package to create the web server
import express from "express"

// import the uuid package to generate user ids
import { v4 as uuidv4 } from 'uuid';

// import the database
import { findUser, updateUser, createTrip, findTrip, deleteTrip, updateTrip } from "../database/mongodb.js"

// import the manager
import { convertLocation, findJourney, calculateRoute } from "../manager/manager.js"

// create a new express route
const tripRouter = express.Router()

// create a new user
tripRouter.post('/create', async (request, response) => {
  const { id, journey } = request.body

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  console.log(journey)

  let start = null
  let end = null

  try {
    start = await convertLocation(journey.start)
    end = await convertLocation(journey.end)
  } catch (e) {
    response.status(404).json({msg: `locations not valid`})
    return;
  }

  const trip = {
    id: uuidv4(), 
    start, 
    end, 
    startPlaces: [],
    endPlaces: [],
    vehicle: {
      make: journey.make,
      model: journey.model,
      plate: journey.plate,
      seats: journey.seats, 
    }, 
    riders: [],
    driver: id,
    summary: `${start.text} -> ${end.text}`
  }

  for(let i = 0; i < start.context.length; i++) {
    trip.startPlaces.push(start.context[i].text)
  }
  
  for(let i = 0; i < end.context.length; i++) {
    trip.endPlaces.push(end.context[i].text)
  }

  try {
    await createTrip(trip)
  } catch (e) {
    response.status(422).json({msg: `failed to create trip`})
    return;
  }

  user.trips.driving.push({
    id: trip.id,
    footprint: 0,
    distance: 0,
    text: trip.summary
  })

  try {
    await updateUser(user, user)
  } catch (e) {
    response.status(422).json({msg: `failed to save trip`})
    return;
  }

  response.status(200).json({msg: `success 🥳`, id: trip.id})
})

tripRouter.post('/join', async (request, response) => {
  const { id, tripId, journey } = request.body

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  let trip = null
  
  try {
    trip = await findTrip({ id: tripId })
  } catch (e) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(!trip) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(trip.riders >= trip.seats) {
    response.status(401).json({msg: `trip is full`})
    return;
  }

  let inTrip = false;
  for(let i = 0; i < trip.riders.length; i++) {
    if(trip.riders[i].id == id) {
      inTrip = true;
      break;
    }
  }

  if(inTrip) {
    response.status(401).json({msg: `already joined trip!`})
    return;
  }

  let start = null
  let end = null

  try {
    start = await convertLocation(journey.start)
    end = await convertLocation(journey.end)
  } catch (e) {
    response.status(404).json({msg: `locations not valid`})
    return;
  }

  trip.riders.push({id, start, end})

  try {
    await updateTrip({id: tripId}, trip)
  } catch (e) {
    response.status(422).json({msg: `failed to join trip`})
    return;
  }

  user.trips.joined.push({
    id: tripId,
    footprint: 0,
    distance: 0,
    text: trip.summary
  })
  
  try {
    await updateUser(user, user)
  } catch (e) {
    response.status(422).json({msg: `failed to join trip`})
    return;
  }

  response.status(200).json({msg: `success 🥳`, trip})
})

tripRouter.post('/leave', async (request, response) => {
  const { id, tripId } = request.body

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  let trip = null
  
  try {
    trip = await findTrip({ id: tripId })
  } catch (e) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(!trip) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  let inTrip = false;
  for(let i = 0; i < trip.riders.length; i++) {
    if(trip.riders[i].id == id) {
      inTrip = true;
      break;
    }
  }

  if(!inTrip) {
    response.status(401).json({msg: `already left trip!`})
    return;
  }

  for(let i = 0; i < trip.riders.length; i++) {
    if(trip.riders[i].id == id) {
      trip.riders.splice(i, 1)
      break;
    }
  }

  try {
    await updateTrip({id: tripId}, trip)
  } catch (e) {
    response.status(422).json({msg: `failed to join trip`})
    return;
  }

  for(let i = 0; i < user.trips.joined.length; i++) {
    if(user.trips.joined[i].id == tripId) {
      user.trips.joined.splice(i, 1)
      break;
    }
  }
  
  try {
    await updateUser(user, user)
  } catch (e) {
    response.status(422).json({msg: `failed to join trip`})
    return;
  }

  response.status(200).json({msg: `success 🥳`})
})

tripRouter.post('/find', async (request, response) => {
  const { id, journey } = request.body

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }
  
  let start = null
  let end = null

  try {
    start = await convertLocation(journey.start)
    end = await convertLocation(journey.end)
  } catch (e) {
    response.status(404).json({msg: `locations not valid`})
    return;
  }
  
  let journeys = null

  try {
    journeys = await findJourney({start, end})
  } catch (e) {
    response.status(404).json({msg: `no trip found`})
    return;
  }

  response.status(200).send({msg: `success 🥳`, trips: journeys})
})
  

tripRouter.post('/route', async (request, response) => {
  const { tripId } = request.body
  
  let trip = null
  
  try {
    trip = await findTrip({ id: tripId })
  } catch (e) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(!trip) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  let calculated = await calculateRoute(trip)

  if(calculated.routes.length == 0) {
    response.status(404).json({msg: `failed to find directions`})
    return;
  }

  let selectedRoute = calculated.routes[0]

  let route = {
    distance: selectedRoute.distance,
    time: selectedRoute.duration,
    geo: selectedRoute.geometry,
    steps: []
  }

  for(let i = 0; i < selectedRoute.legs.length; i++) {
    for(let j = 0; j < selectedRoute.legs[i].steps.length; j++) {
      route.steps.push({type: 'direction', text: selectedRoute.legs[i].steps[j].maneuver.instruction, distance: selectedRoute.legs[i].steps[j].distance})
    }
  }

  response.json({msg: `success 🥳`, route})

})


tripRouter.post('/end', async (request, response) => {
  const { id, tripId } = request.body

  let user = null
  
  try {
    user = await findUser({ id })
  } catch (e) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  if(!user) {
    response.status(404).json({msg: `failed to find account`})
    return;
  }

  let trip = null
  
  try {
    trip = await findTrip({ id: tripId })
  } catch (e) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(!trip) {
    response.status(404).json({msg: `failed to find trip`})
    return;
  }

  if(trip.driver != id) {
    response.status(401).json({msg: `you don't have auth to end the trip`})
    return;
  }
  
  let calculated = await calculateRoute(trip)

  console.log('ending trip')

  user.statistics.trips++
  user.statistics.distance += calculated.routes[0].distance
  user.statistics.footprint += user.statistics.distance

  for(let i = 0; i < user.trips.driving.length; i++) {
    if(user.trips.driving[i].id == tripId) {
      user.trips.history.push(...user.trips.driving.splice(i, 1))
    }
  }
  
  try {
    await updateUser(user, user)
  } catch (e) {
    console.error(e)
  }

  for(let i = 0; i < trip.riders.length; i++) {
    let rider = null
  
    try {
      rider = await findUser({ id: trip.riders[i].id })
    } catch (e) {
      continue;
    }
  
    if(!rider) {
      continue;
    }
    
    rider.statistics.trips++
    rider.statistics.distance += calculated.routes[0].distance
    rider.statistics.footprint += rider.statistics.distance
    
    for(let i = 0; i < rider.trips.joined.length; i++) {
      if(rider.trips.joined[i].id == tripId) {
        rider.trips.history.push(...rider.trips.joined.splice(i, 1))
      }
    }
    
    try {
      await updateUser(rider, rider)
    } catch (e) {
      console.error(e)
    }
  }

  deleteTrip(trip)

  response.status(200).send({msg: `success 🥳`})
})

// export the router
export { tripRouter }