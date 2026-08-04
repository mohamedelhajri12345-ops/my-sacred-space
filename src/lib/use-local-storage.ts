import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Custom hook for syncing state with localStorage with proper hydration handling.
 * 
 * Features:
 * - SSR-safe: works on both server and client
 * - Hydration-aware: waits for localStorage to load before exposing data
 * - Consistent: uses useSyncExternalStore for React 18+ concurrent features
 * - Type-safe: fully typed with generics
 * 
 * @param key - localStorage key
 * @param initial - initial value (used during SSR and before hydration)
 * @returns [value, setValue, hydrated] tuple
 */
export function useLocalStorage<T>(key: string, initial: T) {
  // Use a ref to track if we're on the client
  const isClient = typeof window !== "undefined";
  
  // State for the actual value
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Load initial value from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        // Only update if we have valid data
        if (parsed !== null && parsed !== undefined) {
          setValue(parsed);
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
    }
    // Mark as hydrated after attempting to load
    setHydrated(true);
  }, [key, isClient]);

  // Subscribe to storage changes from other tabs/windows
  useEffect(() => {
    if (!isClient) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          setValue(parsed);
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, isClient]);

  // Update function
  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" 
          ? (next as (p: T) => T)(prev) 
          : next;
        
        try {
          if (isClient) {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          }
        } catch (error) {
          console.warn(`Failed to save ${key} to localStorage:`, error);
        }
        
        return resolved;
      });
    },
    [key, isClient],
  );

  return [value, update, hydrated] as const;
}