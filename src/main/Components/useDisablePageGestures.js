import { useEffect } from "react";

const useDisablePageGestures = () => {
  useEffect(() => {
    // Lock body/html
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlStyle = { touchAction: html.style.touchAction, overscrollBehavior: html.style.overscrollBehavior };
    const prevBodyStyle = { overflow: body.style.overflow, touchAction: body.style.touchAction };

    html.style.touchAction = "none";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    // Block pinch zoom + double-tap zoom
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("dblclick", preventDefault, { passive: false });

    return () => {
      // Restore styles
      html.style.touchAction = prevHtmlStyle.touchAction || "";
      html.style.overscrollBehavior = prevHtmlStyle.overscrollBehavior || "";
      body.style.overflow = prevBodyStyle.overflow || "";
      body.style.touchAction = prevBodyStyle.touchAction || "";

      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("dblclick", preventDefault);
    };
  }, []);
};

export default useDisablePageGestures;
