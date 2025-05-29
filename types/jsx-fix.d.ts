import React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

declare module 'react' {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>>
    extends React.ReactElement<P, T> {}
  
  interface ReactNode extends React.ReactNode {}
  
  interface ReactPortal extends React.ReactPortal {}
  
  interface ForwardRefExoticComponent<P> extends React.ForwardRefExoticComponent<P> {}
  
  interface RefAttributes<T> extends React.RefAttributes<T> {}
  
  interface HTMLAttributes<T> extends React.HTMLAttributes<T> {}
  
  interface SVGProps<T> extends React.SVGProps<T> {}
  
  interface CSSProperties extends React.CSSProperties {}
  
  interface FC<P = {}> {
    (props: P): ReactElement<P> | null;
    displayName?: string;
  }
}

export {};
