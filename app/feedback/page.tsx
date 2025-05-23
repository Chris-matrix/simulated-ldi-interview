"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { ArrowLeft, Download, Home } from "lucide-react"
import Link from "next/link"

interface Message {
  role: string
  content: string
}

interface InterviewData {
  profession: string
  interviewee: string
  transcript: Message[]
}

export default function Feedback() {
  const router = useRouter()
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [feedback, setFeedback] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve interview data from sessionStorage
    try {
      const storedData = sessionStorage.getItem("interviewData")
      if (!storedData) {
        setError("No interview data found. Please complete an interview first.")
        setIsLoading(false)
        return
      }

      const parsedData = JSON.parse(storedData)
      setInterviewData(parsedData)

      // Generate feedback
      generateFeedback(parsedData)
    } catch (err) {
      console.error("Error retrieving interview data:", err)
      setError("Failed to load interview data. Please try again.")
      setIsLoading(false)
    }
  }, [])

  const generateFeedback = async (data: InterviewData) => {
    try {
      setIsLoading(true)

      // Extract just the conversation text for analysis
      const conversationText = data.transcript
        .map((msg) => `${msg.role === "user" ? "Student" : "Interviewee"}: ${msg.content}`)
        .join("\n\n")

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this Life Design Interview transcript between a student and a ${data.profession} named ${data.interviewee}:

${conversationText}

Provide detailed feedback on the student's interviewing skills. Include:
1. Overall assessment (strengths and areas for improvement)
2. Question quality (depth, relevance, open-endedness)
3. Follow-up skills (how well they built on previous answers)
4. Specific examples of effective questions
5. Missed opportunities or questions they could have asked
6. Recommendations for improvement
7. Key insights gained from the interview

Format the response as JSON with these fields: overallAssessment, strengths (array), areasForImprovement (array), questionQuality, followUpSkills, effectiveQuestions (array), missedOpportunities (array), recommendations (array), keyInsights (array).`,
      })

      const feedbackData = JSON.parse(text)
      setFeedback(feedbackData)
      setIsLoading(false)
    } catch (err) {
      console.error("Error generating feedback:", err)
      setError("Failed to generate feedback. Please try again.")
      setIsLoading(false)
    }
  }

  const downloadTranscript = () => {
    if (!interviewData) return

    const conversationText = interviewData.transcript
      .map((msg) => `${msg.role === "user" ? "Student" : interviewData.interviewee}: ${msg.content}`)
      .join("\n\n")

    const feedbackText = feedback
      ? `\n\n--- FEEDBACK ---\n\n` +
        `Overall Assessment: ${feedback.overallAssessment}\n\n` +
        `Strengths:\n${feedback.strengths.map((s: string) => `- ${s}`).join("\n")}\n\n` +
        `Areas for Improvement:\n${feedback.areasForImprovement.map((a: string) => `- ${a}`).join("\n")}\n\n` +
        `Recommendations:\n${feedback.recommendations.map((r: string) => `- ${r}`).join("\n")}\n\n` +
        `Key Insights:\n${feedback.keyInsights.map((i: string) => `- ${i}`).join("\n")}`
      : ""

    const fullText =
      `LIFE DESIGN INTERVIEW TRANSCRIPT\n` +
      `Profession: ${interviewData.profession}\n` +
      `Interviewee: ${interviewData.interviewee}\n` +
      `Date: ${new Date().toLocaleDateString()}\n\n` +
      `--- TRANSCRIPT ---\n\n` +
      conversationText +
      feedbackText

    const blob = new Blob([fullText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `LDI_${interviewData.profession.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
        <div className="max-w-4xl w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Analyzing your interview...</h2>
          <p className="text-gray-600 mt-2">We're generating personalized feedback on your interviewing skills.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <div className="mt-6">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!interviewData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-xl font-semibold">No interview data found</h2>
          <p className="text-gray-600 mt-2">Please complete an interview first.</p>
          <div className="mt-6">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Interview Feedback</h1>
          <p className="text-gray-600 mt-1">
            {interviewData.profession} • {interviewData.interviewee} • {new Date().toLocaleDateString()}
          </p>
        </div>

        <Tabs defaultValue="feedback" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feedback">Feedback & Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="mt-6">
            {feedback && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback.overallAssessment}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.areasForImprovement.map((area: string, index: number) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Question Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback.questionQuality}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Follow-Up Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feedback.followUpSkills}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Effective Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.effectiveQuestions.map((question: string, index: number) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Missed Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.missedOpportunities.map((opportunity: string, index: number) => (
                          <li key={index}>{opportunity}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {feedback.recommendations.map((recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights Gained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {feedback.keyInsights.map((insight: string, index: number) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transcript" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
                <CardDescription>
                  Conversation between student and {interviewData.interviewee} ({interviewData.profession})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewData.transcript.map((message, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                    <p className="font-semibold text-sm text-gray-500 mb-1">
                      {message.role === "user" ? "Student" : interviewData.interviewee}
                    </p>
                    <p>{message.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Button onClick={downloadTranscript}>
            <Download className="mr-2 h-4 w-4" />
            Download Transcript & Feedback
          </Button>
        </div>
      </div>
    </main>
  )
}
