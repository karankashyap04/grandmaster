export const playerToColor = new Map();

export function addPlayerColor(username, color) {
  playerToColor.set(username, color);
}
