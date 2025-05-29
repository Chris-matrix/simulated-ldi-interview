// Type declarations for modules without TypeScript definitions

declare module 'ai' {
  export interface AIModel {
    id: string;
    provider: string;
  }

  export interface GenerateTextOptions {
    model: AIModel;
    provider?: AIProvider;
    prompt: string;
    system?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stopSequences?: string[];
  }

  export interface StreamTextOptions {
    model: AIModel;
    provider?: AIProvider;
    prompt: string;
    system?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stopSequences?: string[];
    onChunk?: (chunk: any) => void;
  }

  export interface GenerateTextResult {
    text: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  }

  export interface StreamTextResult {
    text: string;
    stream: any;
  }

  export interface AIProvider {
    generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
    streamText(options: StreamTextOptions): Promise<StreamTextResult>;
  }

  export function generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
  export function streamText(options: StreamTextOptions): Promise<StreamTextResult>;
  export function AIStream(response: Response): any;
}

declare module '@ai-sdk/openai' {
  import { AIModel } from 'ai';
  
  export function openai(modelId: string): AIModel;
}

// Add declarations for React and Next.js modules
declare module 'react' {
  export interface React {
    createElement: any;
    Fragment: any;
  }
  const React: React;
  export default React;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
  export type FC<P = {}> = (props: P) => JSX.Element | null;
  export type ReactNode = JSX.Element | string | number | boolean | null | undefined;
  export type ReactElement = JSX.Element;
  export type MutableRefObject<T> = { current: T };
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type EffectCallback = () => void | (() => void);
  export type DependencyList = ReadonlyArray<any>;
  export type ForwardRefExoticComponent<P> = FC<P>;
  export type RefAttributes<T> = { ref?: React.Ref<T> };
  export type Ref<T> = MutableRefObject<T> | ((instance: T | null) => void) | null;
  export type HTMLAttributes<T> = any;
  export type SVGProps<T> = any;
  export type CSSProperties = any;
}

// Add JSX namespace for TypeScript to recognize JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Web Speech API declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: Event) => void;
  start(): void;
  stop(): void;
}

// Lucide icon type declarations - removed duplicate declaration

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
  speechSynthesis: SpeechSynthesis;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
  };
  export function useSearchParams(): {
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string) => boolean;
  };
}

declare module 'next/link' {
  import { ComponentProps, ReactNode, FC } from 'react';
  export interface LinkProps extends ComponentProps<'a'> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    children?: ReactNode;
  }
  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'lucide-react' {
  import { ComponentProps, FC, ReactElement } from 'react';
  export interface IconProps extends ComponentProps<'svg'> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  
  type IconComponent = FC<IconProps>;
  
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
