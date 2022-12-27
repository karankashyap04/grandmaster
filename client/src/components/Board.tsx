import React from "react";
import "./styles/Board.css";

export default function Board() {
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
            })}
          </tr>
        );
      })}
    </table>
  );
}
