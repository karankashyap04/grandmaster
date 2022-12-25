import { Position } from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import {
  GameState,
  isOccupiedWithMine,
  isOccupiedWithOther,
} from "./GameBoard";

function getOtherPosition(square: Position): Position {
  const otherPosition: Position = {
    row: 7 - square.row,
    col: 7 - square.col,
  };
  return otherPosition;
}

export function getPawnPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  const possibleMoves: Position[] = [];
  if (initialPosition.row < 7) {
    const frontPosition: Position = {
      row: initialPosition.row + 1,
      col: initialPosition.col,
    };
    const leftDiagonal: Position = {
      row: initialPosition.row + 1,
      col: initialPosition.col - 1,
    };
    const rightDiagonal: Position = {
      row: initialPosition.row + 1,
      col: initialPosition.col + 1,
    };
    const otherFrontPosition: Position = getOtherPosition(frontPosition);
    const otherLeftDiagonal: Position = getOtherPosition(leftDiagonal);
    const otherRightDiagonal: Position = getOtherPosition(rightDiagonal);
    if (!isOccupiedWithOther(otherFrontPosition, gameState)) {
      possibleMoves.push(frontPosition);
    }
    if (!isOccupiedWithOther(otherLeftDiagonal, gameState)) {
      possibleMoves.push(leftDiagonal);
    }
    if (!isOccupiedWithOther(otherRightDiagonal, gameState)) {
      possibleMoves.push(rightDiagonal);
    }
  }
  return possibleMoves;
}
