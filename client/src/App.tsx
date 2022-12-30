import React, { useState } from "react";
import Game, { Color } from "./components/game/Game";
import { io, Socket } from "socket.io-client"; // Add this
import Home from "./components/Home";

const socket: Socket = io("http://localhost:9000");

function App() {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  return (
    <div>
      {isGameStarted ? <Game myColor={Color.BLACK} /> : <Home socket={socket} />}
      {/* <Home />
      <Game myColor={Color.BLACK} /> */}
    </div>
  );
}

export default App;
