import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import {
  MovePieceMessage,
  Position,
  sendMovePieceMessage,
  sendYouWinMessage,
  YouWinMessage,
} from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import { Color, GameState, getPossibleMoves, isCheckMated } from "./game/Game";
import { isMoveEnablingCheck } from "./game/possibleMoves";
import Piece from "./piece/Piece";
import Promotion from "./Promotion";
import "./styles/Board.css";

let isPieceSelected: boolean = false;
let possibleMoves: Position[] = [];
export let lastSelectedPiece: PieceType = PieceType.EMPTY_SQUARE;
export let lastSelectedPosition: Position = { row: 0, col: 0 };
export let clickedPosition: Position = { row: 0, col: 0 };
let gameOver: boolean = false;
export let leftRookMoved: boolean = false;
export let rightRookMoved: boolean = false;
export let kingMoved: boolean = false;

export function swapKingMoved() {
  kingMoved = !kingMoved;
}

export interface BoardProps {
  myColor: Color;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  socket: Socket;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

export default function Board({
  myColor,
  gameState,
  setGameState,
  socket,
  username,
  setUsername,
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
  const [gameOverText, setGameOverText] = useState<string>("");
  const [showPromotion, setShowPromotion] = useState<boolean>(false);

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

      if (isCheckMated(newGameState)) {
        gameOver = true;
        setGameOverText("You lost: You have been checkmated!");
        sendYouWinMessage(socket, username);
      } else {
        setIsTurn(true);
      }
    });

    socket.on("YOU_WIN", (data: YouWinMessage) => {
      console.log("received a you_win message on the client-side");
      setIsTurn(false);
      gameOver = true;
      setGameOverText("You won: You have checkmated your opponent!");
      setUsername("");
    });
  }, [socket]);

  return (
    <div>
      {gameOver ? <h2 className="game-over-text">{gameOverText}</h2> : null}
      {showPromotion ? (
        <Promotion
          color={myColor}
          gameState={gameState}
          setGameState={setGameState}
          socket={socket}
          username={username}
          setShowPromotion={setShowPromotion}
        />
      ) : null}
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
                          setIsTurn,
                          setShowPromotion
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
    </div>
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
  setIsTurn: Dispatch<SetStateAction<boolean>>,
  setShowPromotion: Dispatch<SetStateAction<boolean>>
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

      possibleMoves.forEach((position: Position) => {
        newColorState.myPieces.pieces[position.row][position.col] =
          PieceType.POSSIBLE_SQUARE;
      });
      isPieceSelected = true;
      setColorState(newColorState);
    }
    return;
  }
  clickedPosition = { row: row, col: col };
  const possibleMoveStrings: string[] = possibleMoves.map(
    (position: Position) => JSON.stringify(position)
  );
  if (possibleMoveStrings.includes(JSON.stringify(clickedPosition))) {
    if (lastSelectedPiece === PieceType.KING && !kingMoved) {
      const kingCol: number = lastSelectedPosition.col;
      if (col - kingCol === 2 && !rightRookMoved) {
        gameState.myPieces.pieces[0][kingCol] = PieceType.EMPTY_SQUARE;
        gameState.myPieces.pieces[0][col] = PieceType.KING;
        gameState.myPieces.pieces[0][7] = PieceType.EMPTY_SQUARE;
        gameState.myPieces.pieces[0][col - 1] = PieceType.ROOK;
        rightRookMoved = true;
        kingMoved = true;
        setGameState(gameState);
        setColorState(JSON.parse(JSON.stringify(gameState)));
        isPieceSelected = false;
        setIsTurn(false);
        sendMovePieceMessage(
          socket,
          lastSelectedPosition,
          clickedPosition,
          lastSelectedPiece,
          username
        );
        sendMovePieceMessage(
          socket,
          { row: 0, col: 7 },
          { row: 0, col: col - 1 },
          PieceType.ROOK,
          username
        );
        return;
      } else if (kingCol - col === 2 && !leftRookMoved) {
        gameState.myPieces.pieces[0][kingCol] = PieceType.EMPTY_SQUARE;
        gameState.myPieces.pieces[0][col] = PieceType.KING;
        gameState.myPieces.pieces[0][col + 1] = PieceType.ROOK;
        gameState.myPieces.pieces[0][0] = PieceType.EMPTY_SQUARE;
        leftRookMoved = true;
        kingMoved = true;
        setGameState(gameState);
        setColorState(JSON.parse(JSON.stringify(gameState)));
        isPieceSelected = false;
        setIsTurn(false);
        sendMovePieceMessage(
          socket,
          lastSelectedPosition,
          clickedPosition,
          lastSelectedPiece,
          username
        );
        sendMovePieceMessage(
          socket,
          { row: 0, col: 0 },
          { row: 0, col: col + 1 },
          PieceType.ROOK,
          username
        );
        return;
      }
    }
    if (lastSelectedPiece === PieceType.PAWN && clickedPosition.row === 7) {
      // pawn promotion needs to take place
      setIsTurn(false);
      gameState.otherPieces.pieces[7 - row][7 - col] = PieceType.EMPTY_SQUARE;
      gameState.myPieces.pieces[row][col] = lastSelectedPiece;
      const oldRow: number = lastSelectedPosition.row;
      const oldCol: number = lastSelectedPosition.col;
      gameState.myPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
      setShowPromotion(true);
      setGameState(gameState);
      setColorState(JSON.parse(JSON.stringify(gameState)));
    } else {
      gameState.otherPieces.pieces[7 - row][7 - col] = PieceType.EMPTY_SQUARE; // in case one of the other player's pieces is killed
      gameState.myPieces.pieces[row][col] = lastSelectedPiece;
      const oldRow: number = lastSelectedPosition.row;
      const oldCol: number = lastSelectedPosition.col;
      gameState.myPieces.pieces[oldRow][oldCol] = PieceType.EMPTY_SQUARE;
      setGameState(gameState);
      setColorState(JSON.parse(JSON.stringify(gameState)));
      isPieceSelected = false;
      if (oldRow === 0 && oldCol === 0) {
        leftRookMoved = true;
      } else if (oldRow === 0 && oldCol === 7) {
        rightRookMoved = true;
      }
      if (lastSelectedPiece === PieceType.KING) {
        kingMoved = true;
      }
      sendMovePieceMessage(
        socket,
        lastSelectedPosition,
        clickedPosition,
        lastSelectedPiece,
        username
      );
      setIsTurn(false);
    }
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
      setIsTurn,
      setShowPromotion
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
