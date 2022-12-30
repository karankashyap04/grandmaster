import React, { useState } from "react";
import { MovePieceMessage, Position } from "../../message/message";
import PieceType from "../../piece_types/pieceTypes";
import Board from "../Board";
import { getInitialPiecePositions } from "./initialGameState";
import {
  getBishopPossibleMoves,
  getKingPossibleMoves,
  getKnightPossibleMoves,
  getPawnPossibleMoves,
  getQueenPossibleMoves,
  getRookPossibleMoves,
} from "./possibleMoves";

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
}

export default function Game({ myColor }: { myColor: Color }) {
  const otherColor: Color = myColor === Color.WHITE ? Color.BLACK : Color.WHITE;
  const [gameState, setGameState] = useState<GameState>({
    myPieces: { pieces: getInitialPiecePositions(myColor) },
    otherPieces: { pieces: getInitialPiecePositions(otherColor) },
  });
  return (
    <div>
      <Board myColor={myColor} gameState={gameState} setGameState={setGameState} />
    </div>
  );
}

// HELPER FUNCTIONS:
export function isOccupiedWithMine(
  square: Position,
  gameState: GameState
): boolean {
  const row: number = square.row;
  const col: number = square.col;
  return gameState.myPieces.pieces[row][col] !== PieceType.EMPTY_SQUARE;
}

export function isOccupiedWithOther(
  square: Position,
  gameState: GameState
): boolean {
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
  const possibleMoves: Position[] = getPossibleMoves(
    pieceType,
    initialPosition,
    gameState
  );
  return possibleMoves.includes(finalPosition);
}

function isCheckPostition(gameState: GameState) {
  return false;
  // NEED TO ACTUALLY WRITE THIS FUNCTION
}

// NOTE: eventually migrate valid move checking to the server side

// TODO: Need to add something here which will check if making some move would open you up to being
// directly checked (since these moves would no longer be considered valid)
export function getPossibleMoves(
  pieceType: PieceType,
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];

  switch (pieceType) {
    case PieceType.PAWN: {
      possibleMoves = getPawnPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.ROOK: {
      possibleMoves = getRookPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.KNIGHT: {
      possibleMoves = getKnightPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.BISHOP: {
      possibleMoves = getBishopPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.KING: {
      possibleMoves = getKingPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.QUEEN: {
      possibleMoves = getQueenPossibleMoves(initialPosition, gameState);
      break;
    }
    default: {
      break;
    }
  }
  return possibleMoves;
}
