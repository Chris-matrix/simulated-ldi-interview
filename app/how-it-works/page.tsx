import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

export default function HowItWorks() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">How It Works</h1>
          <p className="text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto">
            The Life Design Interview Simulator uses AI to create realistic interview experiences with professionals in
            your field of interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-gray-900 dark:text-white">1. Select a Profession</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">Choose who you want to interview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 dark:text-gray-200">
                Start by selecting a profession you're interested in exploring. You can also specify demographic
                preferences like years of experience, gender, ethnicity, and region to create a diverse range of
                perspectives.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-gray-900 dark:text-white">2. AI-Generated Responses</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">Get authentic career insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 dark:text-gray-200">
                Our AI creates realistic professional profiles with detailed backgrounds, career trajectories, and
                experiences. The responses are tailored to the profession and demographic details you selected,
                providing authentic perspectives on career paths.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-gray-900 dark:text-white">3. Feedback & Transcript</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">Review and improve your interviewing skills</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 dark:text-gray-200">
                After the interview, you'll receive a detailed transcript along with personalized feedback on your
                interviewing skills. The feedback highlights your strengths, areas for improvement, and suggestions for
                more effective questions to ask in future interviews.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tips for Effective Life Design Interviews</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
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
            <Button variant="outline" className="text-gray-900 dark:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Link href="/select-profession">
            <Button size="lg" className="text-white">
              Start an Interview
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
