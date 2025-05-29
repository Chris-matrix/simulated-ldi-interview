import * as React from 'react';

// Re-export React hooks with proper typing
export function useRef<T>(initialValue: T | null): React.MutableRefObject<T | null> {
  return React.useRef<T | null>(initialValue);
}

export function useState<T>(
  initialState: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return React.useState<T>(initialState);
}

export function useEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  React.useEffect(effect, deps);
}

export function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return React.useCallback(callback, deps);
}
