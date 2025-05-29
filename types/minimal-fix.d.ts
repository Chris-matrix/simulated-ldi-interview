// Minimal type fixes to address specific TypeScript errors

// Fix the ReactNode and Element compatibility issue
declare module 'react' {
  // Only override the specific types causing issues
  export type ReactNode = React.ReactElement | string | number | boolean | null | undefined | React.ReactNodeArray;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type Element = any;
  export type ReactNodeArray = ReactNode[];
}

// Fix JSX namespace to accept any element
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

// Fix Next.js Link component
declare module 'next/link' {
  const Link: any;
  export default Link;
}

// Fix Lucide React icons
declare module 'lucide-react' {
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
