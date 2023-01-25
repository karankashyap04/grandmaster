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
const {
  addFreePlayer,
  removeFreePlayer,
  getAllFreePlayers,
} = require("./opponents/availableOpponents");
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

const playerToSocket = new Map();

io.on("connection", (socket) => {
  console.log(`A new user has connected. Socket id: ${socket.id}`);
  socket.emit("AVAILABLE_OPPONENTS", {
    availableOpponents: getAllFreePlayers(),
  });

  socket.on("CREATE_GAME", (data) => {
    console.log("server received create game message");
    const { username, color } = data;
    if (playerToGame.has(username)) {
      socket.emit("USERNAME_TAKEN", {});
    } else {
      const gameCode = generateGameCode();
      socket.join(gameCode);
      addPlayerToGame(username, gameCode);
      addPlayerColor(username, color);
      addFreePlayer(username);
      socket.broadcast.emit("AVAILABLE_OPPONENTS", {
        availableOpponents: getAllFreePlayers(),
      });
      playerToSocket.set(username, socket);
    }
  });

  socket.on("JOIN_GAME", (data) => {
    console.log("server received join game message");
    const { username, opponentUsername } = data;
    if (playerToGame.has(username)) {
      // need to tell the client to pick a different username
      socket.emit("USERNAME_TAKEN", {});
    } else if (playerToGame.has(opponentUsername)) {
      const gameCode = playerToGame.get(opponentUsername);
      removeFreePlayer(opponentUsername);
      socket.join(gameCode);
      addPlayerToGame(username, gameCode);
      if (playerToColor.has(opponentUsername)) {
        const opponentColor = playerToColor.get(opponentUsername);
        const color = opponentColor === "WHITE" ? "BLACK" : "WHITE";
        addPlayerColor(username, color);
        socket.emit("ASSIGN_COLOR", { color: color });
      } else {
        // return some error message if this happens (opponent's color should be defined)
      }
      // ensure that there are now 2 players in the game and then do something to start the game
      assert(gameToPlayer.get(gameCode).length === 2);
      const startGameMessage = {};
      socket.to(gameCode).emit("START_GAME", startGameMessage);
      socket.emit("START_GAME", startGameMessage);
      socket.broadcast.emit("AVAILABLE_OPPONENTS", {
        availableOpponents: getAllFreePlayers(),
      });
      playerToSocket.set(username, socket);
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

  socket.on("YOU_WIN", (data) => {
    const { username } = data;
    if (playerToGame.has(username)) {
      const gameCode = playerToGame.get(username);
      socket.to(gameCode).emit("YOU_WIN", data); // send the you_win message to the other client in the game
      removePlayersFromServer(socket, username, gameCode);
    } else {
      // return some error message here -- this should never happen
    }
  });
});

function removePlayersFromServer(socket, username, gameCode) {
  socket.leave(gameCode);
  gameToPlayer
    .get(gameCode)
    .splice(gameToPlayer.get(gameCode).indexOf(username), 1);
  const opponentUsername = gameToPlayer.get(gameCode)[0];
  const otherSocket = playerToSocket.get(opponentUsername);
  otherSocket.leave(gameCode);
  gameToPlayer.delete(gameCode);
  playerToSocket.delete(username);
  playerToSocket.delete(opponentUsername);
  playerToColor.delete(username);
  playerToColor.delete(opponentUsername);
  playerToGame.delete(username);
  playerToGame.delete(opponentUsername);
}

server.listen(9000, () => console.log("server is listening on port 9000"));
