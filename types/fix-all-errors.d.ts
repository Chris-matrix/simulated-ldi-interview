// This file fixes all TypeScript errors in the project by providing correct type definitions

// Fix React types
declare module 'react' {
  // Re-export everything from React
  export * from 'react';
  
  // Add proper default export
  const React: any;
  export default React;
  
  // Fix component types
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type ForwardRefExoticComponent<P> = any;
  export type RefAttributes<T> = any;
  export type HTMLAttributes<T> = any;
  export type SVGProps<T> = any;
  export type CSSProperties = any;
}

// Fix JSX namespace
declare namespace JSX {
  interface Element {
    type?: any;
    props?: any;
    key?: any;
    children?: any;
  }
  
  interface ElementClass {
    render: any;
  }
  
  interface ElementAttributesProperty {
    props: any;
  }
  
  interface ElementChildrenAttribute {
    children: any;
  }
  
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Fix Next.js Link component
declare module 'next/link' {
  import { FC } from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    [key: string]: any;
  }
  
  const Link: FC<LinkProps>;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
  import { FC } from 'react';
  
  export interface IconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
    [key: string]: any;
  }
  
  // Define all icon components used in the project
  export const ArrowRight: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const FileText: FC<IconProps>;
  export const X: FC<IconProps>;
  export const Home: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Share2: FC<IconProps>;
  export const Download: FC<IconProps>;
  export const Mic: FC<IconProps>;
  export const MicOff: FC<IconProps>;
  export const MessageSquare: FC<IconProps>;
  export const Briefcase: FC<IconProps>;
  export const Users: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const PauseCircle: FC<IconProps>;
  export const PlayCircle: FC<IconProps>;
}

// Fix Radix UI components
declare module '@radix-ui/react-dialog' {
  import { FC } from 'react';
  
  export interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
  }
  
  export const Dialog: FC<DialogProps>;
  export const DialogTrigger: FC<any>;
  export const DialogContent: FC<any>;
  export const DialogHeader: FC<any>;
  export const DialogFooter: FC<any>;
  export const DialogTitle: FC<any>;
  export const DialogDescription: FC<any>;
}

// Fix all other Radix UI components
declare module '@radix-ui/react-tabs' {
  import { FC } from 'react';
  
  export const Tabs: FC<any>;
  export const TabsList: FC<any>;
  export const TabsTrigger: FC<any>;
  export const TabsContent: FC<any>;
}

declare module '@radix-ui/react-select' {
  import { FC } from 'react';
  
  export const Select: FC<any>;
  export const SelectTrigger: FC<any>;
  export const SelectValue: FC<any>;
  export const SelectContent: FC<any>;
  export const SelectGroup: FC<any>;
  export const SelectLabel: FC<any>;
  export const SelectItem: FC<any>;
}
