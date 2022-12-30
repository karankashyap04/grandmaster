const playerToRoom = new Map();
const roomToPlayer = new Map();

function addPlayerToRoom(playerUsername, room) {
  playerToRoom.set(playerUsername, room);
  if (roomToPlayer.has(room)) {
    roomToPlayer.get(room).push(playerUsername);
  } else {
    roomToPlayer.set(room, [playerUsername]);
  }
}

function createRoomCode() {
  return Math.floor(Math.random() * Math.pow(10, 6)).toString();
}

function generateRoomCode() {
  var room = createRoomCode();
  while (roomToPlayer.has(room)) {
    room = createRoomCode();
  }
  return room;
}

module.exports = {
  playerToRoom,
  roomToPlayer,
  addPlayerToRoom,
  generateRoomCode,
};
