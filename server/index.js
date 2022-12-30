const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const {
  addPlayerToGame,
  playerToGame,
  generateGameCode,
} = require("./game/game");
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

  socket.on("CREATE_GAME", (data) => {
    console.log("received create game message");
    const { username, color } = data;
    console.log("username: " + username);
    console.log("color: " + color);
    const gameCode = generateGameCode();
    console.log("game code: " + gameCode);
    socket.join(gameCode);
    addPlayerToGame(username, gameCode);
    addPlayerColor(username, color);
  });

  socket.on("JOIN_GAME", (data) => {
    const { username, opponentUsername } = data;
    if (playerToGame.has(opponentUsername)) {
      const gameCode = playerToGame.get(OpponentUsername);
      socket.join(gameCode);
      addPlayerToGame(username, gameCode);
      if (playerToColor.has(opponentUsername)) {
        const opponentColor = playerToColor.get(opponentUsername);
        const color = opponentColor === "WHITE" ? "BLACK" : "WHITE";
        addPlayerColor(username, color);
      } else {
        // return some error message if this happens (opponent's color should be defined)
      }
      // ensure that there are now 2 players in the game and then do something to start the game
    }
    // return some error message if this happens (no valid opponent)
  });
});

server.listen(9000, () => console.log("server is listening on port 9000"));
