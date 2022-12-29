import React, { useState, Dispatch, SetStateAction } from "react";
import { Position } from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import { Color, GameState, getPossibleMoves } from "./game/Game";
import Piece from "./piece/Piece";
import "./styles/Board.css";

export interface BoardProps {
  myColor: Color;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

export default function Board({
  myColor,
  gameState,
  setGameState,
}: BoardProps) {
  const otherColor: Color = myColor === Color.WHITE ? Color.BLACK : Color.WHITE;
  let rows: number[] = [7, 6, 5, 4, 3, 2, 1, 0];
  let cols: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  const [isPieceSelected, setIsPieceSelected] = useState<boolean>(false);
  const [colorState, setColorState] = useState<GameState>(
    JSON.parse(JSON.stringify(gameState))
  );
  return (
    <table className="chessboard">
      {rows.map((row: number) => {
        return (
          <tr>
            {cols.map((col: number) => {
              let color: string =
                (row + col) % 2 === 0 ? "blackSquare" : "whiteSquare";
              if (
                colorState.myPieces.pieces[row][col] ===
                PieceType.SELECTED_SQUARE
              ) {
                color += " selectedSquare";
              } else if (
                colorState.myPieces.pieces[row][col] ===
                PieceType.POSSIBLE_SQUARE
              ) {
                color += " possibleSquare";
              }
              return (
                <td
                  className={color}
                  onClick={() => {
                    handleClick(
                      row,
                      col,
                      gameState,
                      colorState,
                      setColorState,
                      isPieceSelected,
                      setIsPieceSelected
                    );
                  }}
                >
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

function handleClick(
  row: number,
  col: number,
  gameState: GameState,
  colorState: GameState,
  setColorState: Dispatch<SetStateAction<GameState>>,
  isPieceSelected: boolean,
  setIsPieceSelected: Dispatch<SetStateAction<boolean>>
) {
  if (!isPieceSelected) {
    const pieceType: PieceType = gameState.myPieces.pieces[row][col];
    if (!(pieceType === PieceType.EMPTY_SQUARE)) {
      const newColorState: GameState = { ...colorState };
      newColorState.myPieces.pieces[row][col] = PieceType.SELECTED_SQUARE;
      const possibleMoves: Position[] = getPossibleMoves(
        pieceType,
        { row: row, col: col },
        gameState
      );
      possibleMoves.forEach((position: Position) => {
        newColorState.myPieces.pieces[position.row][position.col] =
          PieceType.POSSIBLE_SQUARE;
      });
      setIsPieceSelected(true);
      setColorState(newColorState);
    }
    return;
  }
  // add code to dictate what happens when a piece has already been selected (move the piece if you can or select a piece if that is more apt, or do neither, based on which square is clicked)
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
