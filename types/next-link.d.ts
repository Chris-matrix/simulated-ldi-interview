import * as React from 'react';

declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/link';
  
  // Extend the LinkProps interface to include className
  export interface LinkProps extends NextLinkProps {
    className?: string;
  }
  
  // Define the Link component as a proper JSX component
  const Link: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
  
  export default Link;
}
