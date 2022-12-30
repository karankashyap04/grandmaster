export const playerToRoom = new Map();
export const roomToPlayer = new Map();

export function addPlayerToRoom(playerUsername, room) {
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

export function generateRoomCode() {
  var room = createRoomCode();
  while (roomToPlayer.has(room)) {
    room = createRoomCode();
  }
  return room;
}
