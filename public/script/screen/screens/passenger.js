// passengers.js

import { getState} from "../../state/state.js"
import { switchScreen } from "../screen.js"

let backButton = null
let homeButton = null
let driverButton = null
let passengerButton = null

const setupPassengers = () => {
  return new Promise(async (res, rej) => {

    backButton = document.getElementById("passenger-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("passenger-home")
    homeButton.addEventListener('click', home)
    
    driverButton = document.getElementById("driver-button")
    driverButton.addEventListener('click', driver)
    
    passengerButton = document.getElementById("passenger-button")
    passengerButton.addEventListener('click', passenger)

    res()
  })
}

const back = () => {
  switchScreen('destination-page')
}

const home = () => {
  switchScreen('account-page')
}

const driver = () => {
  const state = getState()

  state.driver = true
  
  switchScreen('driverinfo-page')
}

const passenger = () => {
  const state = getState()

  state.driver = false
  
  switchScreen('rides-page')
}

export { setupPassengers }