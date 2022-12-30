const playerToGame = new Map();
const gameToPlayer = new Map();

function addPlayerToGame(playerUsername, room) {
  playerToGame.set(playerUsername, room);
  if (gameToPlayer.has(room)) {
    gameToPlayer.get(room).push(playerUsername);
  } else {
    gameToPlayer.set(room, [playerUsername]);
  }
}

function createGameCode() {
  return Math.floor(Math.random() * Math.pow(10, 6)).toString();
}

function generateGameCode() {
  var gameCode = createGameCode();
  while (gameToPlayer.has(gameCode)) {
    gameCode = createGameCode();
  }
  return gameCode;
}

module.exports = {
  playerToGame,
  gameToPlayer,
  addPlayerToGame,
  generateGameCode,
};
