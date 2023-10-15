// login.js

import { createAccount, loginAccount } from "../../state/state.js"
import { switchScreen } from "../screen.js"
import { refresh } from "./account.js"

let backButton = null
let loginButton = null
let emailInput = null
let passwordInput = null

const setupLogin = () => {
  return new Promise(async (res, rej) => {

    backButton = document.getElementById("backhome-login")
    backButton.addEventListener('click', home)
    
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

  switchScreen("account-page")
  refresh()
}

export { setupLogin }