// =============================================================
// usePowerBar.js
// Manages the animated slider that moves across the power bar.
// =============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { SLIDER_SPEED_MS } from '../utils/gameConstants';

/**
 * Returns sliderPos (0..1), isRunning, and a stop function.
 * The slider bounces back and forth (ping-pong) for better UX.
 *
 * @param {boolean} active 
 */
export default function usePowerBar(active) {
  const [sliderPos, setSliderPos] = useState(0);
  const animRef     = useRef(null);
  const startRef    = useRef(null);
  const dirRef      = useRef(1);     // 1 = left→right, -1 = right→left
  const posRef      = useRef(0);     // current position mirror

  const stopSlider = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) {
      stopSlider();
      return;
    }

    let lastTime = null;

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000; // seconds
      lastTime = timestamp;

      // speed: full bar per SLIDER_SPEED_MS ms
      const speed = 1 / (SLIDER_SPEED_MS / 1000);
      posRef.current += dirRef.current * speed * delta;

      if (posRef.current >= 1) {
        posRef.current = 1;
        dirRef.current = -1;
      } else if (posRef.current <= 0) {
        posRef.current = 0;
        dirRef.current = 1;
      }

      setSliderPos(posRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => stopSlider();
  }, [active, stopSlider]);

  // Reset when deactivated
  useEffect(() => {
    if (!active) {
      posRef.current = 0;
      dirRef.current = 1;
      setSliderPos(0);
    }
  }, [active]);

  return { sliderPos, stopSlider };
}
