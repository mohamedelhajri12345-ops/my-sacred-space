import { useCallback, useEffect, useState, useRef } from "react";

// Map to cache initial values during SSR/hydration
const initialCache = new Map<string, unknown>();

export function useLocalStorage<T>(key: string, initial: T) {
  const [hydrated, setHydrated] = useState(false);
  const initialValueRef = useRef<T | null>(null);
  
  // Read initial value from localStorage or use the provided initial value
  if (initialValueRef.current === null && typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        initialValueRef.current = JSON.parse(raw) as T;
      }
    } catch {
      initialValueRef.current = null;
    }
  }
  
  const [value, setValue] = useState<T>(() => {
    return initialValueRef.current ?? initial;
  });

  // Sync with localStorage on mount (after hydration)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw) as T;
        setValue(parsed);
        initialValueRef.current = parsed;
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" 
          ? (next as (p: T) => T)(prev) 
          : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
          initialValueRef.current = resolved;
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}