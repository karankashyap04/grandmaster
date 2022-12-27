import React, { useState } from "react";
import { MovePieceMessage, Position } from "../../message/message";
import PieceType from "../../piece_types/pieceTypes";
import Board from "../Board";
import { getInitialPiecePositions } from "./initialGameState";
import { getPawnPossibleMoves, getRookPossibleMoves } from "./possibleMoves";

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

export default function Game({ myColor }: { myColor: Color }) {
  const [gameState, setGameState] = useState<GameState>({
    myPieces: { pieces: getInitialPiecePositions() },
    otherPieces: { pieces: getInitialPiecePositions() },
    myColor: Color.WHITE, // assigning white as default for now; make this dynamic later
  });
  return (
    <div>
      Placeholder text for the GameBoard component!
      <Board myColor={myColor} gameState={gameState} />
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
function getPossibleMoves(
  pieceType: PieceType,
  initialPosition: Position,
  gameState: GameState
): Position[] {
  let possibleMoves: Position[] = [];

  switch (pieceType) {
    case PieceType.EMPTY_SQUARE: {
      break;
    }
    case PieceType.PAWN: {
      possibleMoves = getPawnPossibleMoves(initialPosition, gameState);
      break;
    }
    case PieceType.ROOK: {
      possibleMoves = getRookPossibleMoves(initialPosition, gameState);
      break;
    }
    default: {
      // TODO: Add something here
    }
  }
  return possibleMoves;
}
