import React from "react";
import Game, { Color } from "./components/Game";

function App() {
  return (
    <div>
      <Game myColor={Color.BLACK} />
    </div>
  );
}

export default App;
