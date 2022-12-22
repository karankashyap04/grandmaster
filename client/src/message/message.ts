import PieceType from "../piece_types/pieceTypes";

enum MessageType {
  MOVE_PIECE = "MOVE_PIECE",
  CHECKMATE_LOST = "CHECKMATE_LOST",
  CHECKMATE_WON = "CHECKMATE_WON",
  // specifying that the two above are specifically for checkmates in case I
  // decide to build a timer -> then there would be separate message types for
  // TIME_LOST and TIME_WON as well.
}

interface Position {
  row: number;
  column: number;
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
