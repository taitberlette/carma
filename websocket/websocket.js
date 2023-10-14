//websocket.js

// import socket.io to manage websocket
import { Server } from "socket.io"

// the websocket server
let io = null;

// setup the websocket server
const setupSocket = async (server) => {
  return new Promise(async (res, rej) => {
    // create the websocket server
    io = new Server(server)

    // add event handlers
    io.on('connection', handleConnection)

    console.log('created websocket server 😀')
    res()
  })
}

// when a new user connects to the server
const handleConnection = async (socket) => {
  console.log('a new user connected to the server')
}

// export the websocket
export { setupSocket }