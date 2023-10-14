// websocket.js (client)

// import socket.io to connect to the webserver
import { io } from "socket.io-client";

// the connected socket
let socket = null;

// setup the socket connection
const setupSocket = async () => {
  return new Promise(async (res, rej) => {

    // create the server
    socket = io()

    // when the socket is connected
    socket.on("connect", () => {
      console.log('connected to the carma server 👍')
      res()
    })
  })
}

// export websocket
export { setupSocket }