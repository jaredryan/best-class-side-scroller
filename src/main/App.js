import React, { useState, useEffect } from "react";
import GameContainer from "./Game/GameContainer";
import Title from "./Title";

import useViewportHeight from "./Components/useViewportHeight";

const App = () => {
  useViewportHeight();
  
  const [page, setPage] = useState("");

  useEffect(() => { window.scrollTo(0, 0) }, [page])

  return (
    <div
      className="titlePage"
      style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="overlay">
        <div className="titleImage" />
      </div>
      {page === "game" ? (
        <GameContainer />
      ) : (
        <Title setPageAsGame={() => setPage('game')} />
      )}
    </div>
  );
};

export default App;
