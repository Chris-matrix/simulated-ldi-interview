"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, PauseCircle, PlayCircle, FileText } from "lucide-react"
import { generateText, streamText } from "ai"
import { playlab } from "@/lib/playlab-ai"
import playlabProvider from "@/lib/ai-config"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define interfaces for type safety
interface IntervieweeInfo {
  name: string;
  age: number;
  role: string;
  company: string;
  background: string;
  education: string;
  highlights: string[];
  avatarInitials: string;
  personalDetails?: string;
}

export default function Interview() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<{role: string, content: string}[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewEnded, setInterviewEnded] = useState(false)
  const [intervieweeInfo, setIntervieweeInfo] = useState<IntervieweeInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }

    // Generate interviewee profile
    generateIntervieweeProfile()

    // Check browser support for SpeechRecognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Your browser doesn't support speech recognition. Try using Chrome or Edge.")
    }

    return () => {
      // Clean up speech recognition and synthesis
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel()
      }
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

      const { text } = await generateText({
        model: playlab("premium"),
        provider: playlabProvider,
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

      const profileData = JSON.parse(text)
      setIntervieweeInfo(profileData)

      // Start the interview with an introduction
      startInterview(profileData)
    } catch (err) {
      console.error("Error generating profile:", err)
      setError("Failed to generate interviewee profile. Please try again.")
    }
  }

  const startInterview = async (profile: any) => {
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

      const result = await streamText({
        model: playlab("premium"),
        provider: playlabProvider,
        system: `You are ${profile.name}, a ${profile.age}-year-old ${profession} with ${experience} years of experience. You work at ${profile.company} as ${profile.role}.

        BACKGROUND INFORMATION:
        - Education: ${profile.education || "Not specified"}
        - Professional background: ${profile.background}
        - Career highlights: ${profile.highlights.join(", ")}
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
          }
        },
      })

      setTranscript((prev) => [...prev, { role: "ai", content: result.text }])
      setCurrentMessage("")
      setInterviewStarted(true)
      setIsGeneratingResponse(false)

      // Speak the introduction
      speakText(result.text)
    } catch (err) {
      console.error("Error starting interview:", err)
      setError("Failed to start the interview. Please try again.")
      setIsGeneratingResponse(false)
    }
  }

  const startListening = () => {
    if (error) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setCurrentMessage("")
    }

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("")

      setCurrentMessage(transcript)
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)

      if (currentMessage.trim()) {
        const userMessage = currentMessage.trim()
        setTranscript((prev: any[]) => [...prev, { role: "user", content: userMessage }])
        setCurrentMessage("")

        // Generate AI response
        await generateAiResponse(userMessage)
      }
    }
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
        intervieweeInfo.personalDetails || ""
      ].filter(Boolean).join(" ");

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

      setTranscript((prev) => [...prev, { role: "ai", content: result.text }])
      setCurrentMessage("")
      setIsGeneratingResponse(false)

      // Speak the response
      speakText(result.text)

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

  const speakText = (text: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    // Create a new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text)

    // Set voice (optional - can be customized based on gender/region)
    const voices = synthRef.current.getVoices()
    if (voices.length > 0) {
      // Try to find a voice that matches gender if specified
      if (gender === "female") {
        const femaleVoice = voices.find((voice) => voice.name.includes("female") || voice.name.includes("Female"))
        if (femaleVoice) utteranceRef.current.voice = femaleVoice
      } else if (gender === "male") {
        const maleVoice = voices.find((voice) => voice.name.includes("male") || voice.name.includes("Male"))
        if (maleVoice) utteranceRef.current.voice = maleVoice
      }
    }

    // Events
    utteranceRef.current.onstart = () => {
      setIsAiSpeaking(true)
    }

    utteranceRef.current.onend = () => {
      setIsAiSpeaking(false)
    }

    utteranceRef.current.onerror = (event) => {
      console.error("Speech synthesis error", event)
      setIsAiSpeaking(false)
    }

    // Speak
    synthRef.current.speak(utteranceRef.current)
  }

  const toggleSpeech = () => {
    if (!synthRef.current) return

    if (isAiSpeaking) {
      synthRef.current.pause()
      setIsAiSpeaking(false)
    } else {
      synthRef.current.resume()
      setIsAiSpeaking(true)
    }
  }

  const endInterview = () => {
    // Navigate to feedback page with interview data
    const interviewData = {
      profession,
      interviewee: intervieweeInfo?.name || "Professional",
      transcript: transcript,
    }

    // Store in sessionStorage for the feedback page
    sessionStorage.setItem("interviewData", JSON.stringify(interviewData))
    router.push("/feedback")
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {intervieweeInfo && (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{intervieweeInfo.avatarInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{intervieweeInfo.name}</h2>
                  <p className="text-sm text-gray-500">
                    {intervieweeInfo.role} at {intervieweeInfo.company}
                  </p>
                </div>
              </>
            )}
          </div>
          <div>
            <Badge className="bg-gray-100">
              {profession} • {experience} years
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Interview transcript */}
          <Card className="mb-4 min-h-[400px] max-h-[60vh] overflow-y-auto">
            <CardContent className="p-4">
              {transcript.length === 0 && !intervieweeInfo && (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
                    <p>Generating your interviewee profile...</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {transcript.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isGeneratingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                      {currentMessage || (
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isListening && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 rounded-lg bg-blue-100 text-blue-900">
                      {currentMessage || (
                        <div className="flex items-center space-x-2">
                          <span>Listening</span>
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          <div
                            className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {interviewStarted && !interviewEnded && (
                <>
                  {isListening ? (
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={stopListening}
                      disabled={isGeneratingResponse || isAiSpeaking}
                    >
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Recording
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={startListening}
                      disabled={isGeneratingResponse || isAiSpeaking || error !== null}
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Start Recording
                    </Button>
                  )}

                  {isAiSpeaking ? (
                    <Button variant="outline" size="lg" onClick={toggleSpeech}>
                      <PauseCircle className="mr-2 h-5 w-5" />
                      Pause Speech
                    </Button>
                  ) : (
                    transcript.length > 0 && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleSpeech}
                        disabled={!synthRef.current || !utteranceRef.current}
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Resume Speech
                      </Button>
                    )
                  )}
                </>
              )}
            </div>

            {interviewEnded && (
              <Button variant="default" size="lg" onClick={endInterview}>
                <FileText className="mr-2 h-5 w-5" />
                View Feedback & Transcript
              </Button>
            )}
          </div>

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
  )
}
