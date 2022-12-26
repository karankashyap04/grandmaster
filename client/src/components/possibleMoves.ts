import { Position } from "../message/message";
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

export function getRookPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  const possibleMoves: Position[] = [];
  // checking positions ahead of current
  var rowCount: number = initialPosition.row + 1;
  var colCount: number = initialPosition.col;
  while (rowCount <= 7) {
    const position: Position = { row: rowCount, col: colCount };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(position, gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    rowCount++;
  }

  // checking positions behind current
  rowCount = initialPosition.row - 1;
  while (rowCount >= 0) {
    const position: Position = { row: rowCount, col: colCount };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(position, gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    rowCount--;
  }

  // checking positions to the right of current
  rowCount = initialPosition.row;
  colCount = initialPosition.col + 1;
  while (colCount <= 7) {
    const position: Position = { row: rowCount, col: colCount };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(position, gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colCount++;
  }

  // checking positions to the left of current
  colCount = initialPosition.col - 1;
  while (colCount >= 0) {
    const position: Position = { row: rowCount, col: colCount };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(position, gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colCount--;
  }
  return possibleMoves;
}
