import { useCallback, useEffect, useRef } from "react";
import { haptic } from "@/lib/haptics";

/**
 * Custom hook for touch interactions with haptic feedback
 */
export function useTouch() {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0]!.clientX,
        y: e.touches[0]!.clientY,
        time: Date.now(),
      };
    }
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = e.changedTouches[0];
    if (!touchEnd) return;

    const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Determine interaction type
    const isTap = deltaX < 10 && deltaY < 10 && deltaTime < 200;
    const isLongPress = deltaX < 10 && deltaY < 10 && deltaTime > 500;
    const isSwipe = deltaX > 50 || deltaY > 50;

    if (isTap) {
      haptic("tap");
    } else if (isLongPress) {
      haptic("medium");
    } else if (isSwipe) {
      haptic("light");
    }

    touchStartRef.current = null;
  }, []);

  return { onTouchStart, onTouchEnd };
}

/**
 * Hook for long press detection
 */
export function useLongPress(callback: () => void, delay = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<EventTarget | null>(null);

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    haptic("medium");
    targetRef.current = e.target as EventTarget;
    timeoutRef.current = setTimeout(() => {
      callback();
      haptic("success");
    }, delay);
  }, [callback, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { onTouchStart: start, onTouchEnd: cancel, onTouchCancel: cancel };
}

/**
 * Hook for swipe detection
 */
export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void, threshold = 50) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0]!.clientX,
      y: e.touches[0]!.clientY,
    };
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = e.changedTouches[0];
    if (!touchEnd) return;
    const deltaX = touchEnd.clientX - touchStartRef.current.x;
    const deltaY = touchEnd.clientY - touchStartRef.current.y;

    // Check if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      haptic("light");
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    touchStartRef.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart, onTouchEnd };
}

/**
 * Ripple effect for touch feedback
 */
export function createRipple(event: React.MouseEvent | React.TouchEvent, color = "rgba(212, 175, 55, 0.3)") {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  
  let clientX: number, clientY: number;
  
  if ("touches" in event) {
    clientX = event.touches[0]!.clientX;
    clientY = event.touches[0]!.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: ${color};
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    width: 100px;
    height: 100px;
    left: ${x - 50}px;
    top: ${y - 50}px;
  `;
  
  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}
