// Fix JSX compatibility issues
declare namespace JSX {
  interface Element {
    type?: any;
    props?: any;
    key?: any;
  }
  
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Fix React types
declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  type ReactPortal = any;
  type Element = any;
  type FC<P = {}> = any;
  type FunctionComponent<P = {}> = any;
  type ComponentType<P = {}> = any;
  type ForwardRefExoticComponent<P = {}> = any;
  type RefAttributes<T> = any;
  type HTMLAttributes<T> = any;
  type SVGProps<T> = any;
  type CSSProperties = any;
  
  // Hooks
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  function useRef<T>(initialValue: T | null): { current: T | null };
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
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

export {};
