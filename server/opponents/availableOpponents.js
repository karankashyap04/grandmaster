const { playerToGame } = require("../game/game");

// set of all players who are currently free to play
const freePlayers = new Set(); // Set of strings (usernames)

function isPlayerFree(username) {
  return freePlayers.has(username);
}

function addFreePlayer(username) {
  freePlayers.add(username);
}

function removeFreePlayer(username) {
  if (freePlayers.has(username)) {
    freePlayers.delete(username);
    return true;
  }
  return false;
}

function getAllFreePlayers() {
  let allFreePlayers = [];
  freePlayers.forEach((username) => {
    allFreePlayers.push(username);
  });
  return allFreePlayers;
}

module.exports = {
  addFreePlayer,
  removeFreePlayer,
  getAllFreePlayers,
};
