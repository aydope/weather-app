import { useEffect, useRef } from "react";

const DRAG_THRESHOLD_PX = 4;

// Touch already scrolls natively. This adds click and drag with a mouse, plus a short inertia on release.
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let frame = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(frame);
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      lastTime = e.timeStamp;
      velocity = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("is-dragging");
      }
      el.scrollLeft = startScroll - dx;
      const dt = e.timeStamp - lastTime;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastTime = e.timeStamp;
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (!moved) return;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("is-dragging");
      let step = velocity * 16;
      const glide = () => {
        el.scrollLeft -= step;
        step *= 0.94;
        if (Math.abs(step) > 0.5) frame = requestAnimationFrame(glide);
      };
      frame = requestAnimationFrame(glide);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return ref;
}
