import PieceType from "../../piece_types/pieceTypes";
import { Color } from "./Game";

export function getInitialPiecePositions(color: Color): PieceType[][] {
  const piecePositions = [
    [
      PieceType.ROOK,
      PieceType.KNIGHT,
      PieceType.BISHOP,
      color === Color.WHITE ? PieceType.QUEEN : PieceType.KING,
      color === Color.WHITE ? PieceType.KING : PieceType.QUEEN,
      PieceType.BISHOP,
      PieceType.KNIGHT,
      PieceType.ROOK,
    ],
    Array(8).fill(PieceType.PAWN),
    Array(8).fill(PieceType.EMPTY_SQUARE),
    Array(8).fill(PieceType.EMPTY_SQUARE),
    Array(8).fill(PieceType.EMPTY_SQUARE),
    Array(8).fill(PieceType.EMPTY_SQUARE),
    Array(8).fill(PieceType.EMPTY_SQUARE),
    Array(8).fill(PieceType.EMPTY_SQUARE),
  ];
  return piecePositions;
}
