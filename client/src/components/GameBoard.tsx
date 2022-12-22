import React from "react";
import { MovePieceMessage, Position } from "../message/message";
import PieceType from "../piece_types/pieceTypes";

export interface UserPiecePositions {
    pieces: PieceType[][];
}

export interface GameState {
    myPieces: UserPiecePositions;
    otherPieces: UserPiecePositions;
}

export default function GameBoard() {
  return <div>Placeholder text for the GameBoard component!</div>;
}

function isMoveValid(moveMessage: MovePieceMessage, gameState: GameState): boolean {
  const initialRow: number = moveMessage.data.initialPosition.row;
  const initialColumn: number = moveMessage.data.initialPosition.col;
  const initialSquarePiece = gameState.myPieces.pieces[initialRow][initialColumn];
  const pieceType: PieceType = moveMessage.data.pieceType;
  if (initialSquarePiece !== pieceType) {
    return false;
  }

  const finalRow: number = moveMessage.data.finalPosition.row;
  const finalColumn: number = moveMessage.data.finalPosition.col;
  const finalSquarePiece = gameState.myPieces.pieces[finalRow][finalColumn];
  if (finalSquarePiece !== PieceType.EMPTY_SQUARE) {
    return false; // you already have a piece at the final position
  }


}

function getPossibleMoves(pieceType: PieceType, initialPosition: Position, gameState: GameState): Position[] {
  const possibleMoves: Position[] = [];

  switch(pieceType) {
    case PieceType.EMPTY_SQUARE: {
      break;
    }
    case PieceType.PAWN: {
      if (initialPosition.row < 7) {
        const frontPosition: Position = {row: initialPosition.row + 1, col: initialPosition.col};
        possibleMoves.push()
      }
      // needs to be completed!
    }
  }

  return possibleMoves;
}