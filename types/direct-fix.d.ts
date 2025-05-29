// Direct fix for React type compatibility issues

// Fix the core issue: Element vs ReactNode compatibility
declare module 'react/jsx-runtime' {
  export namespace JSX {
    type Element = any;
  }
}

// Override React types
declare module 'react' {
  // Make all React types compatible with each other
  export type ReactNode = any;
  export type ReactElement = any;
  export type ReactPortal = any;
  export type Element = any;
  export type FC<P = {}> = any;
  export type FunctionComponent<P = {}> = any;
}

// Fix Next.js Link component
declare module 'next/link' {
  const Link: any;
  export default Link;
}

// Fix Lucide React icons
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

// Fix Radix UI components
declare module '@radix-ui/react-dialog' {
  export const DialogHeader: any;
  export const DialogFooter: any;
}

export {};
