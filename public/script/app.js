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
import { setupDestination } from "./screen/screens/destination.js"
import { setupInfo } from "./screen/screens/info.js"
import { setupAccount, refresh } from "./screen/screens/account.js";
import { setupPassengers } from "./screen/screens/passenger.js";
import { setupRides } from "./screen/screens/rides.js"


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
    await setupDestination()
    await setupInfo()
    await setupAccount()
    await setupPassengers()
    await setupRides()

    // connect to the websocket server
    await setupSocket()

    switchScreen(getUser() ? "account-page" : "home")

    if(getUser()) {
      refresh()
    }
    

    // switchScreen("driverinfo-page")

    console.log('application setup! 😁')
  } catch (e) {
    console.error('failed to start the application', e)
  }
}

// start the application
start()
