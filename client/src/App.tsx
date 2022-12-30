import React, { useState, useEffect } from "react";
import Game, { Color } from "./components/game/Game";
import { io, Socket } from "socket.io-client";
import Home from "./components/Home";
import { assignColorMessage, startGameMessage } from "./message/message";

const socket: Socket = io("http://localhost:9000");

function App() {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [color, setColor] = useState<Color>(Color.WHITE);

  useEffect(() => {
    socket.on("ASSIGN_COLOR", (data: assignColorMessage) => {
      console.log("assigning color on client-side");
      setColor(data.color);
    });

    socket.on("START_GAME", (data: startGameMessage) => {
      console.log("starting game on client-side");
      setIsGameStarted(true);
    });
  }, []);

  return (
    <div>
      {isGameStarted ? (
        <Game myColor={color} />
      ) : (
        <Home socket={socket} color={color} setColor={setColor} />
      )}
      {/* <Home />
      <Game myColor={Color.BLACK} /> */}
    </div>
  );
}

export default App;
