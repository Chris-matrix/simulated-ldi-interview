import * as React from 'react';

declare module '@radix-ui/react-dialog' {
  // Extend the DialogHeader component type
  export const DialogHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  
  // Extend the DialogFooter component type
  export const DialogFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  
  // Re-export all types from the original module
  export * from '@radix-ui/react-dialog';
}
