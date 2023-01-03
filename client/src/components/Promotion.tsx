import React, { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { sendMovePieceMessage } from "../message/message";
import PieceType from "../piece_types/pieceTypes";
import { clickedPosition, lastSelectedPosition } from "./Board";
import { Color, GameState } from "./game/Game";
import Piece from "./piece/Piece";
import "./styles/Promotion.css";

interface PromotionProps {
  color: Color;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  socket: Socket;
  username: string;
  setShowPromotion: Dispatch<SetStateAction<boolean>>;
}

export default function Promotion({
  color,
  gameState,
  setGameState,
  socket,
  username,
  setShowPromotion,
}: PromotionProps) {
  console.log("promotion");
  return (
    <div className="container promotion-container">
      <div className="row piece-row">
        <PromotionPiece
          color={color}
          pieceType={PieceType.QUEEN}
          gameState={gameState}
          setGameState={setGameState}
          socket={socket}
          username={username}
          setShowPromotion={setShowPromotion}
        />
        <PromotionPiece
          color={color}
          pieceType={PieceType.ROOK}
          gameState={gameState}
          setGameState={setGameState}
          socket={socket}
          username={username}
          setShowPromotion={setShowPromotion}
        />
        <PromotionPiece
          color={color}
          pieceType={PieceType.BISHOP}
          gameState={gameState}
          setGameState={setGameState}
          socket={socket}
          username={username}
          setShowPromotion={setShowPromotion}
        />
        <PromotionPiece
          color={color}
          pieceType={PieceType.KNIGHT}
          gameState={gameState}
          setGameState={setGameState}
          socket={socket}
          username={username}
          setShowPromotion={setShowPromotion}
        />
      </div>
    </div>
  );
}

interface PromotionPieceProps {
  color: Color;
  pieceType: PieceType;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  socket: Socket;
  username: string;
  setShowPromotion: Dispatch<SetStateAction<boolean>>;
}

function PromotionPiece({
  color,
  pieceType,
  gameState,
  setGameState,
  socket,
  username,
  setShowPromotion,
}: PromotionPieceProps) {
  return (
    <div
      className="col col-3-lg col-3-md col-6-sm piece-holder"
      onClick={() => {
        handleClick(
          pieceType,
          gameState,
          setGameState,
          socket,
          username,
          setShowPromotion
        );
      }}
    >
      <Piece color={color} pieceType={pieceType} />
    </div>
  );
}

function handleClick(
  pieceType: PieceType,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  socket: Socket,
  username: string,
  setShowPromotion: Dispatch<SetStateAction<boolean>>
) {
  const col: number = clickedPosition.col;
  gameState.myPieces.pieces[7][col] = pieceType;
  setShowPromotion(false);
  setGameState(gameState);
  sendMovePieceMessage(
    socket,
    lastSelectedPosition,
    { row: 7, col: col },
    pieceType,
    username
  );
}
