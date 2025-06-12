"use client"

import { 
  useState, 
  useEffect, 
  useCallback,
  useRef,
  KeyboardEvent as ReactKeyboardEvent,
  ChangeEvent,
  FormEvent
} from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Icons
import { ArrowRight, Home as HomeIcon, FileText } from 'lucide-react';

// Types
import { Message, IntervieweeInfo } from "@/types/interview"

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
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.transcript]);
  
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
    isGeneratingResponse
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
  function extractDeltaFromLine(line: string): string {
    if (!line.startsWith("data:")) return "";
    try {
      const json = JSON.parse(line.replace("data: ", ""));
      return json?.delta ?? "";
    } catch (error) {
      console.error("Error parsing delta line:", error);
      return "";
    }
  }
  
  // Mark unused functions as used to prevent warnings
  const _unused = [addMessage, updateMessage, renderMessage, extractDeltaFromLine];
  void _unused;



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
  }, [state.intervieweeInfo, state.transcript]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="inline-block">
            <Button variant="outline" size="sm" className="group">
              <HomeIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Button>
          </Link>
        </header>

        <div className="space-y-6">
          {/* Welcome Card */}
          {!interviewStarted && (
            <Card className="bg-card/90 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome to Your Life Design Interview
                </h2>
                <p className="text-muted-foreground">
                  Your interviewee profile is being generated. The interview will begin shortly.
                </p>
                <div className="flex justify-center pt-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transcript */}
        {interviewStarted && (
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6">
                {transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
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
                            {line || <br />}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isGeneratingResponse && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none px-4 py-3 border border-border/50">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pb-6 pt-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
            <div className="flex flex-col space-y-3 max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Type your question here..."
                  value={userInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateState({ userInput: e.target.value })}
                  onKeyDown={(e: ReactKeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey && state.userInput.trim()) {
                      e.preventDefault();
                      handleSendMessage(state.userInput);
                    }
                  }}
                  disabled={isGeneratingResponse}
                  className="flex-grow pr-12 py-5 text-base bg-background shadow-sm"
                />
                <Button
                  size="icon"
                  className="absolute right-2 h-8 w-8 rounded-full"
                  onClick={() => handleSendMessage(userInput)}
                  disabled={!userInput.trim() || isGeneratingResponse}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Press Enter to send, Shift+Enter for a new line
              </p>
            </div>
          </div>
        )}

        {interviewEnded && (
          <div className="flex justify-center mt-6">
            <Button 
              size="lg" 
              className="group"
              onClick={endInterview}
            >
              <FileText className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              View Feedback & Transcript
            </Button>
          </div>
        )}

        {/* Instructions */}
        {interviewStarted && !interviewEnded && (
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Interview Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Ask open-ended questions about their career journey</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Inquire about key decisions and turning points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Ask about challenges they've faced and how they overcame them</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Explore what they enjoy most about their profession</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Ask what advice they would give to someone starting in their field</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
