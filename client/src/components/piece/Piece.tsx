import React from "react";
import { Color } from "../game/Game";
import blackPawn from "../../assets/pieces/blackPawn.svg";
import whitePawn from "../../assets/pieces/whitePawn.svg";
import blackRook from "../../assets/pieces/blackRook.svg";
import whiteRook from "../../assets/pieces/whiteRook.svg";
import blackKnight from "../../assets/pieces/blackKnight.svg";
import whiteKnight from "../../assets/pieces/whiteKnight.svg";
import blackBishop from "../../assets/pieces/blackBishop.svg";
import whiteBishop from "../../assets/pieces/whiteBishop.svg";
import blackKing from "../../assets/pieces/blackKing.svg";
import whiteKing from "../../assets/pieces/whiteKing.svg";
import blackQueen from "../../assets/pieces/blackQueen.svg";
import whiteQueen from "../../assets/pieces/whiteQueen.svg";
import "../styles/Piece.css";
import PieceType from "../../piece_types/pieceTypes";

export interface PieceProps {
  color: Color;
  pieceType: PieceType;
}

export default function Piece({ color, pieceType }: PieceProps) {
  switch (pieceType) {
    case PieceType.PAWN:
      return <Pawn color={color} />;
    case PieceType.ROOK:
      return <Rook color={color} />;
    case PieceType.KNIGHT:
      return <Knight color={color} />;
    case PieceType.BISHOP:
      return <Bishop color={color} />;
    case PieceType.KING:
      return <King color={color} />;
    case PieceType.QUEEN:
      return <Queen color={color} />;
    default: {
      console.log("An unexpected piece was expected to be rendered!");
      console.log(pieceType);
      return <div></div>;
    }
  }
}

export function Pawn({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whitePawn : blackPawn;
  return <img className="piece" src={piece} alt="Pawn" />;
}

export function Rook({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whiteRook : blackRook;
  return <img className="piece" src={piece} alt="Pawn" />;
}

export function Knight({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whiteKnight : blackKnight;
  return <img className="piece" src={piece} alt="Pawn" />;
}

export function Bishop({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whiteBishop : blackBishop;
  return <img className="piece" src={piece} alt="Pawn" />;
}

export function King({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whiteKing : blackKing;
  return <img className="piece" src={piece} alt="Pawn" />;
}

export function Queen({ color }: { color: Color }) {
  const piece: string = color === Color.WHITE ? whiteQueen : blackQueen;
  return <img className="piece" src={piece} alt="Pawn" />;
}
