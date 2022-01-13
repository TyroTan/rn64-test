import React, { useEffect } from "react";

const useWalkthroughOverlay = (onMeasureInWindow: any, refObj: any) => {
  useEffect(() => {
    setTimeout(() => {
      if (!onMeasureInWindow) return;
      (refObj?.current as any)?.measureInWindow((...props: any) => {
        const [left, top, width, height] = props;
        onMeasureInWindow?.({
          position: "absolute",
          top,
          left,
          height,
          width,
        });
      });
    }, 100);
  }, [refObj]);
};

export default useWalkthroughOverlay;
