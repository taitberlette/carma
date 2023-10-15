// state.js

// import the screen manger
import { switchScreen } from "../screen/screen.js"

const states = {
  LOADING: 0,
  HOME: 1,
  LOGIN: 2,
  CREATE: 3
}

let user = null

const setupState = () => {
  return new Promise(async (res, rej) => {
    user = localStorage.getItem("id") || null
    res()
  })
}

const loginAccount = (username, password) => {
  return new Promise(async (res, rej) => {
    const response = await fetch('/api/user/login', {
      method: 'POST', 
      body: JSON.stringify({username, password}),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const json = await response.json()

    if(response.status != 200) {
      rej(json.msg)
      return;
    }

    user = json.id

    localStorage.setItem('id', user)

    res(json.id)
  })
}

const createAccount = (username, password) => {
  return new Promise(async (res, rej) => {
    const response = await fetch('/api/user/create', {
      method: 'POST', 
      body: JSON.stringify({username, password}),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const json = await response.json()

    if(response.status != 200) {
      rej(json.msg)
      return;
    }

    user = json.id

    localStorage.setItem('id', user)

    res(json.id)
  })
}


export { setupState, loginAccount, createAccount }