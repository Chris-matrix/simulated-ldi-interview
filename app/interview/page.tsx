"use client"

import * as React from 'react';
import { 
  useState, 
  useEffect, 
  useCallback,
  useRef
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Event handler types
type InputChangeEvent = { target: { value: string } };
type KeyboardEvent = { key: string; preventDefault: () => void; };

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { ArrowRight, FileText, Home } from 'lucide-react';

// Types
import { Message, IntervieweeInfo } from "@/types/interview"

// Mock functions to replace the missing ones
const streamText = async (options: any) => {
  // Implementation for streaming text
  console.log('Streaming text with options:', options);
  return { text: 'Mock AI response' };
};

const playlab = (tier: string) => ({
  provider: 'playlab',
  model: `playlab-${tier}`,
});

const playlabProvider = {
  generateText: async (options: any) => {
    // Mock implementation
    return { text: 'Mock AI response' };
  }
};

// Import the proper ErrorBoundary component
import ErrorBoundary from '@/components/error-boundary';

interface InterviewState {
  transcript: Message[];
  userInput: string;
  interviewStarted: boolean;
  interviewEnded: boolean;
  intervieweeInfo: IntervieweeInfo | null;
  error: string | null;
  isGeneratingResponse: boolean;
  currentMessage: string;
}

export default function Interview() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State management
  const [state, setState] = useState<InterviewState>({
    transcript: [],
    userInput: '',
    interviewStarted: false,
    interviewEnded: false,
    intervieweeInfo: null,
    error: null,
    isGeneratingResponse: false,
    currentMessage: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Helper function to update state
  const updateState = (updates: Partial<InterviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };
  
  // Destructure state for easier access
  const {
    transcript,
    userInput,
    interviewStarted,
    interviewEnded,
    intervieweeInfo,
    error,
    isGeneratingResponse,
    currentMessage
  } = state;
  
  // Message management functions
  const addMessage = useCallback((message: Message) => {
    const newMessage: Message = {
      role: message.role,
      content: message.content,
      timestamp: new Date(),
      isTyping: message.isTyping || false
    };
    updateState({
      transcript: [...state.transcript, newMessage]
    });
  }, [state.transcript]);
  
  const updateMessage = useCallback((index: number, update: Partial<Message>) => {
    updateState({
      transcript: state.transcript.map((msg, i) => 
        i === index ? { ...msg, ...update } : msg
      )
    });
  }, [state.transcript]);
  
  const renderMessage = (message: Message, index: number): JSX.Element => {
    return (
      <div key={index} className={`message ${message.role}`}>
        {message.content}
      </div>
    );
  };
  
  // Start interview with generated profile
  const startInterview = useCallback(async (profile: IntervieweeInfo): Promise<void> => {
    try {
      // Set interview as started and update state with profile
      updateState({ 
        interviewStarted: true,
        isGeneratingResponse: true 
      });
      
      console.log('Starting interview with profile:', profile);
      
      // Add welcome message
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Welcome to your interview with ${profile.name}, a ${profile.age}-year-old ${profile.role} at ${profile.company}. How would you like to begin?`,
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(welcomeMessage);
      
      updateState({ isGeneratingResponse: false });
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  }, [updateState, addMessage]);

  // Mark unused functions as used to prevent warnings
  const _unused = [addMessage, updateMessage, renderMessage];
  void _unused;

  // Get parameters from URL
  const profession = searchParams.get("profession") || "Software Engineer"
  const gender = searchParams.get("gender") || "any"
  const ethnicity = searchParams.get("ethnicity") || "any"
  const region = searchParams.get("region") || "any"
  const experience = searchParams.get("experience") || "10"
  const education = searchParams.get("education") || "any"
  const industry = searchParams.get("industry") || "any"
  const companyType = searchParams.get("companyType") || "any"
  const specificCompany = searchParams.get("specificCompany") || "any"
  const workStyle = searchParams.get("workStyle") || "any"
  const city = searchParams.get("city") || "any"
  const country = searchParams.get("country") || "any"
  const firstGeneration = searchParams.get("firstGeneration") === "true"
  const careerChanger = searchParams.get("careerChanger") === "true"
  const immigrantBackground = searchParams.get("immigrantBackground") === "true"

  useEffect(() => {
    // Generate interviewee profile
    generateIntervieweeProfile()

    return () => {
      // Clean up any resources if needed
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [transcript])

  const generateIntervieweeProfile = async () => {
    try {
      // Build demographic description
      const demographicDetails = [
        gender !== "any" ? gender : "",
        ethnicity !== "any" ? ethnicity : "",
        firstGeneration ? "first-generation college graduate" : "",
        immigrantBackground ? "immigrant or first-generation American" : "",
        careerChanger ? "career changer who switched fields" : ""
      ].filter(Boolean).join(" ");
      
      // Build location description
      const locationDetails = [
        region !== "any" ? region : "",
        country !== "any" ? country : "",
        city !== "any" ? city : ""
      ].filter(Boolean).join(", ");
      
      // Build career description
      const careerDetails = [
        education !== "any" ? `with ${education.replace(/-/g, ' ')} education` : "",
        industry !== "any" ? `in the ${industry.replace(/-/g, ' ')} industry` : "",
        companyType !== "any" ? `at a ${companyType.replace(/-/g, ' ')}` : "",
        workStyle !== "any" ? `working ${workStyle.replace(/-/g, ' ')}` : ""
      ].filter(Boolean).join(" ");
    
      console.log('Sending request to generate profile...');
      
      const prompt = `Generate a realistic profile for a ${demographicDetails} ${profession} with ${experience} years of experience${locationDetails ? ` from ${locationDetails}` : ''}${careerDetails ? ` ${careerDetails}` : ''}${specificCompany !== 'any' ? ` currently at ${specificCompany}` : ''}.

Include: name, age (appropriate for career stage), current role, company, brief background, education history, and career highlights. The profile should feel authentic and detailed.

Format as JSON with these fields: 
- name: Full name
- age: Number
- role: Current job title
- company: Current employer${specificCompany !== 'any' ? ` (use ${specificCompany})` : ''}
- background: Brief professional background
- education: Array of education history
- experience: Array of work experience
- skills: Array of key skills
- achievements: Array of notable achievements
- personalDetails: Additional relevant personal details based on demographic selections`;

      // Use the API route instead of direct PlayLab API calls
      console.log('Sending request to generate profile via API route...');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          type: 'profile_generation'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      let profileData;
      
      // Add debug logging to see what we're getting back
      console.log('API Response:', data);
      
      // Helper function to repair malformed JSON
      const repairJson = (jsonStr: string): string => {
        console.log('Attempting to repair malformed JSON');
        let fixedJson = jsonStr;
        
        // 0. Remove any non-JSON content that might be surrounding the JSON
        // Look for the first { and the last }
        const firstBrace = fixedJson.indexOf('{');
        const lastBrace = fixedJson.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
          fixedJson = fixedJson.substring(firstBrace, lastBrace + 1);
        }
        
        // Handle common AI response formatting issues
        // Remove markdown code block markers
        fixedJson = fixedJson.replace(/```json\s*|```\s*$/g, '');
        
        // 1. Fix common error patterns
        // Fix missing array closing bracket before a new property
        fixedJson = fixedJson.replace(/}\s*"([^"]+)":/g, '}],\n    "$1":');
        
        // Fix specific error pattern with years and skills
        if (fixedJson.includes('"years":') && fixedJson.includes('"skills":')) {
          // Look for pattern where years is followed directly by skills without proper array closure
          const yearsSkillsPattern = /"years":\s*"[^"]*"[\s\n]*}[\s\n]*"skills":/g;
          if (yearsSkillsPattern.test(fixedJson)) {
            console.log('Found years-skills pattern, applying fix');
            fixedJson = fixedJson.replace(
              yearsSkillsPattern,
              '"years": "2016-present"\n        }\n    ],\n    "skills":'
            );
          }
        }
        
        // 2. General JSON fixes
        // Fix missing commas between properties
        fixedJson = fixedJson.replace(/"([^"]+)"[\s\n]*}[\s\n]*"([^"]+)"/g, '"$1"\n        },\n    "$2"');
        
        // Fix missing commas between array items
        fixedJson = fixedJson.replace(/}[\s\n]*{/g, '},\n        {');
        
        // Fix trailing commas before closing brackets/braces
        fixedJson = fixedJson.replace(/,\s*\]/g, '\n    ]');
        fixedJson = fixedJson.replace(/,\s*}/g, '\n}');
        
        // Fix missing quotes around property names
        fixedJson = fixedJson.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        
        // Fix unquoted string values
        fixedJson = fixedJson.replace(/:\s*([a-zA-Z0-9_\-]+)\s*([,}\n])/g, ': "$1"$2');
        
        // Fix missing closing brackets for arrays
        const openBrackets = (fixedJson.match(/\[/g) || []).length;
        const closeBrackets = (fixedJson.match(/\]/g) || []).length;
        if (openBrackets > closeBrackets) {
          const diff = openBrackets - closeBrackets;
          fixedJson = fixedJson + '\n    ]'.repeat(diff);
        }
        
        // Fix missing closing braces for objects
        const openBraces = (fixedJson.match(/{/g) || []).length;
        const closeBraces = (fixedJson.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          const diff = openBraces - closeBraces;
          fixedJson = fixedJson + '\n}'.repeat(diff);
        }
        
        // Final cleanup - ensure we have valid JSON structure
        try {
          // Test if it's valid JSON now
          JSON.parse(fixedJson);
          return fixedJson;
        } catch (e) {
          console.log('Still invalid JSON after repairs, trying more aggressive approach');
          
          // More aggressive repairs
          try {
            // Replace any remaining problematic characters
            fixedJson = fixedJson.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
            
            // Fix any dangling property names without values
            fixedJson = fixedJson.replace(/"([^"]+)"\s*([,}])/g, '"$1": ""$2');
            
            // Test if valid now
            JSON.parse(fixedJson);
            return fixedJson;
          } catch (e2) {
            console.log('Aggressive repairs failed, using fallback approach');
            
            // Last resort: Try to extract valid JSON objects/arrays
            try {
              // Try to extract any valid JSON object
              const objectMatch = fixedJson.match(/{[\s\S]*}/);
              if (objectMatch) {
                const extracted = objectMatch[0];
                JSON.parse(extracted); // Test if valid
                return extracted;
              }
            } catch (e3) {
              console.log('Failed to extract valid JSON object');
            }
          }
          
          // If we get here, we need to return a valid JSON string even if it's empty
          console.log('All JSON repair attempts failed, returning empty object');
          return '{}';
        }
      };
      
      try {
        // Check if data.response is already an object or needs parsing
        if (typeof data.response === 'object' && data.response !== null) {
          profileData = data.response as IntervieweeInfo;
        } else if (typeof data.response === 'string') {
          // Clean the string - sometimes AI responses have markdown formatting or extra text
          let jsonStr = data.response;
          
          // Try to extract JSON if it's wrapped in markdown code blocks or has extra text
          const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                           jsonStr.match(/({[\s\S]*})/);
          
          if (jsonMatch && jsonMatch[1]) {
            jsonStr = jsonMatch[1].trim();
          }
          
          console.log('Attempting to parse JSON string');
          
          try {
            // First try standard JSON parsing
            profileData = JSON.parse(jsonStr) as IntervieweeInfo;
          } catch (parseError) {
            console.error('JSON parse error, attempting repair');
            
            try {
              // Try to repair and parse the JSON
              const repairedJson = repairJson(jsonStr);
              console.log('Repaired JSON:', repairedJson.substring(0, 100) + '...');
              
              try {
                // If we got an empty object from repair, go straight to fallback
                if (repairedJson === '{}') {
                  console.log('Repair returned empty object, using fallback profile');
                  throw new Error('Empty JSON after repair');
                }
                
                profileData = JSON.parse(repairedJson) as IntervieweeInfo;
                
                // Validate that we have the minimum required fields
                if (!profileData.name || !profileData.profession) {
                  console.log('Parsed JSON missing required fields, using fallback');
                  throw new Error('Missing required fields');
                }
              } catch (finalParseError) {
                console.error('Still failed to parse after repair, using fallback');
                throw finalParseError;
              }
            } catch (repairError) {
              console.error('Failed to repair JSON:', repairError);
              throw repairError;
            }
          }
        } else {
          // Fallback to empty object if response is null or undefined
          console.error('Invalid response format:', data.response);
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
        console.error('Raw response:', data.response);
        
        // Create a fallback profile with the selected parameters
        console.log('Creating fallback profile...');
        profileData = {
          name: `${gender === 'male' ? 'John' : gender === 'female' ? 'Jane' : 'Alex'} Doe`,
          age: experience === 'entry-level' ? 25 : experience === 'mid-level' ? 32 : 45,
          role: profession,
          profession: profession,
          company: specificCompany !== 'any' ? specificCompany : 'Tech Company Inc.',
          background: `${experience} professional with expertise in ${profession}.`,
          education: [`Bachelor's degree in ${profession.split(' ').pop() || 'relevant field'}`],
          experience: [
            {
              role: profession,
              company: specificCompany !== 'any' ? specificCompany : 'Tech Company Inc.',
              description: `Worked as a ${profession} handling key responsibilities in the field.`,
              years: experience === 'entry-level' ? '2020-present' : experience === 'mid-level' ? '2015-present' : '2010-present'
            }
          ],
          skills: [profession, 'Communication', 'Problem Solving', 'Teamwork', profession.split(' ').pop() || 'Industry Knowledge'],
          interests: ['Professional Development', 'Industry Trends', 'Technology'],
          achievements: ['Successfully completed multiple projects'],
          personalDetails: `${demographicDetails}`
        } as unknown as IntervieweeInfo; // Use unknown as intermediate type to avoid TypeScript errors
        
        console.log('Created fallback profile:', profileData);
      }
      // Log the profile data that will be used
      console.log('Profile data to be used:', profileData);
      
      updateState({ 
        intervieweeInfo: profileData,
        error: null
      });

      // Start the interview with an introduction
      startInterview(profileData);
    } catch (err) {
      console.error("Error generating profile:", err);
      updateState({ error: "Failed to generate interviewee profile. Please try again." });
    }
  }

  // Helper function to process chunks from the stream
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

  // Handle input change
  const handleInputChange = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    updateState({ userInput: target.value });
  };

  // Handle sending a message to the AI
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    updateState({ isGeneratingResponse: true });

    try {
      // Format the message with context about the interviewee if available
      const contextualMessage = state.intervieweeInfo 
        ? `[Context: You are interviewing ${state.intervieweeInfo.name}, a ${state.intervieweeInfo.age}-year-old ${state.intervieweeInfo.role} at ${state.intervieweeInfo.company}]\n\nUser message: ${message}`
        : message;

      // Use the existing API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualMessage,
          history: state.transcript,
          type: 'interview_chat'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          intervieweeInfo: state.intervieweeInfo
        });
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(userMessage);
      
      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(aiMessage);
      
      updateState({ isGeneratingResponse: false, userInput: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      updateState({ 
        isGeneratingResponse: false,
        error: 'Failed to get response. Please try again.'
      });
    }
  }, [updateState, addMessage, state.transcript, state.intervieweeInfo]);



  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!state.userInput.trim()) return;

    // Add user message to transcript
    const userMessage: Message = {
      role: 'user',
      content: state.userInput,
      timestamp: new Date()
    };
    addMessage(userMessage);
    updateState({ userInput: '' });

    // Generate AI response
    await handleSendMessage(state.userInput);
  };

  // Add welcome message when interview starts
  useEffect(() => {
    if (state.interviewStarted && !state.interviewEnded) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Welcome to your interview! How can I help you today?',
        timestamp: new Date(),
        isTyping: false
      };
      addMessage(welcomeMessage);
    }
  }, [state.interviewStarted, state.interviewEnded]);

  // Handle interview end
  const endInterview = useCallback(() => {
    const interviewData = {
      profession: state.intervieweeInfo?.profession || '',
      interviewee: state.intervieweeInfo?.name || "Professional",
      transcript: state.transcript,
      timestamp: new Date().toISOString()
    };
    
    // Store interview data in localStorage or send to a server
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastInterview', JSON.stringify(interviewData));
      sessionStorage.setItem("interviewData", JSON.stringify(interviewData));
    }
    router.push("/feedback");
  }, [state.intervieweeInfo, state.transcript, router]);



