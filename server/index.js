const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

import { addPlayerToRoom, playerToRoom } from "./rooms/room";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A new user has connected. Socket id: ${socket.id}`);

  socket.on("create_room", (data) => {
    const { username, color } = data;
    const room = "some-unique-string";
    socket.join(room);
    addPlayerToRoom(username, room);
  });

  socket.on("join_room", (data) => {
    const { username, opponentUsername } = data;
    if (playerToRoom.has(username)) {
      const room = playerToRoom.get(username);
      socket.join(room);
      addPlayerToRoom(username, room);
      // ensure that there are now 2 players in the room and then do something to start the game
    }
    // return some error message if this happens (no valid opponent)
  });
});

server.listen(9000, () => console.log("server is listening on port 9000"));
