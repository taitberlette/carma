// info.js

import { getState} from "../../state/state.js"
import { switchScreen } from "../screen.js"

let element = null
let backButton = null
let homeButton = null
let nextButton = null
let makeInput = null
let modelInput = null
let plateInput = null
let numberInput = null

const setupInfo = () => {
  return new Promise(async (res, rej) => {
    backButton = document.getElementById("driver-info-back")
    backButton.addEventListener('click', back)

    homeButton = document.getElementById("driver-info-home")
    homeButton.addEventListener('click', home)
    
    nextButton = document.getElementById("driver-info-next")
    nextButton.addEventListener('click', next)
    
    makeInput = document.getElementById("carbrand")
    modelInput = document.getElementById("carmodel")
    plateInput = document.getElementById("licenseplate")
    numberInput = document.getElementById("peopleAmtSelc")

    res()
  })
}

const back = () => {
  switchScreen('passenger-page')
}

const home = () => {
  switchScreen('account-page')
}

const next = () => {
  const state = getState()

  if(!makeInput.value.trim() || !modelInput.value.trim() || !plateInput.value.trim() || !numberInput.value.trim()) {
    alert('make sure to fill all fields')
    return
  }

  state.options = {
    make: makeInput.value,
    model: modelInput.value,
    plate: plateInput.value,
    people: numberInput.value
  }
  
  switchScreen('account-page')
}

export { setupInfo }