import { Socket } from "socket.io-client";
import { Color } from "../components/game/Game";
import PieceType from "../piece_types/pieceTypes";

export enum MessageType {
  MOVE_PIECE = "MOVE_PIECE",
  CHECKMATE_LOST = "CHECKMATE_LOST",
  CHECKMATE_WON = "CHECKMATE_WON",
  // specifying that the two above are specifically for checkmates in case I
  // decide to build a timer -> then there would be separate message types for
  // TIME_LOST and TIME_WON as well.
}

export interface Position {
  row: number;
  col: number;
}

export interface MovePieceMessage {
  type: MessageType.MOVE_PIECE;
  data: {
    initialPosition: Position;
    finalPosition: Position;
    pieceType: PieceType;
  };
}

export interface CheckmateLostMessage {
  type: MessageType.CHECKMATE_LOST;
}

export interface CheckmateWonMessage {
  type: MessageType.CHECKMATE_WON;
}

// NOTE: we might not need the message types enum

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
