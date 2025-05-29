import 'react';

declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // Add any custom HTML attributes here
    }
  }
}

// Add any custom types that are missing from the React type definitions
type CustomKeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

// Extend the Window interface if needed
declare global {
  interface Window {
    // Add any custom window properties here
  }
}
