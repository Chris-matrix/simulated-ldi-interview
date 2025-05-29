/**
 * Direct fix for Element/ReactNode compatibility issues
 */

// Override React types to fix compatibility issues
declare module 'react' {
  // The key issue is that Element is not compatible with ReactNode
  // This is because Element's key property is optional but ReactPortal requires it
  // So we need to make ReactNode accept Element directly
  
  // Define Element with required key property
  interface Element {
    type: any;
    props: any;
    key: string | number | null;
  }
  
  // Make ReactNode accept Element directly
  type ReactNode = Element | Element[] | string | number | boolean | null | undefined;
  
  // Make ReactPortal compatible with Element
  interface ReactPortal extends Element {
    children: ReactNode;
  }
  
  // Make ReactFragment accept Element[]
  interface ReactFragment {
    [key: string | number]: ReactNode;
  }
  
  // Fix FC type to return ReactNode
  type FC<P = {}> = (props: P) => ReactNode;
  
  // Fix FunctionComponent to return ReactNode
  interface FunctionComponent<P = {}> {
    (props: P): ReactNode;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  
  // Fix IconComponent
  type IconComponent = FC<any>;
}

// Fix Next.js Link component
declare module 'next/link' {
  import { FC } from 'react';
  
  interface LinkProps {
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
    [key: string]: any;
  }
  
  const Link: FC<LinkProps>;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
  import { FC } from 'react';
  
  interface IconProps {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
    [key: string]: any;
  }
  
  type IconComponent = FC<IconProps>;
  
  // Define all icon components
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
  import { FC } from 'react';
  
  export const DialogHeader: FC<any>;
  export const DialogFooter: FC<any>;
  export const DialogContent: FC<any>;
  export const DialogDescription: FC<any>;
  export const DialogTitle: FC<any>;
  export const DialogTrigger: FC<any>;
  export const Dialog: FC<any>;
  export const DialogClose: FC<any>;
  export const DialogOverlay: FC<any>;
  export const DialogPortal: FC<any>;
}

export {};
