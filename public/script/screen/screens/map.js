// login.js

import { switchScreen } from "../screen.js"

let mapboxgl = window.mapboxgl

let map = null
let loaded = false

let backButton = null
let homeButton = null
let mapSteps = null

const setupMap = () => {
  return new Promise(async (res, rej) => {

  const response = await fetch('/api/token/mapbox');
    const body = await response.json()

    mapboxgl.accessToken = body.token

    map = new mapboxgl.Map({
      container: 'map-bounds', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-79.3832, 43.6532], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    map.on('load', () => {
      loaded = true

      map.resize()

      map.addSource('map', {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [],
                "type": "LineString"
              }
            }
          ]
        }
      })

      map.addLayer({
        'id': 'LineString',
        'type': 'line',
        'source': 'map',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#0B7B60',
          'line-width': 5
        }
      });
    })

    backButton = document.getElementById("map-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("map-home")
    homeButton.addEventListener('click', home)

    mapSteps = document.getElementById("map-steps")

    res()
  })
}

const back = () => {
  switchScreen('account-page')
}

const home = () => {
  switchScreen('account-page')
}

const renderMap = async (data) => {
  console.log(data)
  
  map.resize()

  const geojson = {
    "type": "FeatureCollection",
    "features": [
      {
      "type": "Feature",
      "properties": {},
      "geometry": data.geo
      }
    ]
  }

  map.getSource('map').setData(geojson);

  const coordinates = geojson.features[0].geometry.coordinates;
  
  // Create a 'LngLatBounds' with both corners at the first coordinate.
  const bounds = new mapboxgl.LngLatBounds(
    coordinates[0],
    coordinates[0]
  );
  
  // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
  for (const coord of coordinates) {
    bounds.extend(coord);
  }
  
  map.fitBounds(bounds, {
    padding: 100
  });

  const children = []

  const header = document.createElement("h2")
  header.textContent = `${Math.round(data.distance / 1000)}km`

  children.push(header)

  for(let i = 0; i < data.steps.length; i++) {
    const div = document.createElement("div")

    const title = document.createElement("h3")
    title.innerText = data.steps[i].text
    div.appendChild(title)

    const info = document.createElement("p")
    info.innerText = `${Math.round(data.steps[i].distance / 100) / 10} km`
    div.appendChild(info)

    children.push(div)
  }

  mapSteps.replaceChildren(...children)
}

export { setupMap, renderMap }