import { PlayLabProvider } from './playlab-provider';

// Initialize the PlayLab AI provider
export const playlabProvider = new PlayLabProvider({
  // The API key will be loaded from environment variables
  // You can set PLAYLAB_API_KEY in your .env.local file
});

// Export the provider for use in the application
export default playlabProvider;
