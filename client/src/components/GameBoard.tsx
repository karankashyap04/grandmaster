import React from "react";
import { MovePieceMessage, Position } from "../message/message";
import PieceType from "../piece_types/pieceTypes";

export enum Color {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export interface UserPiecePositions {
  pieces: PieceType[][];
}
// note: we will have a different orientation of UserPiecePositions for each player; base row for
// each will start at index 0

export interface GameState {
  myPieces: UserPiecePositions;
  otherPieces: UserPiecePositions;
  myColor: Color;
}

export default function GameBoard({ myColor }: { myColor: Color }) {
  return <div>Placeholder text for the GameBoard component!</div>;
}

function getOtherPosition(square: Position): Position {
  const otherPosition: Position = {
    row: 7 - square.row,
    col: 7 - square.col,
  };
  return otherPosition;
}

// HELPER FUNCTIONS:
function isOccupiedWithMine(square: Position, gameState: GameState): boolean {
  const row: number = square.row;
  const col: number = square.col;
  return gameState.myPieces.pieces[row][col] !== PieceType.EMPTY_SQUARE;
}

function isOccupiedWithOther(square: Position, gameState: GameState): boolean {
  const row: number = square.row;
  const col: number = square.col;
  return gameState.otherPieces.pieces[row][col] !== PieceType.EMPTY_SQUARE;
}

function isMoveValid(
  moveMessage: MovePieceMessage,
  gameState: GameState
): boolean {
  const initialRow: number = moveMessage.data.initialPosition.row;
  const initialColumn: number = moveMessage.data.initialPosition.col;
  const initialSquarePiece =
    gameState.myPieces.pieces[initialRow][initialColumn];
  const pieceType: PieceType = moveMessage.data.pieceType;
  if (initialSquarePiece !== pieceType) {
    return false;
  }
  if (isOccupiedWithMine(moveMessage.data.finalPosition, gameState)) {
    return false;
  }

  const initialPosition: Position = moveMessage.data.initialPosition;
  const finalPosition: Position = moveMessage.data.finalPosition;
  const possibleMoves: Position[] = getPossibleMoves(pieceType, initialPosition, gameState);
  return possibleMoves.includes(finalPosition);
}

function getPossibleMoves(
  pieceType: PieceType,
  initialPosition: Position,
  gameState: GameState
): Position[] {
  const possibleMoves: Position[] = [];

  switch (pieceType) {
    case PieceType.EMPTY_SQUARE: {
      break;
    }
    case PieceType.PAWN: {
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
    }
  }

  return possibleMoves;
}
