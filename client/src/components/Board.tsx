import React from "react";
import PieceType from "../piece_types/pieceTypes";
import { Color, GameState } from "./game/Game";
import Piece from "./piece/Piece";
import "./styles/Board.css";

export interface BoardProps {
  myColor: Color;
  gameState: GameState;
}

export default function Board({ myColor, gameState }: BoardProps) {
  const otherColor: Color = myColor === Color.WHITE ? Color.BLACK : Color.WHITE;
  let rows: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  let cols: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <table className="chessboard">
      {rows.map((row: number) => {
        return (
          <tr>
            {cols.map((col: number) => {
              const color: string =
                (row + col) % 2 === 0 ? "blackSquare" : "whiteSquare";
              return (
                <td className={color}>
                  {getPieceAtSquare(row, col, myColor, otherColor, gameState)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </table>
  );
}

function getPieceAtSquare(
  row: number,
  col: number,
  myColor: Color,
  otherColor: Color,
  gameState: GameState
) {
  const myPieceType: PieceType = gameState.myPieces.pieces[row][col];
  const otherPieceType: PieceType =
    gameState.otherPieces.pieces[7 - row][7 - col];
  if (
    myPieceType === PieceType.EMPTY_SQUARE &&
    otherPieceType === PieceType.EMPTY_SQUARE
  ) {
    return <div></div>;
  } else if (otherPieceType === PieceType.EMPTY_SQUARE) {
    return <Piece color={otherColor} pieceType={myPieceType} />;
  } else if (myPieceType === PieceType.EMPTY_SQUARE) {
    return <Piece color={myColor} pieceType={otherPieceType} />;
  }
  console.log("Both players unexpectedly had a piece at the same position!");
  return <div></div>;
}
