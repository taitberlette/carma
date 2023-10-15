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
    
    createButton = document.getElementById("create-account")
    createButton.addEventListener('click', create)

    emailInput = document.getElementById("signup-email")
    passwordInput = document.getElementById("signup-password")
    confirmPasswordInput = document.getElementById("signup-password-confirm")

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
  let username = emailInput.value.trim().toLowerCase()
  let password = passwordInput.value.trim().toLowerCase()
  let confirm = confirmPasswordInput.value.trim().toLowerCase()

  if(!username || !password) {
    alert('No password')
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

  alert('account created')

  // switchScreen()
}

export { setupSignup }