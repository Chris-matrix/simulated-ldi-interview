"use client"

import { 
  useState, 
  useEffect, 
  useCallback,
  useRef
} from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, FileText, Loader2, Home as HomeIcon } from 'lucide-react';
import { Message, IntervieweeInfo } from '@/types/interview';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Helper function to update state
  const updateState = useCallback((partialState: Partial<InterviewState>) => {
    setState(prev => ({ ...prev, ...partialState }));
  }, []);

  // Helper function to add a message to the transcript
  const addMessage = useCallback((message: Omit<Message, 'timestamp' | 'isTyping'> & { isTyping?: boolean }) => {
    const newMessage: Message = {
      ...message,
      timestamp: new Date(),
      isTyping: message.isTyping || false
    };
    setState(prev => ({
      ...prev,
      transcript: [...prev.transcript, newMessage]
    }));
  }, []);

  // Helper function to update an existing message
  const updateMessage = useCallback((index: number, updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      transcript: prev.transcript.map((msg, i) => 
        i === index ? { ...msg, ...updates } : msg
      )
    }));
  }, []);

  // Helper function to render messages
  const renderMessage = useCallback((message: Message, index: number) => {
    return (
      <div 
        key={index}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div 
          className={`max-w-3xl rounded-2xl px-4 py-3 ${
            message.role === 'user' 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-muted/50 text-foreground rounded-tl-none border border-border/50'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }, []);

  // Get parameters from URL with default values
  const profession = searchParams?.get("profession") ?? "Software Engineer";
  const region = searchParams?.get("region") ?? "any";
  const experience = searchParams?.get("experience") ?? "10";
  const education = searchParams?.get("education") ?? "any";
  const industry = searchParams?.get("industry") ?? "any";
  const companyType = searchParams?.get("companyType") ?? "any";
  const specificCompany = searchParams?.get("specificCompany") ?? "any";
  const workStyle = searchParams?.get("workStyle") ?? "any";
  const city = searchParams?.get("city") ?? "any";
  const country = searchParams?.get("country") ?? "any";
  const careerChanger = searchParams?.get("careerChanger") === "true";

  // Start interview with generated profile
  const startInterview = useCallback(async (profile: IntervieweeInfo): Promise<void> => {
    try {
      // Set interview as started and update state with profile
      updateState({ 
        interviewStarted: true,
        isGeneratingResponse: true,
        intervieweeInfo: profile
      });
      
      console.log('Starting interview with profile:', profile);
      
      // Add welcome message
      const welcomeMessage: Omit<Message, 'timestamp'> = {
        role: 'assistant',
        content: `Welcome to your interview with ${profile.name}, a ${profile.age}-year-old ${profile.role} at ${profile.company}. How would you like to begin?`,
        isTyping: false
      };
      
      await addMessage(welcomeMessage);
      updateState({ isGeneratingResponse: false });
    } catch (error) {
      console.error("Error starting interview:", error);
      updateState({ 
        error: 'Failed to start interview. Please try again.',
        isGeneratingResponse: false 
      });
    }
  }, [updateState, addMessage]);

  useEffect(() => {
    // Generate interviewee profile
    generateIntervieweeProfile();

    return () => {
      // Clean up any resources if needed
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const generateIntervieweeProfile = async () => {
    try {
      // Build career changer description
      const careerChangerDetails = careerChanger ? "career changer who switched fields" : "";
      
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
      
      const prompt = `Generate a realistic profile for a ${profession} with ${experience} years of experience${locationDetails ? ` from ${locationDetails}` : ''}${careerChangerDetails ? ` ${careerChangerDetails}` : ''}${careerDetails ? ` ${careerDetails}` : ''}${specificCompany !== 'any' ? ` currently at ${specificCompany}` : ''}.

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
- achievements: Array of notable achievements`;


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
        // Log error details without assigning to a variable
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
            
            // Handle any invalid escape sequences
            fixedJson = fixedJson.replace(/\\([^"\\bfnrtu])/g, '$1');
            
            // Remove any trailing commas in objects and arrays
            fixedJson = fixedJson.replace(/,\s*}/g, '}');
            fixedJson = fixedJson.replace(/,\s*\]/g, ']');
            
            try {
              // Test if valid now
              JSON.parse(fixedJson);
              return fixedJson;
            } catch (innerError) {
              // If still not valid, return a minimal valid object
              console.error('JSON still invalid after aggressive repairs');
              return '{"name":"Fallback Profile","profession":"Professional","experience":[]}';  
            }
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
          name: 'Alex Doe',
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
          achievements: ['Successfully completed multiple projects']
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
  const extractDeltaFromLine = useCallback((line: string): string => {
    if (!line.startsWith("data:")) return "";
    try {
      const json = JSON.parse(line.replace("data: ", ""));
      return json?.delta ?? "";
    } catch (error) {
      console.error("Error parsing delta line:", error);
      return "";
    }
  }, []);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      // Add user message to transcript
      await addMessage({
        role: 'user',
        content: content.trim(),
        isTyping: false
      });

      // Clear input and set loading state
      updateState({ 
        userInput: '',
        isGeneratingResponse: true
      });
      
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: 'Thank you for your message. This is a simulated response.',
          isTyping: false
        });
        updateState({ isGeneratingResponse: false });
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      updateState({ 
        isGeneratingResponse: false,
        error: 'Failed to send message. Please try again.'
      });
    }
  }, [addMessage, updateState]);

  // End the interview
  const endInterview = useCallback(() => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      updateState({ 
        interviewEnded: true,
        isGeneratingResponse: false
      });
      
      // Add a final message
      addMessage({
        role: 'assistant',
        content: 'The interview has ended. Thank you for your time!',
        isTyping: false
      });
    }
  }, [addMessage, updateState]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Interview Session</h1>
                <Link href="/" className="inline-block">
                  <Button variant="outline" size="sm" className="group">
                    <HomeIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                <main className="flex-1 container mx-auto p-4 md:p-6">
                  <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                      {transcript.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                          <FileText className="w-16 h-16 mb-4 text-gray-300" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        transcript.map((message, index) => renderMessage(message, index))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4 bg-white">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (state.userInput.trim()) {
                            handleSendMessage(state.userInput);
                          }
                        }}
                        className="flex gap-2"
                      >
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            value={state.userInput}
                            onChange={(e) => updateState({ userInput: e.target.value })}
                            placeholder="Type your message..."
                            className="w-full pl-4 pr-12 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={state.isGeneratingResponse}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && state.userInput.trim()) {
                                e.preventDefault();
                                handleSendMessage(state.userInput);
                              }
                            }}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-md">
                              ⏎ Enter
                            </kbd>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={!state.userInput.trim() || state.isGeneratingResponse}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {state.isGeneratingResponse ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              Send
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </form>

                      {/* Interview Status */}
                      <div className="mt-3 flex justify-between items-center">
                        <div>
                          {state.interviewStarted && !state.interviewEnded && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></div>
                              Interview in progress
                            </div>
                          )}
                          {state.interviewEnded && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Interview completed
                            </div>
                          )}
                        </div>

                        {state.interviewStarted && !state.interviewEnded && (
                          <button
                            onClick={endInterview}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            End Interview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
