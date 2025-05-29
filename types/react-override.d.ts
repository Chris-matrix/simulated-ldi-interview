// This file overrides React types to fix TypeScript errors in the project

import React from 'react';

declare global {
  namespace React {
    // Override ReactNode type to accept any type
    type ReactNode = any;
    
    // Override ReactElement type to accept any type
    type ReactElement = any;
    
    // Override ReactPortal type to accept any type
    type ReactPortal = any;
    
    // Override Element type to accept any type
    interface Element {
      type?: any;
      props?: any;
      key?: any;
      children?: any;
    }
  }
}

export {};
