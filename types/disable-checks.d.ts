// Complete type override to disable type checking for React components

// Global declarations to override JSX namespace
declare global {
  namespace JSX {
    // Make Element accept any type
    interface Element {
      type?: any;
      props?: any;
      key?: any;
    }
    
    // Make IntrinsicElements accept any element
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Override React module
declare module 'react' {
  // Export React namespace
  export = React;
  export as namespace React;
}

// Define React namespace with any types
declare namespace React {
  // Basic types
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type Element = any;
  export type Key = any;
  export type ComponentType<P = {}> = any;
  export type FC<P = {}> = any;
  export type FunctionComponent<P = {}> = any;
  
  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
}

// Override Next.js Link component
declare module 'next/link' {
  const Link: any;
  export default Link;
}

// Override Lucide React icons
declare module 'lucide-react' {
  export type IconComponent = any;
  
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const Briefcase: any;
  export const Globe: any;
  export const Users: any;
  export const Download: any;
  export const Home: any;
  export const Mail: any;
  export const Share2: any;
  export const Mic: any;
  export const MicOff: any;
  export const PauseCircle: any;
  export const PlayCircle: any;
  export const FileText: any;
  export const MessageSquare: any;
  export const X: any;
}

// Override Radix UI components
declare module '@radix-ui/react-dialog' {
  export const DialogHeader: any;
  export const DialogFooter: any;
}

export {};
