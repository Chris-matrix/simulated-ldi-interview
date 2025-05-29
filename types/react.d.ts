import * as React from 'react';

declare global {
  namespace React {
    // Basic event types
    interface KeyboardEvent<T = Element> extends UIEvent<T> {
      key: string;
      code: string;
      keyCode: number;
      charCode: number;
      shiftKey: boolean;
      ctrlKey: boolean;
      altKey: boolean;
      metaKey: boolean;
      getModifierState(key: string): boolean;
    }

    // Missing types
    type ReactNode = any;
    type ReactElement = any;
    type MutableRefObject<T> = { current: T };
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type EffectCallback = () => void | (() => void);
    type DependencyList = ReadonlyArray<any>;
    type CSSProperties = React.CSSProperties;

    // Component types
    interface FunctionComponent<P = {}> {
      (props: P): ReactElement | null;
      propTypes?: any;
      contextTypes?: any;
      defaultProps?: Partial<P>;
      displayName?: string;
    }

    // Forward ref types
    interface ForwardRefExoticComponent<P> extends React.ForwardRefExoticComponent<P> {}
    
    // HTML element types
    interface HTMLAttributes<T> extends DOMAttributes<T> {
      // Add any custom HTML attributes here
    }

    // Other missing types
    type ComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
    type ComponentPropsWithoutRef<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
    type ElementRef<T> = any;
  }
}

declare module 'react' {
  export = React;
  export as namespace React;
}
