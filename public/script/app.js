//app.js

// ui screen manager
import { setupScreen, switchScreen } from "./screen/screen.js"

// websocket manager
import { setupSocket } from "./websocket/websocket.js";


// start the application
const start = async () => {
  try {
    console.log('starting the application')

    // init the screen manager and screens
    await setupScreen()

    switchScreen("loading")

    // connect to the websocket server
    await setupSocket()

    switchScreen("login-page")

    console.log('application setup! 😁')
  } catch (e) {
    console.error('failed to start the application', e)
  }
}

// start the application
start()