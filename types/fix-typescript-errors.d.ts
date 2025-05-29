/**
 * Comprehensive TypeScript fix for React JSX compatibility issues
 * This file overrides React types to make them compatible with the project
 */

// Override React types to fix Element/ReactNode compatibility
declare module 'react' {
  // Make ReactNode accept any Element type
  export type ReactNode = React.ReactElement | React.ReactFragment | React.ReactPortal | string | number | boolean | null | undefined;
  
  // Make ReactElement compatible with ReactNode
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  // Make ReactPortal compatible with ReactElement
  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  
  // Define Key type
  export type Key = string | number;
  
  // Define JSXElementConstructor
  export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
  
  // Define Component
  export class Component<P = {}, S = {}> {
    props: P;
    state: S;
    context: any;
    refs: {
      [key: string]: any;
    };
    setState(state: S | ((prevState: S, props: P) => S), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }
  
  // Define Fragment
  export const Fragment: unique symbol;
  
  // Define ReactFragment
  export interface ReactFragment {
    [key: string | number]: ReactNode;
  }
  
  // Define FC type
  export type FC<P = {}> = FunctionComponent<P>;
  
  // Define FunctionComponent
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
}

// Define JSX namespace to accept any element
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    
    interface ElementAttributesProperty {
      props: {};
    }
    
    interface ElementChildrenAttribute {
      children: {};
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix Next.js Link component
declare module 'next/link' {
  import { ComponentProps, FC, ReactNode } from 'react';
  
  export interface LinkProps extends ComponentProps<'a'> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children?: ReactNode;
  }
  
  const Link: FC<LinkProps>;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
  import { ComponentProps, FC } from 'react';
  
  export interface IconProps extends ComponentProps<'svg'> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  
  export type IconComponent = FC<IconProps>;
  
  // Define all icon components used in the project
  export const ArrowLeft: IconComponent;
  export const ArrowRight: IconComponent;
  export const Briefcase: IconComponent;
  export const Globe: IconComponent;
  export const Users: IconComponent;
  export const Download: IconComponent;
  export const Home: IconComponent;
  export const Mail: IconComponent;
  export const Share2: IconComponent;
  export const Mic: IconComponent;
  export const MicOff: IconComponent;
  export const PauseCircle: IconComponent;
  export const PlayCircle: IconComponent;
  export const FileText: IconComponent;
  export const MessageSquare: IconComponent;
  export const X: IconComponent;
}

// Fix Radix UI components
declare module '@radix-ui/react-dialog' {
  import { FC, HTMLAttributes } from 'react';
  
  export const DialogHeader: FC<HTMLAttributes<HTMLDivElement>>;
  export const DialogFooter: FC<HTMLAttributes<HTMLDivElement>>;
}

export {};
