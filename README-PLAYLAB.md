# PlayLab AI Integration for Life Design Interview App

This document explains how to set up and use the PlayLab AI integration in the Life Design Interview application.

## Overview

The application has been updated to use PlayLab AI instead of OpenAI for generating text responses and interview feedback. This integration allows for more advanced AI capabilities tailored specifically for interview simulations.

## Setup Instructions

### 1. API Key Configuration

To use PlayLab AI, you need to set up your API key in an environment variable:

1. Create a `.env.local` file in the root directory of the project
2. Add your PlayLab AI API key to the file:
   ```
   PLAYLAB_API_KEY=your_api_key_here
   ```
3. Restart the development server if it's running

### 2. Integration Files

The PlayLab AI integration consists of three main files:

- `lib/playlab-ai.ts`: Defines the PlayLab AI model interface and exports model instances
- `lib/playlab-provider.ts`: Implements the PlayLab AI provider for the AI SDK
- `lib/ai-config.ts`: Configures and exports the PlayLab AI provider for use in the application

### 3. Model Tiers

PlayLab AI offers different model tiers that can be used in the application:

- `standard`: Basic model suitable for simple text generation
- `advanced`: Improved model with better understanding of context
- `premium`: Most powerful model with the best performance (currently used in the app)

You can change the model tier in the code by modifying the model parameter in the AI calls:

```typescript
// Example
const { text } = await generateText({
  model: playlab("premium"), // Change to "standard" or "advanced" as needed
  provider: playlabProvider,
  prompt: "Your prompt here"
});
```

## Features

The PlayLab AI integration powers several key features in the application:

1. **Interviewee Profile Generation**: Creates realistic profiles for professionals based on selected parameters
2. **Interview Responses**: Generates natural conversational responses during the interview
3. **Feedback Analysis**: Provides comprehensive feedback on interviewing skills
4. **Email Content Generation**: Creates professional email content for sharing feedback

## Troubleshooting

If you encounter issues with the PlayLab AI integration:

1. Verify that your API key is correctly set in the `.env.local` file
2. Check the browser console for any error messages
3. Ensure you're using a supported model tier
4. Confirm that your network connection allows API calls to the PlayLab AI service

## Further Customization

You can customize the PlayLab AI integration by:

1. Modifying the prompts in the application code
2. Adjusting the system messages for different interview styles
3. Changing the model parameters for different response characteristics
4. Implementing additional PlayLab AI features as they become available

For more information about PlayLab AI and its capabilities, visit the official documentation.
