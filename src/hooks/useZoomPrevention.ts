import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const ZOOM_MSG = "Zoom is disabled for optimal viewing.";
let lastToast = 0;

function showZoomToast() {
  const now = Date.now();
  if (now - lastToast < 3000) return;
  lastToast = now;
  toast({ title: ZOOM_MSG, duration: 2000 });
}

export function useZoomPrevention(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Block Ctrl+scroll, Ctrl+plus/minus/0
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
      ) {
        e.preventDefault();
        showZoomToast();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        showZoomToast();
      }
    };

    // Block pinch-zoom & double-tap zoom on touch devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const onGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("gesturestart", onGestureStart);

    // CSS touch-action to prevent double-tap zoom
    document.documentElement.style.touchAction = "pan-x pan-y";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("gesturestart", onGestureStart);
      document.documentElement.style.touchAction = "";
    };
  }, [enabled]);
}
