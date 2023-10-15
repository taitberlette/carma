//app.js

// state manager
import { setupState, getUser } from "./state/state.js"

// ui screen manager
import { setupScreen, switchScreen } from "./screen/screen.js"

// websocket manager
import { setupSocket } from "./websocket/websocket.js";

import { setupHome } from "./screen/screens/home.js"
import { setupSignup } from "./screen/screens/signup.js";
import { setupLogin } from "./screen/screens/login.js"
import { setupMap } from "./screen/screens/map.js"


// start the application
const start = async () => {
  try {
    console.log('starting the application')

    // init the screen manager and screens
    await setupScreen()

    switchScreen("loading")

    // init the state manager
    await setupState()

    await setupHome()
    await setupSignup()
    await setupLogin()

    await setupMap()

    // connect to the websocket server
    await setupSocket()

    switchScreen(getUser() ? "passenger-page" : "home")

    console.log('application setup! 😁')
  } catch (e) {
    console.error('failed to start the application', e)
  }
}

// start the application
start()
