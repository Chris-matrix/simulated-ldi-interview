"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, PauseCircle, PlayCircle, FileText } from "lucide-react"
import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Interview() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewEnded, setInterviewEnded] = useState(false)
  const [intervieweeInfo, setIntervieweeInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get parameters from URL
  const profession = searchParams.get("profession") || "Software Engineer"
  const gender = searchParams.get("gender") || "any"
  const ethnicity = searchParams.get("ethnicity") || "any"
  const region = searchParams.get("region") || "any"
  const experience = searchParams.get("experience") || "10"

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
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a realistic profile for a ${gender !== "any" ? gender : ""} ${ethnicity !== "any" ? ethnicity : ""} ${profession} with ${experience} years of experience ${region !== "any" ? `from ${region}` : ""}. Include: name, age, current role, company, brief background, and career highlights. Format as JSON with fields: name, age, role, company, background, highlights (array), avatarInitials (first letter of first and last name).`,
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
      const result = await streamText({
        model: openai("gpt-4o"),
        system: `You are ${profile.name}, a ${profile.age}-year-old ${profession} with ${experience} years of experience. You work at ${profile.company} as ${profile.role}. Your background: ${profile.background}. Career highlights: ${profile.highlights.join(", ")}. 
        
        You are being interviewed by a student for a Life Design Interview. Be conversational, authentic, and detailed about your career journey. Share insights about your path, decisions, challenges, and lessons learned. Respond as if you're having a real conversation.`,
        prompt:
          "Introduce yourself briefly and let the student know you're ready for their questions about your career path.",
        onChunk: (chunk) => {
          if (chunk.type === "text-delta") {
            setCurrentMessage((prev) => prev + chunk.text)
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
        setTranscript((prev) => [...prev, { role: "user", content: userMessage }])
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

      const result = await streamText({
        model: openai("gpt-4o"),
        system: `You are ${intervieweeInfo.name}, a ${intervieweeInfo.age}-year-old ${profession} with ${experience} years of experience. You work at ${intervieweeInfo.company} as ${intervieweeInfo.role}. 
        
        You are being interviewed by a student for a Life Design Interview. Be conversational, authentic, and detailed about your career journey. Share insights about your path, decisions, challenges, and lessons learned. Respond as if you're having a real conversation.
        
        ${isEndingQuestion ? "This appears to be the end of the interview. Thank the student and offer a final piece of advice." : ""}`,
        prompt: userMessage,
        onChunk: (chunk) => {
          if (chunk.type === "text-delta") {
            setCurrentMessage((prev) => prev + chunk.text)
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
            <Badge variant="outline" className="bg-gray-100">
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
