"use client"

/**
 * Sample Feedback Page Component
 * 
 * This component displays the feedback and transcript for a completed interview.
 * It loads interview data from session storage and provides a tabbed interface
 * to switch between feedback analysis and the full conversation transcript.
 */

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Star, AlertCircle, CheckCircle2, Lightbulb, FileText } from "lucide-react"

/**
 * Represents a single message in the interview transcript
 */
interface Message {
  role: string;           // 'user' or 'assistant'
  content: string;        // The message content
  timestamp?: Date;        // When the message was sent
  isTyping?: boolean;      // Whether the message is currently being typed
}

/**
 * Represents the interview data structure stored in session storage
 */
interface InterviewData {
  profession: string;     // The profession being interviewed about
  interviewee: string;    // Name of the interviewee
  transcript: Message[];  // Array of messages in the conversation
  timestamp: string;      // When the interview was completed (ISO string)
}

/**
 * SampleFeedback Component
 * 
 * Displays feedback and transcript for a completed interview.
 * Loads data from session storage and provides navigation between views.
 */
export default function SampleFeedback() {
  // State management
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"feedback" | "transcript">("feedback");

  /**
   * Load interview data from session storage when component mounts
   */
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        const savedData = sessionStorage.getItem("interviewData");
        if (savedData) {
          // Parse and validate the saved interview data
          const parsedData = JSON.parse(savedData) as InterviewData;
          setInterviewData(parsedData);
        }
      } catch (error) {
        console.error("Error loading interview data:", error);
      } finally {
        // Always set loading to false when done
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Render loading state while data is being loaded
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-muted-foreground">Loading your interview data...</p>
        </div>
      </div>
    );
  }

  /**
   * Render error state when no interview data is found
   */
  if (!interviewData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <FileText 
          className="w-16 h-16 text-muted-foreground mb-4" 
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold mb-2">No Interview Data Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find any interview data to display. This might be because:
        </p>
        <ul className="text-left list-disc pl-5 mb-6 text-muted-foreground space-y-2">
          <li>The interview wasn't properly saved</li>
          <li>You've cleared your browser's session storage</li>
          <li>You're accessing this page directly without completing an interview</li>
        </ul>
        <Link href="/" aria-label="Return to home page">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  // Extract transcript from interview data, defaulting to empty array if not available
  const transcript = interviewData.transcript || [];
  
  /**
   * Sample feedback data structure
   * In a production environment, this would likely come from an API
   * or be generated based on the interview content
   */

  const sampleFeedback = {
    overallAssessment:
      "The student demonstrated strong interviewing skills throughout this Life Design Interview with Dr. Chen. The questions were thoughtfully structured, open-ended, and built logically upon each other to explore the interviewee's career journey, challenges, daily experiences, and reflections. The student maintained a professional tone while establishing rapport, which encouraged detailed and insightful responses from Dr. Chen.",
    strengths: [
      "Asked open-ended questions that elicited detailed responses",
      "Followed a logical progression from career choice to challenges to daily work to reflective advice",
      "Expressed appreciation and active listening between questions",
      "Maintained a professional yet conversational tone throughout the interview",
      "Successfully uncovered both practical aspects of the profession and emotional/personal dimensions",
    ],
    areasForImprovement: [
      "Could have asked more follow-up questions to specific points mentioned by Dr. Chen",
      "Might have explored work-life balance challenges in more depth",
      "Could have inquired about specific patient cases or memorable moments for more vivid insights",
      "Did not explore the interviewee's educational journey in detail",
      "Could have asked about future trends or changes in pediatrics",
    ],
    questionQuality:
      "The questions were well-crafted and demonstrated thoughtful preparation. They were appropriately open-ended, allowing Dr. Chen to share detailed narratives rather than simple yes/no answers. The student's questions touched on key aspects of career development: motivation ('what led you'), challenges, daily experiences, and reflective advice. This comprehensive approach helped paint a complete picture of the pediatrician's professional life.",
    followUpSkills:
      "The student showed basic follow-up skills by acknowledging Dr. Chen's responses before moving to the next question. However, there were missed opportunities to dig deeper into specific aspects mentioned in Dr. Chen's answers. For example, when Dr. Chen mentioned the emotional toll of caring for seriously ill children, the student could have asked for a specific example of how she handled a particularly difficult case.",
    effectiveQuestions: [
      '"Could you tell me about what led you to choose this specialty?" - This question effectively uncovered both practical and emotional motivations',
      '"What would you say are the biggest challenges you\'ve faced in your career, and how did you overcome them?" - This comprehensive question revealed multiple dimensions of professional challenges',
      '"What does your schedule look like, and what aspects of your work do you find most fulfilling?" - This two-part question efficiently gathered both practical information and value-based insights',
      '"Is there anything you would have done differently, or any advice you\'d give to someone considering pediatrics today?" - This reflective question yielded valuable wisdom and perspective',
    ],
    missedOpportunities: [
      "Could have asked about specific mentors or influential figures in Dr. Chen's career development",
      "Might have explored the transition from being primarily clinical to taking on leadership responsibilities as department head",
      "Could have inquired about how technology has changed pediatric practice during her 15-year career",
      "Did not ask about compensation, financial aspects, or economic challenges in the field",
      "Could have explored how pediatrics compares to other medical specialties from her perspective",
    ],
    recommendations: [
      "Practice asking more spontaneous follow-up questions based on interesting details shared by the interviewee",
      "Consider preparing a few questions about the interviewee's educational journey and training experiences",
      "Include questions about industry trends, changes, and future directions in the field",
      "Explore the personal side of career development by asking about influential relationships and pivotal moments",
      "When appropriate, ask for specific stories or examples that illustrate key points the interviewee makes",
    ],
    keyInsights: [
      "Experiential factors (volunteering with chronically ill children) can be more influential in specialty choice than academic factors",
      "Emotional resilience and support networks are crucial for managing the difficult aspects of pediatric care",
      "Work-life balance challenges require intentional boundary-setting and career planning",
      "Long-term relationships with patients and families provide significant professional fulfillment in pediatrics",
      "Mentorship and self-care are areas that experienced professionals often wish they had prioritized earlier",
      "Communication skills are particularly important in pediatrics for connecting with both children and parents",
    ],
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interview Feedback</h1>
          <p className="text-gray-600 mt-1">
            {interviewData.profession} • {interviewData.interviewee} • {new Date(interviewData.timestamp).toLocaleDateString()}
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "feedback" | "transcript")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feedback">Feedback & Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{sampleFeedback.overallAssessment}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sampleFeedback.strengths.map((strength, index) => (
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
                      {sampleFeedback.areasForImprovement.map((area, index) => (
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
                  <p>{sampleFeedback.questionQuality}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follow-Up Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{sampleFeedback.followUpSkills}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Effective Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {sampleFeedback.effectiveQuestions.map((question, index) => (
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
                      {sampleFeedback.missedOpportunities.map((opportunity, index) => (
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
                    {sampleFeedback.recommendations.map((recommendation, index) => (
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
                    {sampleFeedback.keyInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
                <CardDescription>
                  Conversation between you and {interviewData.interviewee} ({interviewData.profession})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcript.length > 0 ? (
                  transcript.map((message, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <p className={`font-semibold text-sm mb-1 ${
                        message.role === "user" ? "text-blue-600" : "text-gray-600"
                      }`}>
                        {message.role === "user" ? "You" : interviewData.interviewee}
                      </p>
                      <p className="text-gray-800 whitespace-pre-line">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No transcript available for this interview.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {interviewData && (
          <div className="w-full space-y-6 mt-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <CardTitle>Interview Completed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p>Your interview has been successfully completed and analyzed. Below is your performance feedback.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <CardTitle>Your Performance Rating</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  ))}
                  <Star className="h-6 w-6 text-gray-300 fill-gray-300" />
                  <span className="ml-2 text-gray-600">4/5 - Very Good</span>
                </div>
                <p className="text-gray-700">
                  You demonstrated strong interviewing skills with well-structured questions and good follow-up. 
                  Your ability to build rapport with the interviewee was excellent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                  <CardTitle>Areas for Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Deeper Follow-ups</h4>
                    <p className="text-sm text-gray-600">Try to ask more follow-up questions to explore interesting points in more depth.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Personal Connection</h4>
                    <p className="text-sm text-gray-600">Share a bit more about yourself to create a stronger connection with the interviewee.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab(activeTab === "feedback" ? "transcript" : "feedback")}
            >
              {activeTab === "feedback" ? (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  View Transcript
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  View Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
