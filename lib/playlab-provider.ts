import { 
  AIProvider, 
  GenerateTextOptions, 
  StreamTextOptions, 
  GenerateTextResult,
  StreamTextResult,
  AIStream
} from 'ai';
import { PlayLabAIModel } from './playlab-ai';

// PlayLab AI API configuration
interface PlayLabConfig {
  apiKey?: string;
  baseUrl?: string;
}

// Default configuration
const defaultConfig: PlayLabConfig = {
  baseUrl: 'https://api.playlab.ai/v1',
};

// PlayLab AI provider implementation
export class PlayLabProvider implements AIProvider {
  private config: PlayLabConfig;

  constructor(config: PlayLabConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Method to generate text (non-streaming)
  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const { model, prompt, system, maxTokens } = options;
    
    if (model.provider !== 'playlab') {
      throw new Error('Model provider must be PlayLab AI');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey || process.env.PLAYLAB_API_KEY}`,
        },
        body: JSON.stringify({
          model: (model as PlayLabAIModel).id,
          prompt,
          system_message: system,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`PlayLab AI API error: ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].text,
        usage: data.usage,
      };
    } catch (error) {
      console.error('Error generating text with PlayLab AI:', error);
      throw error;
    }
  }

  // Method to stream text responses
  async streamText(options: StreamTextOptions): Promise<StreamTextResult> {
    const { model, prompt, system, maxTokens } = options;
    
    if (model.provider !== 'playlab') {
      throw new Error('Model provider must be PlayLab AI');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey || process.env.PLAYLAB_API_KEY}`,
        },
        body: JSON.stringify({
          model: (model as PlayLabAIModel).id,
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt }
          ],
          stream: true,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`PlayLab AI API error: ${error.message || response.statusText}`);
      }

      // Create a streaming response parser
      const stream = AIStream(response);
      let fullText = '';

      // Process the stream
      return {
        stream,
        text: await new Promise((resolve) => {
          stream.on('data', (chunk) => {
            const decoded = new TextDecoder().decode(chunk);
            try {
              const parsedChunk = JSON.parse(decoded.replace('data: ', ''));
              if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
                fullText += parsedChunk.choices[0].delta.content;
              }
            } catch (e) {
              // Skip unparseable chunks
            }
          });
          
          stream.on('end', () => {
            resolve(fullText);
          });
        }),
      };
    } catch (error) {
      console.error('Error streaming text with PlayLab AI:', error);
      throw error;
    }
  }
}
