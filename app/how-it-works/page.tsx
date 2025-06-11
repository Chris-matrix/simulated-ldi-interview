import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mic, FileText } from "lucide-react"

export default function HowItWorks() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The Life Design Interview Simulator uses AI to create realistic interview experiences with professionals in
            your field of interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <CardTitle>1. Select a Profession</CardTitle>
              </div>
              <CardDescription>Choose who you want to interview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Start by selecting a profession you're interested in exploring. You can also specify demographic
                preferences like years of experience, gender, ethnicity, and region to create a diverse range of
                perspectives.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Mic className="h-6 w-6 text-gray-600" />
                <CardTitle>2. Voice Conversation(future-feature pending)</CardTitle>
              </div>
              <CardDescription>Speak naturally with the AI professional</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                The simulator will be possibly include speech recognition to capture your questions and text-to-speech to deliver responses.
                This creates a natural, conversational experience that mimics a real interview. Ask about their career
                path, decisions, challenges, and advice.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <CardTitle>3. AI-Generated Responses</CardTitle>
              </div>
              <CardDescription>Get authentic career insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Our AI creates realistic professional profiles with detailed backgrounds, career trajectories, and
                experiences. The responses are tailored to the profession and demographic details you selected,
                providing authentic perspectives on career paths.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <CardTitle>4. Feedback & Transcript</CardTitle>
              </div>
              <CardDescription>Review and improve your interviewing skills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                After the interview, you'll receive a detailed transcript along with personalized feedback on your
                interviewing skills. The feedback highlights your strengths, areas for improvement, and suggestions for
                more effective questions to ask in future interviews.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-4">Tips for Effective Life Design Interviews</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Ask open-ended questions that can't be answered with just "yes" or "no"</li>
            <li>Focus on the person's journey and decision-making process, not just facts about the job</li>
            <li>Inquire about challenges they've faced and how they overcame them</li>
            <li>Ask about what they find most meaningful in their work</li>
            <li>Explore how their career path has evolved over time</li>
            <li>Ask for advice they would give to someone interested in their field</li>
            <li>Follow up on interesting points to dig deeper into their experiences</li>
          </ul>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Link href="/select-profession">
            <Button size="lg">Start an Interview</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
