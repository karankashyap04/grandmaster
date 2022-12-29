import { Position } from "../../message/message";
import { GameState, isOccupiedWithMine, isOccupiedWithOther } from "./Game";

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
    if (
      !isOccupiedWithOther(otherFrontPosition, gameState) &&
      !isOccupiedWithMine(frontPosition, gameState)
    ) {
      possibleMoves.push(frontPosition);
    }
    if (isOccupiedWithOther(otherLeftDiagonal, gameState)) {
      possibleMoves.push(leftDiagonal);
    }
    if (isOccupiedWithOther(otherRightDiagonal, gameState)) {
      possibleMoves.push(rightDiagonal);
    }
    if (initialPosition.row === 1) {
      const doublePushPosition: Position = {
        row: initialPosition.row + 2,
        col: initialPosition.col,
      };
      if (
        !isOccupiedWithMine(doublePushPosition, gameState) &&
        !isOccupiedWithOther(getOtherPosition(doublePushPosition), gameState)
      ) {
        possibleMoves.push(doublePushPosition);
      }
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
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
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
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
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
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
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
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colCount--;
  }
  return possibleMoves;
}

export function getKingPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];
  // front positions
  for (var i = -1; i <= 1; i++) {
    const position: Position = {
      row: initialPosition.row + 1,
      col: initialPosition.col + i,
    };
    possibleMoves.push(position);
  }
  // left and right
  for (var j = -1; i <= 1; i += 2) {
    const position: Position = {
      row: initialPosition.row,
      col: initialPosition.col + j,
    };
    possibleMoves.push(position);
  }
  // behind positions
  for (var k = -1; i <= 1; i++) {
    const position: Position = {
      row: initialPosition.row - 1,
      col: initialPosition.col + k,
    };
    possibleMoves.push(position);
  }
  possibleMoves = possibleMoves.filter(
    (position: Position) =>
      !isOccupiedWithOther(getOtherPosition(position), gameState)
  );
  return possibleMoves;
}

export function getBishopPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];
  // front right diagonal
  let initialRow: number = initialPosition.row;
  let initialCol: number = initialPosition.col;
  let colShift: number = 1;
  for (var i = initialRow + 1; i <= 7 && initialCol + colShift <= 7; i++) {
    const position: Position = { row: i, col: initialCol + colShift };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colShift++;
  }

  // front left diagonal
  colShift = 1;
  for (i = initialRow + 1; i <= 7 && initialCol - colShift >= 0; i++) {
    const position: Position = { row: i, col: initialCol - colShift };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colShift++;
  }

  // bottom right diagonal
  colShift = 1;
  for (i = initialRow - 1; i >= 0 && initialCol + colShift <= 7; i--) {
    const position: Position = { row: i, col: initialCol + colShift };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colShift++;
  }

  // bottom left diagonal
  colShift = 1;
  for (i = initialRow - 1; i >= 0 && initialCol - colShift >= 0; i--) {
    const position: Position = { row: i, col: initialCol - colShift };
    if (isOccupiedWithMine(position, gameState)) {
      break;
    }
    if (isOccupiedWithOther(getOtherPosition(position), gameState)) {
      possibleMoves.push(position);
      break;
    }
    possibleMoves.push(position);
    colShift++;
  }
  return possibleMoves;
}

export function getQueenPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];
  possibleMoves = possibleMoves.concat(
    getBishopPossibleMoves(initialPosition, gameState)
  );
  possibleMoves = possibleMoves.concat(
    getRookPossibleMoves(initialPosition, gameState)
  );
  return possibleMoves;
}

function makePosition(row: number, col: number): Position {
  const position: Position = {
    row: row,
    col: col,
  };
  return position;
}

export function getKnightPossibleMoves(
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];
  const initialRow: number = initialPosition.row;
  const initialCol: number = initialPosition.col;
  let candidateRowCols: [number, number][] = [
    [initialRow + 2, initialCol - 1],
    [initialRow + 2, initialCol + 1],
    [initialRow - 1, initialCol - 2],
    [initialRow + 1, initialCol - 2],
    [initialRow - 2, initialCol - 1],
    [initialRow - 2, initialCol + 1],
    [initialRow - 1, initialCol + 2],
    [initialRow + 1, initialCol + 2],
  ];
  let candidatePositions: Position[] = candidateRowCols.map(
    (candidateRowCol: [number, number]) =>
      makePosition(candidateRowCol[0], candidateRowCol[1])
  );
  possibleMoves = candidatePositions.filter(
    (position: Position) =>
      position.row >= 0 &&
      position.row <= 7 &&
      position.col >= 0 &&
      position.col <= 7 &&
      !isOccupiedWithMine(position, gameState)
  );
  return possibleMoves;
}
