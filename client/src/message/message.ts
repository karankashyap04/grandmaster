import { Socket } from "socket.io-client";
import { Color } from "../components/game/Game";
import PieceType from "../piece_types/pieceTypes";

export interface Position {
  row: number;
  col: number;
}

// export interface MovePieceMessage {
//   type: MessageType.MOVE_PIECE;
//   data: {
//     initialPosition: Position;
//     finalPosition: Position;
//     pieceType: PieceType;
//   };
// }
export interface MovePieceMessage {
  initialPosition: Position;
  finalPosition: Position;
  pieceType: PieceType;
  username: string;
}

export function sendMovePieceMessage(
  socket: Socket,
  initialPosition: Position,
  finalPosition: Position,
  pieceType: PieceType,
  username: string
) {
  const message: MovePieceMessage = {
    initialPosition: initialPosition,
    finalPosition: finalPosition,
    pieceType: pieceType,
    username: username,
  };
  socket.emit("MOVE_PIECE", message);
}

export interface CreateGameMessage {
  username: string;
  color: Color;
}

export function sendCreateGameMessage(
  socket: Socket,
  username: string,
  color: Color
) {
  const message: CreateGameMessage = { username: username, color: color };
  socket.emit("CREATE_GAME", message);
}

export interface JoinGameMessage {
  username: string;
  opponentUsername: string;
}

export function sendJoinGameMessage(
  socket: Socket,
  username: string,
  opponentUsername: string
) {
  const message: JoinGameMessage = {
    username: username,
    opponentUsername: opponentUsername,
  };
  socket.emit("JOIN_GAME", message);
}

export interface assignColorMessage {
  color: Color;
}

export interface startGameMessage {}

export interface YouWinMessage {
  username: string;
  // this message is sent to the other player to tell them that they have won
  // (NOTE: the username is of this player; not the player who has won)
}

export function sendYouWinMessage(socket: Socket, username: string) {
  const message: YouWinMessage = { username: username };
  socket.emit("YOU_WIN", message);
}
