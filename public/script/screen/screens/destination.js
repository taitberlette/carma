// destination.js

import { getState} from "../../state/state.js"
import { switchScreen } from "../screen.js"

let backButton = null
let homeButton = null
let nextButton = null
let startInput = null
let endInput = null

const setupDestination = () => {
  return new Promise(async (res, rej) => {

    backButton = document.getElementById("destination-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("destination-home")
    homeButton.addEventListener('click', home)
    
    nextButton = document.getElementById("destination-next")
    nextButton.addEventListener('click', next)
    
    startInput = document.getElementById("destination-start")
    endInput = document.getElementById("destination-end")

    res()
  })
}

const back = () => {
  switchScreen('account-page')
}

const home = () => {
  switchScreen('account-page')
}

const next = () => {
  const state = getState()

  state.start = startInput.value
  state.end = endInput.value
  
  switchScreen('passenger-page')
}

export { setupDestination }