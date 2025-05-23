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
  export * from 'react';
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export interface ChangeEvent<T = Element> {
    target: T;
    currentTarget: T;
  }
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

// Lucide icon type declarations
declare module 'lucide-react' {
  import { ComponentType, SVGAttributes } from 'react';
  
  export interface IconProps extends SVGAttributes<SVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    className?: string;
  }
  
  export type Icon = ComponentType<IconProps>;
  
  export const ArrowLeft: Icon;
  export const Download: Icon;
  export const Home: Icon;
  export const Mail: Icon;
  export const Share2: Icon;
}

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
  import { ComponentProps, ReactNode } from 'react';
  export interface LinkProps extends ComponentProps<'a'> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children?: ReactNode;
  }
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'lucide-react' {
  import { ComponentProps } from 'react';
  export interface IconProps extends ComponentProps<'svg'> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export function ArrowLeft(props: IconProps): JSX.Element;
  export function ArrowRight(props: IconProps): JSX.Element;
  export function Briefcase(props: IconProps): JSX.Element;
  export function Globe(props: IconProps): JSX.Element;
  export function Users(props: IconProps): JSX.Element;
  export function Download(props: IconProps): JSX.Element;
  export function Home(props: IconProps): JSX.Element;
  export function Mail(props: IconProps): JSX.Element;
  export function Share2(props: IconProps): JSX.Element;
  export function Mic(props: IconProps): JSX.Element;
  export function MicOff(props: IconProps): JSX.Element;
  export function PauseCircle(props: IconProps): JSX.Element;
  export function PlayCircle(props: IconProps): JSX.Element;
  export function FileText(props: IconProps): JSX.Element;
}
