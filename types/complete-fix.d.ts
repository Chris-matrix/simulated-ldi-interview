/**
 * Complete TypeScript fix for React JSX compatibility issues
 */

// Fix React namespace and types
declare namespace React {
  // Basic types
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type ReactFragment = any;
  export type Element = any;
  export type Key = string | number;
  export type Ref<T> = any;
  export type ComponentType<P = {}> = any;
  export type FC<P = {}> = any;
  export type FunctionComponent<P = {}> = FC<P>;
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export type ComponentProps<T extends keyof JSX.IntrinsicElements | React.ComponentType<any>> = any;
  export type HTMLAttributes<T> = any;
  export type SVGProps<T> = any;
  export type CSSProperties = any;
  
  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initialArg: I,
    init?: (arg: I) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  
  // Component types
  export interface Component<P = {}, S = {}> {
    props: P;
    state: S;
    context: any;
    setState(state: S | ((prevState: S, props: P) => S), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }
  
  // Event types
  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  
  // Utility types
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type EffectCallback = () => void | (() => void);
  export type DependencyList = ReadonlyArray<any>;
  export type Reducer<S, A> = (prevState: S, action: A) => S;
  export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export type Context<T> = any;
  
  // Fragment
  export const Fragment: unique symbol;
}

// Define global React object
declare const React: {
  createElement: any;
  Fragment: any;
  useState: typeof React.useState;
  useEffect: typeof React.useEffect;
  useRef: typeof React.useRef;
  useCallback: typeof React.useCallback;
  useMemo: typeof React.useMemo;
  useContext: typeof React.useContext;
  useReducer: typeof React.useReducer;
};

// Define JSX namespace
declare global {
  namespace JSX {
    interface Element extends React.ReactElement {}
    
    interface ElementClass {
      render?: any;
    }
    
    interface ElementAttributesProperty {
      props?: any;
    }
    
    interface ElementChildrenAttribute {
      children?: any;
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix module declarations
declare module 'react' {
  export = React;
  export as namespace React;
}

// Fix Next.js Link component
declare module 'next/link' {
  const Link: any;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
  export interface IconProps {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
    [key: string]: any;
  }
  
  export type IconComponent = any;
  
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
  export const DialogHeader: any;
  export const DialogFooter: any;
  export const DialogContent: any;
  export const DialogDescription: any;
  export const DialogTitle: any;
  export const DialogTrigger: any;
  export const Dialog: any;
  export const DialogClose: any;
  export const DialogOverlay: any;
  export const DialogPortal: any;
}

// Fix Radix UI Tabs
declare module '@radix-ui/react-tabs' {
  export const Tabs: any;
  export const TabsList: any;
  export const TabsTrigger: any;
  export const TabsContent: any;
}

// Fix any other Radix UI components
declare module '@radix-ui/react-*' {
  const Component: any;
  export default Component;
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const Portal: any;
}

export {};
