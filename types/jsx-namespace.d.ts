// This file provides a global JSX namespace that makes TypeScript accept all JSX components

declare namespace JSX {
  interface Element {
    children?: any;
    [key: string]: any;
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
