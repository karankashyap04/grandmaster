import React from "react";
import PieceType from "../piece_types/pieceTypes";

export interface UserPiecePositions {
    pieces: [PieceType][];
}

export interface GameState {
    myPieces: UserPiecePositions;
    otherPieces: UserPiecePositions;
}

export default function GameBoard() {
  return <div>Placeholder text for the GameBoard component!</div>;
}
