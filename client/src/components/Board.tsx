import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { MovePieceMessage, Position } from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import { Color, GameState, getPossibleMoves } from "./game/Game";
import Piece from "./piece/Piece";
import "./styles/Board.css";

let isPieceSelected: boolean = false;
let possibleMoves: Position[] = [];
let lastSelectedPiece: PieceType = PieceType.EMPTY_SQUARE;
let lastSelectedPosition: Position = { row: 0, col: 0 };

export interface BoardProps {
  myColor: Color;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  socket: Socket;
  username: string;
}

export default function Board({
  myColor,
  gameState,
  setGameState,
  socket,
  username,
}: BoardProps) {
  const otherColor: Color = myColor === Color.WHITE ? Color.BLACK : Color.WHITE;
  let rows: number[] = [7, 6, 5, 4, 3, 2, 1, 0];
  let cols: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  const [colorState, setColorState] = useState<GameState>(
    JSON.parse(JSON.stringify(gameState))
  );

  useEffect(() => {
    socket.on("MOVE_PIECE", (data: MovePieceMessage) => {
      console.log("received a move_piece message on the client-side");
      console.log(data);
      const newGameState: GameState = { ...gameState };
      const oldRow: number = data.initialPosition.row;
      const oldCol: number = data.initialPosition.col;
      const newRow: number = data.finalPosition.row;
      const newCol: number = data.finalPosition.col;
      newGameState.otherPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
      newGameState.myPieces.pieces[7 - newRow][7 - newCol] =
        PieceType.EMPTY_SQUARE; // in case they are killing one of my pieces
      newGameState.otherPieces.pieces[newRow][newCol] = data.pieceType;
      console.log("newGameState");
      console.log(newGameState);
      setGameState(newGameState);
    });
  }, [socket]);

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
                      setGameState,
                      colorState,
                      setColorState,
                      socket,
                      username
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
  setGameState: Dispatch<SetStateAction<GameState>>,
  colorState: GameState,
  setColorState: Dispatch<SetStateAction<GameState>>,
  socket: Socket,
  username: string
) {
  const pieceType: PieceType = gameState.myPieces.pieces[row][col];
  if (!isPieceSelected) {
    if (pieceType !== PieceType.EMPTY_SQUARE) {
      lastSelectedPiece = pieceType;
      lastSelectedPosition = { row: row, col: col };
      const newColorState: GameState = { ...colorState };
      newColorState.myPieces.pieces[row][col] = PieceType.SELECTED_SQUARE;
      possibleMoves = getPossibleMoves(
        pieceType,
        { row: row, col: col },
        gameState
      );
      possibleMoves.forEach((position: Position) => {
        newColorState.myPieces.pieces[position.row][position.col] =
          PieceType.POSSIBLE_SQUARE;
      });
      isPieceSelected = true;
      setColorState(newColorState);
    }
    return;
  }
  const clickedPosition: Position = { row: row, col: col };
  const possibleMoveStrings: string[] = possibleMoves.map(
    (position: Position) => JSON.stringify(position)
  );
  if (possibleMoveStrings.includes(JSON.stringify(clickedPosition))) {
    gameState.myPieces.pieces[row][col] = lastSelectedPiece;
    const oldRow = lastSelectedPosition.row;
    const oldCol = lastSelectedPosition.col;
    gameState.myPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
    setGameState(gameState);
    setColorState(JSON.parse(JSON.stringify(gameState)));
    isPieceSelected = false;
    const movePieceMessage: MovePieceMessage = {
      initialPosition: lastSelectedPosition,
      finalPosition: clickedPosition,
      pieceType: lastSelectedPiece,
      username: username,
    };
    socket.emit("MOVE_PIECE", movePieceMessage);
  } else if (pieceType === PieceType.EMPTY_SQUARE) {
    isPieceSelected = false;
    setColorState(JSON.parse(JSON.stringify(gameState)));
  } else {
    colorState.myPieces = JSON.parse(JSON.stringify(gameState.myPieces));
    isPieceSelected = false;
    handleClick(
      row,
      col,
      gameState,
      setGameState,
      colorState,
      setColorState,
      socket,
      username
    );
  }
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
    return <Piece color={myColor} pieceType={myPieceType} />;
  } else if (myPieceType === PieceType.EMPTY_SQUARE) {
    return <Piece color={otherColor} pieceType={otherPieceType} />;
  }
  console.log("Both players unexpectedly had a piece at the same position!");
  return <div></div>;
}
