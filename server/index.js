const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const {
  addPlayerToRoom,
  playerToRoom,
  generateRoomCode,
} = require("./rooms/room");
const { playerToColor, addPlayerColor } = require("./color");

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

  socket.on("CREATE_ROOM", (data) => {
    console.log("received create room message");
    const { username, color } = data;
    console.log("username: " + username);
    console.log("color: " + color);
    const room = generateRoomCode();
    console.log("room: " + room);
    socket.join(room);
    addPlayerToRoom(username, room);
    addPlayerColor(username, color);
  });

  socket.on("JOIN_ROOM", (data) => {
    const { username, opponentUsername } = data;
    if (playerToRoom.has(opponentUsername)) {
      const room = playerToRoom.get(OpponentUsername);
      socket.join(room);
      addPlayerToRoom(username, room);
      if (playerToColor.has(opponentUsername)) {
        const opponentColor = playerToColor.get(opponentUsername);
        const color = opponentColor === "WHITE" ? "BLACK" : "WHITE";
        addPlayerColor(username, color);
      } else {
        // return some error message if this happens (opponent's color should be defined)
      }
      // ensure that there are now 2 players in the room and then do something to start the game
    }
    // return some error message if this happens (no valid opponent)
  });
});

server.listen(9000, () => console.log("server is listening on port 9000"));
