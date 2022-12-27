import React from "react";
import { Color, GameState } from "./game/Game";
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
              return <td className={color}></td>;
              // make a Piece component and insert it into the td over here
            })}
          </tr>
        );
      })}
    </table>
  );
}
