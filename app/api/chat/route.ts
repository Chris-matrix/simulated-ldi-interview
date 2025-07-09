import { NextResponse } from "next/server";

// Fallback responses when the API is not available
function getFallbackResponse() {
  const responses = [
    "I'm having trouble connecting to the AI service. Let's try that again.",
    "I apologize, but I'm having some technical difficulties. Could you rephrase your question?",
    "I'm unable to process your request at the moment. Please try again in a moment.",
    "It seems there's an issue with the AI service. Let's try a different approach.",
    "I'm having trouble understanding right now. Could you provide more details?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

async function createConversation(BASE_URL: string, PROJECT_ID: string, API_KEY: string) {
  try {
    const res = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error("Conversation creation failed:", res.status, text);
      return null;
    }
    
    const data = await res.json();
    return data.conversation || null;
  } catch (error) {
    console.error("Error in createConversation:", error);
    return null;
  }
}

type SendMessageResult = {
  body?: ReadableStream<Uint8Array>;
  error?: string;
  message?: string;
};

async function sendMessage(BASE_URL: string, PROJECT_ID: string, API_KEY: string, conversationId: string, userPrompt: string): Promise<SendMessageResult> {
  try {
    const res = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          message: userPrompt,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Message sending failed:", res.status, text);
      return { error: "Message sending failed", message: text };
    }
    
    if (!res.body) {
      return { 
        body: new ReadableStream(),
        error: "No response body received" 
      };
    }
    
    return { body: res.body };
  } catch (error: any) {
    console.error("Error in sendMessage:", error);
    return { 
      error: "Error sending message", 
      message: error.message || "Unknown error occurred",
      body: undefined
    };
  }
}

function extractDeltaFromLine(line: string): string {
  if (!line.startsWith("data:")) return "";
  try {
    const json = JSON.parse(line.replace("data: ", ""));
    return json?.delta ?? "";
  } catch {
    // Ignore invalid lines
    return "";
  }
}

function processChunk(chunk: string): string {
  return chunk
    .split("\n")
    .map(extractDeltaFromLine)
    .filter(Boolean)
    .join("");
}

async function readSSEStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullResponse = "";
  let done = false;

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      const chunk = decoder.decode(value);
      fullResponse += processChunk(chunk);
    }
  }
  return fullResponse;
}

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const API_KEY = process.env.NEXT_PUBLIC_PLAYLAB_API_KEY!;
    const PROJECT_ID = process.env.NEXT_PUBLIC_PLAYLAB_PROJECT_ID!;
    const BASE_URL = "https://www.playlab.ai/api/v1";

    // Step 1: Create conversation
    const conversation = await createConversation(BASE_URL, PROJECT_ID, API_KEY);
    if (!conversation) {
      return NextResponse.json({ error: "Could not start conversation." }, { status: 500 });
    }

    // Determine request type and prepare prompt
    let userPrompt = "";
    const { type = 'code_feedback' } = requestData;

    if (type === 'code_feedback') {
      // Handle existing code feedback functionality
      const { code, assignment } = requestData;
      userPrompt = `Assignment: ${assignment}\n\nStudent code:\n${code}\n\nProvide structured feedback in plain text. Format as: Feedback, Rubric, Rating, Notes. Do not include code.`;
    } 
    else if (type === 'profile_generation') {
      // Handle profile generation
      const { message } = requestData;
      // Add specific instructions to ensure valid JSON output
      userPrompt = `${message}\n\nIMPORTANT: Your response must be ONLY valid JSON without any additional text, markdown formatting, or code blocks. Do not include any explanation or commentary outside of the JSON object.`;
    }
    else if (type === 'interview_chat') {
      // Handle interview chat
      const { message, history = [], profession = 'Software Engineer' } = requestData;
      
      // Add context about the profession to the prompt
      const professionContext = `You are conducting an interview for a ${profession} position. ` +
        `Your responses should be relevant to this profession and help assess the candidate's qualifications.`;
      
      if (history && history.length > 0) {
        const formattedHistory = history
          .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n\n');
        
        userPrompt = `${professionContext}\n\nPrevious conversation:\n${formattedHistory}\n\nUser: ${message}`;
      } else {
        // For first message, include the profession context
        userPrompt = `${professionContext}\n\n${message}`;
      }
    }

    // Step 2: Send message (expect streaming response)
    const messageResult = await sendMessage(BASE_URL, PROJECT_ID, API_KEY, conversation.id, userPrompt);
    if (messageResult.error || !messageResult.body) {
      console.error("Error sending message:", messageResult.error || "No response body");
      return NextResponse.json({ 
        error: messageResult.error || "Could not send message",
        message: messageResult.message
      }, { status: 500 });
    }

    // Step 3: Read the SSE stream
    const fullResponse = await readSSEStream(messageResult.body);
    
    // Add debug logging
    console.log('Raw API response:', fullResponse?.substring(0, 200) + '...');
    
    // Return appropriate response format based on request type
    if (type === 'code_feedback') {
      return NextResponse.json({ feedback: fullResponse || "No response received." });
    } else if (type === 'profile_generation') {
      // For profile generation, try to ensure we have valid JSON
      try {
        // Check if the response is already valid JSON
        const parsedResponse = JSON.parse(fullResponse);
        return NextResponse.json(parsedResponse);
      } catch (e) {
        // If not valid JSON, try to extract JSON from the text
        console.log('Attempting to extract JSON from response');
        
        // Look for JSON in code blocks or just braces
        const jsonMatch = fullResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         fullResponse.match(/({[\s\S]*})/);
                         
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          try {
            // Validate the extracted JSON
            const parsedJson = JSON.parse(extractedJson);
            return NextResponse.json(parsedJson);
          } catch (e) {
            console.error('Failed to parse extracted JSON', e);
          }
        }
        
        // If we couldn't extract valid JSON, return a proper error
        console.error('Invalid JSON response from API:', fullResponse);
        return NextResponse.json(
          { error: 'Failed to generate profile. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ response: fullResponse || "No response received." });
    }
  } catch (error: any) {
    console.error("API route error:", error);
    // Return a more helpful error message
    const errorMessage = error.message.includes('fetch failed') 
      ? 'Failed to connect to the AI service. Please check your internet connection and try again.'
      : error.message || 'An error occurred while processing your request.';
      
    return NextResponse.json({ 
      error: errorMessage,
      response: getFallbackResponse()
    }, { status: 500 });
  }
}