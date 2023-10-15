// signup.js

import { createAccount, loginAccount } from "../../state/state.js"
import { switchScreen } from "../screen.js"

let element = null
let backButton = null
let loginButton = null
let createButton = null
let emailInput = null
let passwordInput = null
let confirmPasswordInput = null

const setupSignup = () => {
  return new Promise(async (res, rej) => {
    element = document.getElementById("signup-page")

    backButton = document.getElementById("backhome-signup")
    backButton.addEventListener('click', home)

    loginButton = document.getElementById("signup-login")
    loginButton.addEventListener('click', login)
    
    createButton = document.getElementById("create-button")
    createButton.addEventListener('click', create)

    emailInput = document.getElementById("email-bar")
    passwordInput = document.getElementById("password-bar2")
    confirmPasswordInput = document.getElementById("password-confirm")

    res()
  })
}

const home = () => {
  switchScreen('home')
}

const login = () => {
  switchScreen('login-page')
}

const create = async () => {
  let username = emailInput.value.trim()
  let password = passwordInput.value.trim()
  let confirm = confirmPasswordInput.value.trim()

  if(!username || !password) {
    alert('No username or password')
    return
  }

  if(password != confirm) {
    alert('Passwords do not match!')
    return
  }

  try {
    await createAccount(username, password)
  } catch(e) {
    alert(e)
    return
  }

  switchScreen("account-page")
}

export { setupSignup }