const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const {
  addPlayerToGame,
  playerToGame,
  gameToPlayer,
  generateGameCode,
} = require("./game/game");
const { playerToColor, addPlayerColor } = require("./color");
const assert = require("assert");

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
    console.log("server received create game message");
    const { username, color } = data;
    const gameCode = generateGameCode();
    socket.join(gameCode);
    addPlayerToGame(username, gameCode);
    addPlayerColor(username, color);
  });

  socket.on("JOIN_GAME", (data) => {
    console.log("server received join game message");
    const { username, opponentUsername } = data;
    console.log("username: " + username);
    console.log("opponentUsername: " + opponentUsername);
    if (playerToGame.has(opponentUsername)) {
      const gameCode = playerToGame.get(opponentUsername);
      socket.join(gameCode);
      addPlayerToGame(username, gameCode);
      if (playerToColor.has(opponentUsername)) {
        const opponentColor = playerToColor.get(opponentUsername);
        const color = opponentColor === "WHITE" ? "BLACK" : "WHITE";
        console.log("color: " + color);
        addPlayerColor(username, color);
        socket.emit("ASSIGN_COLOR", { color: color });
      } else {
        // return some error message if this happens (opponent's color should be defined)
      }
      // ensure that there are now 2 players in the game and then do something to start the game
      console.log(
        "number of players in game: " + gameToPlayer.get(gameCode).length
      );
      assert(gameToPlayer.get(gameCode).length === 2);
      const startGameMessage = {};
      socket.to(gameCode).emit("START_GAME", startGameMessage);
      socket.emit("START_GAME", startGameMessage);
    }
    // return some error message if this happens (no valid opponent)
  });

  socket.on("MOVE_PIECE", (data) => {
    console.log("server received move piece message");
    const { initialPosition, finalPosition, pieceType, username } = data;
    if (playerToGame.has(username)) {
      const gameCode = playerToGame.get(username);
      socket.to(gameCode).emit("MOVE_PIECE", data); // send the move_piece message to the other client in the game
    } else {
      // return some error message here -- this should never happen
    }
  });
});

server.listen(9000, () => console.log("server is listening on port 9000"));
