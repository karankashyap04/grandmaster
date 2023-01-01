import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import {
  MovePieceMessage,
  Position,
  sendMovePieceMessage,
} from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import { Color, GameState, getPossibleMoves, player } from "./game/Game";
import { isMoveEnablingCheck } from "./game/possibleMoves";
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
  const [isTurn, setIsTurn] = useState<boolean>(
    myColor === Color.WHITE ? true : false
  );

  useEffect(() => {
    socket.on("MOVE_PIECE", (data: MovePieceMessage) => {
      console.log("received a move_piece message on the client-side");
      const newGameState: GameState = { ...gameState };
      const oldRow: number = data.initialPosition.row;
      const oldCol: number = data.initialPosition.col;
      const newRow: number = data.finalPosition.row;
      const newCol: number = data.finalPosition.col;
      newGameState.otherPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
      newGameState.myPieces.pieces[7 - newRow][7 - newCol] =
        PieceType.EMPTY_SQUARE; // in case they are killing one of my pieces
      newGameState.otherPieces.pieces[newRow][newCol] = data.pieceType;
      setGameState(newGameState);
      setIsTurn(true);
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
                    if (isTurn) {
                      handleClick(
                        row,
                        col,
                        gameState,
                        setGameState,
                        colorState,
                        setColorState,
                        socket,
                        username,
                        setIsTurn
                      );
                    }
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
  username: string,
  setIsTurn: Dispatch<SetStateAction<boolean>>
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
      console.log("before filter");
      console.log(possibleMoves);

      // filter out moves that open you up to being checked
      possibleMoves = possibleMoves.filter(
        (position: Position) =>
          !isMoveEnablingCheck(
            { row: row, col: col },
            position,
            pieceType,
            gameState
          )
      );
      console.log("after filter");
      console.log(possibleMoves);

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
    gameState.otherPieces.pieces[7 - row][7 - col] = PieceType.EMPTY_SQUARE; // in case one of the other player's pieces is killed
    gameState.myPieces.pieces[row][col] = lastSelectedPiece;
    const oldRow = lastSelectedPosition.row;
    const oldCol = lastSelectedPosition.col;
    gameState.myPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
    setGameState(gameState);
    setColorState(JSON.parse(JSON.stringify(gameState)));
    isPieceSelected = false;
    sendMovePieceMessage(
      socket,
      lastSelectedPosition,
      clickedPosition,
      lastSelectedPiece,
      username
    );
    setIsTurn(false);
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
      username,
      setIsTurn
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
