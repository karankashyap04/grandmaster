const playerToColor = new Map();

function addPlayerColor(username, color) {
  playerToColor.set(username, color);
}

module.exports = { playerToColor, addPlayerColor };
