// account.js

import { signout } from "../../state/state.js"
import { switchScreen } from "../screen.js"

let logoutButton = null
let refreshButton = null
let newButton = null

const setupAccount = () => {
  return new Promise(async (res, rej) => {

    logoutButton = document.getElementById("account-logout")
    logoutButton.addEventListener('click', logout)

    refreshButton = document.getElementById("account-refresh")
    refreshButton.addEventListener('click', refresh)
    
    newButton = document.getElementById("new-trip")
    newButton.addEventListener('click', create)

    res()
  })
}

const logout = () => {
  signout()
  switchScreen('home')
}

const refresh = () => {
}

const create = () => {
  switchScreen('destination-page')
}

export { setupAccount, refresh }