import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { Position } from "../../message/message";
import PieceType from "../../piece_types/pieceTypes";
import Board from "../Board";
import { getInitialPiecePositions } from "./initialGameState";
import {
  getAllPossibleOtherPlayerMoves,
  getBishopPossibleMoves,
  getKingPossibleMoves,
  getKnightPossibleMoves,
  getMyKingPosition,
  getPawnPossibleMoves,
  getQueenPossibleMoves,
  getRookPossibleMoves,
  isMoveEnablingCheck,
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

interface GameProps {
  myColor: Color;
  socket: Socket;
  username: string;
}

export default function Game({ myColor, socket, username }: GameProps) {
  const otherColor: Color = myColor === Color.WHITE ? Color.BLACK : Color.WHITE;
  const [gameState, setGameState] = useState<GameState>({
    myPieces: { pieces: getInitialPiecePositions(myColor) },
    otherPieces: { pieces: getInitialPiecePositions(otherColor) },
  });
  return (
    <div>
      <Board
        myColor={myColor}
        gameState={gameState}
        setGameState={setGameState}
        socket={socket}
        username={username}
      />
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

export enum player {
  ME = "ME",
  OTHER = "OTHER",
}

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

function isChecked(gameState: GameState): boolean {
  // determines whether or not you are currently under check
  const myKingPosition: Position = getMyKingPosition(gameState);
  const opponentPossibleMoves: Position[] =
    getAllPossibleOtherPlayerMoves(gameState);
  return opponentPossibleMoves
    .map((position: Position) =>
      JSON.stringify({ row: 7 - position.row, col: 7 - position.col })
    )
    .includes(JSON.stringify(myKingPosition));
}

export function isCheckMated(gameState: GameState): boolean {
  // determines whether or not you have been checkmated (whether or not you have lost)
  if (!isChecked(gameState)) {
    return false;
  }

  let possibleMoves: Position[] = [];
  for (var row: number = 0; row < 8; row++) {
    for (var col: number = 0; col < 8; col++) {
      const pieceType: PieceType = gameState.myPieces.pieces[row][col];
      if (pieceType !== PieceType.EMPTY_SQUARE) {
        const initialPosition: Position = { row: row, col: col };
        let moves: Position[] = getPossibleMoves(
          pieceType,
          initialPosition,
          gameState
        );
        moves = moves.filter(
          (position: Position) =>
            !isMoveEnablingCheck(
              initialPosition,
              position,
              pieceType,
              gameState
            )
        );
        possibleMoves = possibleMoves.concat(moves);
      }
    }
  }

  return possibleMoves.length === 0;
}
