// PlayLab AI SDK wrapper
import { AIModel } from 'ai';

// Define the PlayLab AI model interface
export interface PlayLabAIModel extends AIModel {
  id: string;
  provider: 'playlab';
}

// Create a PlayLab AI model instance
export function playlab(modelId: string): PlayLabAIModel {
  return {
    id: modelId,
    provider: 'playlab',
  };
}

// Export default models for easy access
export const models = {
  // You can define different model tiers here based on PlayLab's offerings
  standard: playlab('standard'),
  advanced: playlab('advanced'),
  premium: playlab('premium'),
};
