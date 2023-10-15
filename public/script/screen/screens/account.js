// account.js

import { getUser, signout } from "../../state/state.js"
import { renderMap } from "./map.js"
import { switchScreen } from "../screen.js"

let logoutButton = null
let refreshButton = null
let newButton = null
let drivingTrips = null
let joinedTrips = null

const setupAccount = () => {
  return new Promise(async (res, rej) => {

    logoutButton = document.getElementById("account-logout")
    logoutButton.addEventListener('click', logout)

    refreshButton = document.getElementById("account-refresh")
    refreshButton.addEventListener('click', refresh)
    
    newButton = document.getElementById("new-trip")
    newButton.addEventListener('click', create)

    drivingTrips = document.getElementById("driver")
    joinedTrips = document.getElementById("rider")

    res()
  })
}

const logout = () => {
  signout()
  switchScreen('home')
}

const refresh = async () => {
  const drivingResponse = await fetch(`/api/user/trips/driving?id=${getUser()}`)
  const drivingJson = await drivingResponse.json()
  
  if(drivingResponse.status != 200) {
    alert(drivingJson.msg)
    return;
  }
  
  const drivingChildren = []

  const header = document.createElement("h2")
  header.textContent = `Driving`

  drivingChildren.push(header)

  for(let i = 0; i < drivingJson.trips.length; i++) {
    const div = document.createElement("button")
    div.classList.add("button", "list-button")

    div.addEventListener('click', () => {
      startDrive(drivingJson.trips[i].id)
    })

    const title = document.createElement("h3")
    title.innerText = drivingJson.trips[i].text
    div.appendChild(title)

    drivingChildren.push(div)
  }

  drivingTrips.replaceChildren(...drivingChildren)

  const joinedResponse = await fetch(`/api/user/trips/joined?id=${getUser()}`)
  const joinedJson = await joinedResponse.json()
  
  if(joinedResponse.status != 200) {
    alert(joinedJson.msg)
    return;
  }

  const joinedChildren = []

  const joinedHeader = document.createElement("h2")
  joinedHeader.textContent = `Joined`

  joinedChildren.push(joinedHeader)

  for(let i = 0; i < joinedJson.trips.length; i++) {
    const div = document.createElement("button")
    div.classList.add("button", "list-button")

    div.addEventListener('click', () => {
      startDrive(drivingJson.trips[i].id)
    })

    const title = document.createElement("h3")
    title.innerText = drivingJson.trips[i].text
    div.appendChild(title)

    joinedChildren.push(div)
  }

  joinedTrips.replaceChildren(...joinedChildren)

}

const startDrive = async (id) => {

  switchScreen('loading')

  const response = await fetch('/api/trip/route', {
    method: 'POST', 
    body: JSON.stringify({tripId: id}),
    headers: {
      "Content-Type": "application/json",
    }
  })

  const json = await response.json()

  if(response.status != 200) {
    alert(json.msg)
    switchScreen('account-page')
    return;
  }

  renderMap(json.route)
  
  switchScreen('map')
}

const leave = () => {

}

const create = () => {
  switchScreen('destination-page')
}

export { setupAccount, refresh }