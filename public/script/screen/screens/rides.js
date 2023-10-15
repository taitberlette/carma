// rides.js

import "../../state/state.js"
import { switchScreen } from "../screen.js"

let backButton = null
let homeButton = null

const setupRides = () => {
  return new Promise(async (res, rej) => {

    backButton = document.getElementById("rides-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("rides-home")
    homeButton.addEventListener('click', home)

    res()
  })
}

const back = () => {
  switchScreen('passenger-page')
}

const home = () => {
  switchScreen('account-page')
}

export { setupRides }