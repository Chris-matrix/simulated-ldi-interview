import * as React from 'react';

declare global {
  namespace React {
    // Add missing types
    type ReactNode = any;
    type ReactElement = any;
    type MutableRefObject<T> = { current: T };
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type EffectCallback = () => void | (() => void);
    type DependencyList = ReadonlyArray<any>;
    type CSSProperties = React.CSSProperties;
    type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;

    // Add missing hooks
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    function useEffect(effect: EffectCallback, deps?: DependencyList): void;
    function useRef<T>(initialValue: T): MutableRefObject<T>;
    function useCallback<T extends (...args: any[]) => any>(
      callback: T,
      deps: DependencyList
    ): T;
    function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
    function useContext<T>(context: React.Context<T>): T;
    function useReducer<R extends React.Reducer<any, any>>(
      reducer: R,
      initialState: React.ReducerState<R>,
      initializer?: undefined
    ): [React.ReducerState<R>, Dispatch<React.ReducerAction<R>>];
  }
}

export {};
