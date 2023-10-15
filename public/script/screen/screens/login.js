// login.js

import { createAccount, loginAccount } from "../../state/state.js"
import { switchScreen } from "../screen.js"

let element = null
let backButton = null
let signupButton = null
let loginButton = null
let emailInput = null
let passwordInput = null

const setupLogin = () => {
  return new Promise(async (res, rej) => {
    element = document.getElementById("login-page")

    backButton = document.getElementById("backhome-login")
    backButton.addEventListener('click', home)

    // signupButton = document.getElementById("")
    // signupButton.addEventListener('click', login)
    
    loginButton = document.getElementById("login-account")
    loginButton.addEventListener('click', login)

    emailInput = document.getElementById("username-bar")
    passwordInput = document.getElementById("password-bar1")

    res()
  })
}

const home = () => {
  switchScreen('home')
}

const signup = () => {
  switchScreen('signup-page')
}

const login = async () => {
  let username = emailInput.value.trim()
  let password = passwordInput.value.trim()

  if(!username || !password) {
    alert('No username or password')
    return
  }

  try {
    await loginAccount(username, password)
  } catch(e) {
    alert(e)
    return
  }

  switchScreen("dashboard")
}

export { setupLogin }