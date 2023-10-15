// screen.js

// an object to hold all the screens
const screens = {}

const setupScreen = async () => {
  return new Promise(async (res, rej) => {
    // add all the screens
    addScreen("loading")
    addScreen("home")
    addScreen("login-page")
    addScreen("signup-page")
    addScreen("driverinfo-page")

    res()
  })
}

const addScreen = (id) => {
  const element = document.getElementById(id)
  screens[id] = element
}

const switchScreen = (id) => {
  for(const screen of Object.values(screens)) {
    screen.style.display = "none"
  }

  if(!screens[id]) {
    console.error(`no screen with name ${id}`)
    return;
  }

  screens[id].style.display = "block"
}

export { setupScreen, switchScreen }