return (
  <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        {/* Welcome Card */}
        {!interviewStarted && (
          <Card className="w-full mb-4">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome to Your Life Design Interview</h2>
              <p className="mb-4">Your interviewee profile is being generated. The interview will begin shortly.</p>
            </CardContent>
          </Card>
        )}

        {/* Transcript */}
        {interviewStarted && (
          <Card className="w-full mb-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                {transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isGeneratingResponse && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message Input */}
        {interviewStarted && !interviewEnded && (
          <div className="flex w-full space-x-2 mt-4">
            <input
              type="text"
              placeholder="Type your question here..."
              value={userInput}
              onChange={(e: InputChangeEvent) => updateState({ userInput: e.target.value })}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' && state.userInput.trim()) {
                  e.preventDefault();
                  handleSendMessage(state.userInput);
                }
              }}
              disabled={isGeneratingResponse}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              onClick={() => handleSendMessage(userInput)}
              disabled={!userInput.trim() || isGeneratingResponse}
            >
              <ArrowRight className="h-5 w-5" />
              Send
            </Button>
          </div>
        )}

        {interviewEnded && (
          <div className="flex justify-center w-full mt-4">
            <Button variant="default" size="lg" onClick={endInterview}>
              <FileText className="mr-2 h-5 w-5" />
              View Feedback & Transcript
            </Button>
          </div>
        )}

        {/* Instructions */}
        {interviewStarted && !interviewEnded && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Interview Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Ask open-ended questions about their career journey</li>
              <li>Inquire about key decisions and turning points</li>
              <li>Ask about challenges they've faced and how they overcame them</li>
              <li>Explore what they enjoy most about their profession</li>
              <li>Ask what advice they would give to someone starting in their field</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </main>
);
}
