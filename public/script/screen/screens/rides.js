// rides.js

import { getUser, getState} from  "../../state/state.js"
import { switchScreen } from "../screen.js"
import { refresh } from "./account.js"

let backButton = null
let homeButton = null
let trips = null

const setupRides = () => {
  return new Promise(async (res, rej) => {

    backButton = document.getElementById("rides-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("rides-home")
    homeButton.addEventListener('click', home)

    trips = document.getElementById("rides-options")

    res()
  })
}

const back = () => {
  switchScreen('passenger-page')
}

const home = () => {
  switchScreen('account-page')
}

const refreshRides = async () => {
  let state = getState()

  const response = await fetch(`/api/trip/find`, {
    method: 'POST', 
    body: JSON.stringify({
      id: getUser(),
      journey: {
        start: state.start,
        end: state.end
      }
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })

  const json = await response.json()
  
  if(response.status != 200) {
    alert(json.msg)
    return;
  }
  
  const children = []

  const header = document.createElement("h2")
  header.textContent = `Trips near you`

  children.push(header)

  console.log(json)

  for(let i = 0; i < json.trips.length; i++) {
    const div = document.createElement("button")
    div.classList.add("button", "list-button")

    div.addEventListener('click', () => {
      joinTrip(json.trips[i].id)
    })

    const title = document.createElement("h3")
    title.innerText = json.trips[i].summary
    div.appendChild(title)

    children.push(div)
  }

  trips.replaceChildren(...children)
}

const joinTrip = async (id) => {
  const state = getState()

  switchScreen('loading')

 const response = await fetch('/api/trip/join', {
    method: 'POST', 
    body: JSON.stringify({
      id: getUser(),
      tripId: id,
      journey: {
        start: state.start,
        end: state.end
      }
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })

  const json = await response.json()

  if(response.status != 200) {
    alert(json.msg)
  }

  refresh()
  
  switchScreen('account-page')
}

export { setupRides, refreshRides }