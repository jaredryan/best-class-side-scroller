import React, { useState, useEffect } from "react";
import Game from "./Game";
import Title from "./Title";

import useViewportHeight from "./Components/useViewportHeight";

const App = () => {
  useViewportHeight();
  const [level, setLevel] = useState(1);
  const [page, setPage] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);

  const setPageAsGame = () => setPage("game");

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
        <Game
          setPageAsGame={setPageAsGame}
          setLevel={setLevel}
          level={level}
          setHasPlayed={setHasPlayed}
          hasPlayed={hasPlayed}
        />
      ) : (
        <Title setPageAsGame={setPageAsGame} />
      )}
    </div>
  );
};

export default App;
