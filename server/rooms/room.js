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
