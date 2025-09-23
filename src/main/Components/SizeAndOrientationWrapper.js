// SizeAndOrientationWrapper.js
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import useViewportHeight from "./useViewportHeight";

const SizeAndOrientationWrapper = forwardRef(
  (
    {
      children,
      onPause,
      onResume,
      horizontalSize,
      verticalSize,
      maxHorizontalSize,
      maxVerticalSize,
    },
    ref
  ) => {
    const wrapperRef = useRef(null);
    const resumeTimeout = useRef(null);
    const prevIsLandscapeRef = useRef(window.innerWidth > window.innerHeight);

    const [scale, setScale] = useState(1);
    const [gameContainerStyleWidth, setGameContainerStyleWidth] = useState({});
    const [isLandscape, setIsLandscape] = useState(
      window.innerWidth > window.innerHeight
    );
    const [isSmall, setIsSmall] = useState(window.innerWidth < 1024);
    const [isTouchDevice] = useState(
      typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );

    const [awaitingStart, setAwaitingStart] = useState(false);

    useViewportHeight();

    const requestFullscreen = () => {
      const el = wrapperRef.current;
      if (
        window.innerWidth <= maxHorizontalSize ||
        window.innerHeight <= maxVerticalSize
      ) {
        if (!el) return;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      }
    };

    const focusDiv = () => {
      wrapperRef?.current?.focus();
    };

    useImperativeHandle(ref, () => ({
      requestFullscreen,
      focusDiv,
    }));

    useEffect(() => {
      focusDiv();
    }, []);

    useEffect(() => {
      const updateScale = () => {
        let scaleWidth =
          Math.min(window.innerWidth, maxHorizontalSize) / horizontalSize;
        let scaleHeight =
          Math.min(window.innerHeight, maxVerticalSize) / verticalSize;

        setScale(Math.min(scaleWidth, scaleHeight));
        setGameContainerStyleWidth({
          width: window.innerWidth < horizontalSize ? `100%` : `100vw`,
        });

        setIsLandscape(window.innerWidth > window.innerHeight);
        setIsSmall(window.innerWidth < 1024);
      };

      updateScale();
      window.addEventListener("resize", updateScale);

      return () => window.removeEventListener("resize", updateScale);
    }, [horizontalSize, verticalSize, maxHorizontalSize, maxVerticalSize]);

    // Pause/resume logic + awaitingStart UI
    useEffect(() => {
      if (!isSmall || !isTouchDevice) return;

      if (!isLandscape) {
        if (resumeTimeout.current) {
          clearTimeout(resumeTimeout.current);
          resumeTimeout.current = null;
        }
        setAwaitingStart(false);
        onPause?.();
        prevIsLandscapeRef.current = false;
        return;
      }

      // Detect portrait → landscape rotation
      const justRotatedToLandscape = prevIsLandscapeRef.current === false;
      if (justRotatedToLandscape) {
        setAwaitingStart(true);
      }

      prevIsLandscapeRef.current = isLandscape;
    }, [isLandscape, isSmall, isTouchDevice, onPause, onResume]);

    if (isSmall && isTouchDevice && !isLandscape) {
      return (
        <div className="sizeAndOrientationWrapper">
          <h3>Please rotate your device to landscape mode.</h3>
        </div>
      );
    }

    if (isSmall && isTouchDevice && isLandscape && awaitingStart) {
      const handleStartClick = () => {
        setAwaitingStart(false);

        if (resumeTimeout.current) {
          clearTimeout(resumeTimeout.current);
          resumeTimeout.current = null;
        }

        // Trigger fullscreen first (user gesture)
        requestFullscreen();
        focusDiv();

        // Keep the 1500ms delay before resuming the game
        resumeTimeout.current = setTimeout(() => {
          onResume?.();
          resumeTimeout.current = null;
        }, 1500);
      };

      return (
        <div className="sizeAndOrientationWrapper">
          <h3>Thanks for rotating!</h3>
          <button onClick={handleStartClick} className="start">
            LET'S PLAY
          </button>
        </div>
      );
    }

    return children({
      scale,
      gameContainerStyleWidth,
      wrapperRef,
    });
  }
);

export default SizeAndOrientationWrapper;
