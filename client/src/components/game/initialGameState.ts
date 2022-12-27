import PieceType from "../../piece_types/pieceTypes";

export function getInitialPiecePositions(): PieceType[][] {
  const piecePositions = [
    [
      PieceType.ROOK,
      PieceType.KNIGHT,
      PieceType.BISHOP,
      PieceType.KING,
      PieceType.QUEEN,
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
