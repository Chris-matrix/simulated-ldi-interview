import * as React from 'react';

declare module 'lucide-react' {
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  type IconComponent = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;

  // Define all icon components used in the project
  export const ArrowRight: IconComponent;
  export const ArrowLeft: IconComponent;
  export const FileText: IconComponent;
  export const X: IconComponent;
  export const Home: IconComponent;
  export const Mail: IconComponent;
  export const Share2: IconComponent;
  export const Download: IconComponent;
  export const Mic: IconComponent;
  export const MessageSquare: IconComponent;
  export const Briefcase: IconComponent;
  export const Users: IconComponent;
  export const Globe: IconComponent;

  // Re-export all types from the original module
  export * from 'lucide-react';
}
