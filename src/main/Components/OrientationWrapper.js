import React, { useEffect, useState } from "react";

export default function OrientationWrapper({ children, onPause, onResume }) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isSmall, setIsSmall] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      setIsSmall(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSmall) {
      if (!isLandscape) {
        if (onPause) onPause(); // pause game if it rotates back
      } else {
        if (onResume) onResume(); // resume when landscape again
      }
    }
  }, [isLandscape, isSmall, onPause, onResume]);

  if (isSmall && !isLandscape) {
    return (
      <div className="orientationWrapper">
        <p>Please rotate your device to landscape mode to play</p>
      </div>
    );
  }

  return children;
}