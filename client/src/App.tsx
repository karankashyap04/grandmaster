import React from "react";
import Game, { Color } from "./components/game/Game";
import { io, Socket } from "socket.io-client"; // Add this

const socket: Socket = io("http://localhost:9000");

function App() {
  return (
    <div>
      <Game myColor={Color.BLACK} />
    </div>
  );
}

export default App;
