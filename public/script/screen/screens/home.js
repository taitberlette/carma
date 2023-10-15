// home.js

import "../../state/state.js"
import { switchScreen } from "../screen.js"

let element = null
let loginButton = null
let signupButton = null

const setupHome = () => {
  return new Promise(async (res, rej) => {
    element = document.getElementById("home")

    loginButton = document.getElementById("login-button")
    loginButton.addEventListener('click', login)

    signupButton = document.getElementById("signup-button")
    signupButton.addEventListener('click', signup)

    res()
  })
}

const login = () => {
  switchScreen('login-page')
}

const signup = () => {
  switchScreen('signup-page')
}

export { setupHome }