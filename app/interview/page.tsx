"use client"

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { ArrowRight, FileText } from 'lucide-react';

// Utils & AI
import { generateText, streamText } from "ai"
import { playlab } from "@/lib/playlab-ai"

// Import using ES modules syntax
import playlabProvider from "@/lib/ai-config";

// Types
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
};

interface IntervieweeInfo {
  name: string;
  profession: string;
  experience: string;
  skills: string[];
  education: string;
  age?: number;
  role?: string;
  company?: string;
  background?: string;
  highlights?: string[];
  avatarInitials?: string;
  personalDetails?: string;
}

export default function Interview() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // State management
  const [transcript, setTranscript] = React.useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [userInput, setUserInput] = React.useState('');
  const [interviewStarted, setInterviewStarted] = React.useState(false);
  const [interviewEnded, setInterviewEnded] = React.useState(false);
  const [intervieweeInfo, setIntervieweeInfo] = React.useState<IntervieweeInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Message management functions
  const addMessage = React.useCallback((message: Message) => {
    setTranscript((prev: Message[]) => [...prev, message]);
  }, []);
  
  const updateMessage = React.useCallback((index: number, update: Partial<Message>) => {
    setTranscript((prev: Message[]) => prev.map((msg, i) => 
      i === index ? { ...msg, ...update } : msg
    ));
  }, []);
  
  const renderMessage = (message: Message, index: number): JSX.Element => {
    return (
      <div key={index} className={`message ${message.role}`}>
        {message.content}
      </div>
    );
  };
  
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

  React.useEffect(() => {
    // Generate interviewee profile
    generateIntervieweeProfile()

    return () => {
      // Clean up any resources if needed
    }
  }, [])

  React.useEffect(() => {
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

      const result = await generateText({
        model: playlab("premium") as any,
        provider: playlabProvider as any,
        prompt: `Generate a realistic profile for a ${demographicDetails} ${profession} with ${experience} years of experience ${locationDetails ? `from ${locationDetails}` : ""} ${careerDetails}${specificCompany !== "any" ? ` currently at ${specificCompany}` : ""}.
        
        Include: name, age (appropriate for career stage), current role, company, brief background, education history, and career highlights. The profile should feel authentic and detailed.
        
        Format as JSON with these fields: 
        - name: Full name
        - age: Number
        - role: Current job title
        - company: Current employer${specificCompany !== "any" ? ` (use ${specificCompany})` : ""}
        - background: 2-3 sentence personal and professional background
        - education: Brief education history
        - highlights: Array of 3-5 career achievements or milestones
        - avatarInitials: First letter of first and last name
        - personalDetails: Additional relevant personal details based on demographic selections`,
      })

      const profileData = JSON.parse(result.text) as IntervieweeInfo
      setIntervieweeInfo(profileData)

      // Start the interview with an introduction
      startInterview(profileData)
    } catch (err) {
      console.error("Error generating profile:", err)
      setError("Failed to generate interviewee profile. Please try again.")
    }
  }

  const startInterview = async (profile: IntervieweeInfo): Promise<void> => {
    try {
      setIsGeneratingResponse(true)
      
      // Build a detailed system prompt using all profile information
      const careerDetails = [
        education !== "any" ? `I have a ${education.replace(/-/g, ' ')} education background.` : "",
        industry !== "any" ? `I work in the ${industry.replace(/-/g, ' ')} industry.` : "",
        companyType !== "any" ? `My company is a ${companyType.replace(/-/g, ' ')}.` : "",
        workStyle !== "any" ? `I work ${workStyle.replace(/-/g, ' ')}.` : "",
        careerChanger ? "I changed careers earlier in my professional life." : ""
      ].filter(Boolean).join(" ");
      
      const locationDetails = [
        region !== "any" ? `I'm based in ${region.replace(/-/g, ' ')}.` : "",
        country !== "any" ? `I live in ${country}.` : "",
        city !== "any" ? `I'm located in ${city}.` : ""
      ].filter(Boolean).join(" ");
      
      const personalDetails = [
        firstGeneration ? "I'm a first-generation college graduate." : "",
        immigrantBackground ? "I have an immigrant background or am a first-generation American." : "",
        profile.personalDetails || ""
      ].filter(Boolean).join(" ");

      let fullResponse = ""
      const result = await streamText({
        model: playlab("premium"),
        provider: playlabProvider,
        system: `You are ${profile.name}, a ${profile.age}-year-old ${profession} with ${experience} years of experience. You work at ${profile.company} as ${profile.role}.

        BACKGROUND INFORMATION:
        - Education: ${profile.education || "Not specified"}
        - Professional background: ${profile.background}
        - Career highlights: ${profile.highlights?.join(", ") || 'None provided'}
        - ${careerDetails}
        - ${locationDetails}
        - ${personalDetails}
        
        INTERVIEW STYLE:
        You are being interviewed by a student for a Life Design Interview. Be conversational, authentic, and detailed about your career journey. Share insights about your path, decisions, challenges, and lessons learned. Respond as if you're having a real conversation.
        
        When appropriate, mention specific details from your background, like your education, location, company type, or personal journey. Make your answers feel personalized and authentic based on your specific profile.
        
        Avoid generic responses. Instead, draw from your specific experiences, challenges, and insights based on your unique career path and background.`,
        prompt:
          "Introduce yourself briefly and let the student know you're ready for their questions about your career path. Include a few relevant personal details that make your introduction feel authentic.",
        onChunk: (chunk: any) => {
          if (chunk.type === "text-delta") {
            setCurrentMessage((prev: string) => prev + chunk.text)
            fullResponse += chunk.text
          }
        },
      })

      setTranscript((prev) => [...prev, { role: "assistant", content: result.text, timestamp: new Date() }])
      setCurrentMessage("")
      setInterviewStarted(true)
      setIsGeneratingResponse(false)

      // Interview started successfully
    } catch (err) {
      console.error("Error starting interview:", err)
      setError("Failed to start the interview. Please try again.")
      setIsGeneratingResponse(false)
    }
  }

  const handleSendMessage = async (userInput: string): Promise<void> => {
    if (!userInput.trim() || isGeneratingResponse) return;
    
    const userMessage = userInput.trim();
    setTranscript((prev: Message[]) => [...prev, { role: "user" as const, content: userMessage, timestamp: new Date() }]);
    setUserInput("");
    
    // Generate AI response
    await generateAiResponse(userMessage);
  }

  const generateAiResponse = async (userMessage: string) => {
    try {
      setIsGeneratingResponse(true)
      let fullResponse = ""

      // Check if this is an ending question
      const isEndingQuestion =
        /thank you|thanks for your time|that's all|that concludes|wrap up|end the interview/i.test(userMessage)

      // Build a detailed system prompt using all profile information
      const careerDetails = [
        education !== "any" ? `I have a ${education.replace(/-/g, ' ')} education background.` : "",
        industry !== "any" ? `I work in the ${industry.replace(/-/g, ' ')} industry.` : "",
        companyType !== "any" ? `My company is a ${companyType.replace(/-/g, ' ')}.` : "",
        workStyle !== "any" ? `I work ${workStyle.replace(/-/g, ' ')}.` : "",
        careerChanger ? "I changed careers earlier in my professional life." : ""
      ].filter(Boolean).join(" ");
      
      const locationDetails = [
        region !== "any" ? `I'm based in ${region.replace(/-/g, ' ')}.` : "",
        country !== "any" ? `I live in ${country}.` : "",
        city !== "any" ? `I'm located in ${city}.` : ""
      ].filter(Boolean).join(" ");
      
      const personalDetails = [
        firstGeneration ? "I'm a first-generation college graduate." : "",
        immigrantBackground ? "I have an immigrant background or am a first-generation American." : "",
        intervieweeInfo?.personalDetails || ""
      ].filter(Boolean).join(" ");

      // Ensure intervieweeInfo exists before accessing its properties
      if (!intervieweeInfo) {
        throw new Error("Interviewee information is not available");
      }

      const result = await streamText({
        model: playlab("premium"),
        provider: playlabProvider,
        system: `You are ${intervieweeInfo.name}, a ${intervieweeInfo.age}-year-old ${profession} with ${experience} years of experience. You work at ${intervieweeInfo.company} as ${intervieweeInfo.role}.

        BACKGROUND INFORMATION:
        - Education: ${intervieweeInfo.education || "Not specified"}
        - Professional background: ${intervieweeInfo.background}
        - Career highlights: ${intervieweeInfo.highlights.join(", ")}
        - ${careerDetails}
        - ${locationDetails}
        - ${personalDetails}
        
        INTERVIEW STYLE:
        You are being interviewed by a student for a Life Design Interview. Be conversational, authentic, and detailed about your career journey. Share insights about your path, decisions, challenges, and lessons learned. Respond as if you're having a real conversation.
        
        When appropriate, mention specific details from your background, like your education, location, company type, or personal journey. Make your answers feel personalized and authentic based on your specific profile.
        
        Avoid generic responses. Instead, draw from your specific experiences, challenges, and insights based on your unique career path and background.
        
        ${isEndingQuestion ? "This appears to be the end of the interview. Thank the student warmly, offer a final piece of advice based on your specific career journey, and express hope that the conversation was helpful for their career exploration." : ""}`,
        prompt: userMessage,
        onChunk: (chunk: any) => {
          if (chunk.type === "text-delta") {
            setCurrentMessage((prev: string) => prev + chunk.text)
            fullResponse += chunk.text
          }
        },
      })

      setTranscript((prev) => [...prev, { role: "assistant", content: result.text, timestamp: new Date() }])
      setCurrentMessage("")
      setIsGeneratingResponse(false)

      // Response generated successfully

      // Check if this is the end of the interview
      if (isEndingQuestion) {
        setInterviewEnded(true)
      }
    } catch (err) {
      console.error("Error generating response:", err)
      setError("Failed to generate a response. Please try again.")
      setIsGeneratingResponse(false)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage(userInput);
    }
  };

  const endInterview = (): void => {
    const interviewData = {
      profession,
      interviewee: intervieweeInfo?.name || "Professional",
      transcript: transcript,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem("interviewData", JSON.stringify(interviewData));
    }
    router.push("/feedback");
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Interview Start Card */}
          {!interviewStarted && !interviewEnded && (
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Welcome to Your Mock Interview</h2>
                  <p className="text-gray-600">
                    You'll be interviewing {intervieweeInfo?.name || 'a professional'} for a {profession} position.
                  </p>
                  <Button onClick={() => startInterview(intervieweeInfo!)}>
                    Start Interview
                  </Button>
                </div>
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
              <Input
                type="text"
                placeholder="Type your question here..."
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isGeneratingResponse}
                className="flex-grow"
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
