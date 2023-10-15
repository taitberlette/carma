//manager.js

// import fetch for web requests
import fetch from "node-fetch"

import { searchTrip } from "../database/mongodb.js"

const { MAPBOX_API_KEY } = process.env

const setupManager = () => {
  return new Promise((res, rej) => {
    console.log('manager setup 🥳')
    res()
  })
}

const convertLocation = (location) => {
  return new Promise(async (res, rej) => {
    console.log(`converting location ${location}`)

    let locationUrl = encodeURI(location);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationUrl}.json?access_token=${MAPBOX_API_KEY}`

    const response = await fetch(url)
    const body = await response.json()

    if(response.status != 200) {
      rej(new Error("failed to find location"))
      return
    }

    res(body.features[0])
  })
}

const findJourney = ({start, end}) => {
  return new Promise(async (res, rej) => {  
    const startPlaces = []
    const endPlaces = []
    
    for(let i = 0; i < start.context.length; i++) {
      startPlaces.push(start.context[i].text)
    }
    
    for(let i = 0; i < end.context.length; i++) {
      endPlaces.push(end.context[i].text)
    }

    let trips = null

    try {
      trips = await searchTrip({startPlaces, endPlaces})
    } catch (e) {
      rej(e)
      return;
    }

    res(trips)
  })
}

const calculateRoute = (trip) => {
  return new Promise(async (res, rej) => {
    let starting = []
    let ending = []

    starting.push(trip.start.geometry.coordinates)

    for(let i = 0; i < trip.riders.length; i++) {
      starting.push(trip.riders[i].start.geometry.coordinates)
      ending.push(trip.riders[i].end.geometry.coordinates)
    }

    ending.push(trip.end.geometry.coordinates)

    let coords = [...starting, ...ending]

    let coordsString = ``

    for(let i = 0; i < coords.length; i++) {
      coordsString += `${coords[i][0]},${coords[i][1]}${i < coords.length - 1 ? ';' : ''}`
    }

    let coordsUrl = encodeURI(coordsString)
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsUrl}?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_API_KEY}`

    const response = await fetch(url)
    const body = await response.json()

    if(response.status != 200) {
      rej(new Error("failed to find location"))
      return
    }

    res(body)
  })
}

// export the manager
export { setupManager, convertLocation, findJourney, calculateRoute }