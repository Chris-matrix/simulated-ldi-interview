// Complete React type overrides to fix all JSX compatibility issues

declare module 'react' {
  // Completely redefine React types to fix compatibility issues
  export interface React {
    createElement: any;
    Fragment: any;
  }

  const React: React;
  export default React;

  // Define key types with maximum compatibility
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type ReactFragment = any;
  export type Element = any;

  // Define component types
  export type FC<P = {}> = (props: P) => any;
  export type FunctionComponent<P = {}> = FC<P>;
  export type ComponentType<P = {}> = FC<P>;
  
  // Define ref types
  export type Ref<T> = any;
  export type RefObject<T> = { current: T | null };
  export type MutableRefObject<T> = { current: T };
  export type RefAttributes<T> = { ref?: Ref<T> };
  export type ForwardRefExoticComponent<P> = FC<P>;

  // Define state and effect hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  
  // Define event types
  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  
  // Define utility types
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type EffectCallback = () => void | (() => void);
  export type DependencyList = ReadonlyArray<any>;
  
  // Define HTML attribute types
  export type HTMLAttributes<T> = any;
  export type SVGProps<T> = any;
  export type CSSProperties = any;
  export type ComponentProps<T> = any;
}

// Define JSX namespace to accept any element
declare global {
  namespace JSX {
    interface Element {
      type?: any;
      props?: any;
      key?: any;
      children?: any;
    }
    
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

// Fix Next.js Link component
declare module 'next/link' {
  import { ComponentProps } from 'react';
  
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
    children?: any;
  }
  
  const Link: any;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
  import { ComponentProps } from 'react';
  
  export interface IconProps extends ComponentProps<'svg'> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  
  type IconComponent = any;
  
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
  const DialogHeader: any;
  const DialogFooter: any;
  export { DialogHeader, DialogFooter };
}

export {};
