import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Mic, FileText, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Life Design Interview Simulator</h1>
          <p className="text-xl text-gray-600">
            Practice interviewing professionals in careers you're interested in exploring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Select a Profession</CardTitle>
              <CardDescription>Choose from various career paths</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center py-4">
                <MessageSquare className="h-12 w-12 text-gray-600" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/select-profession" className="w-full">
                <Button className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Voice Interview</CardTitle>
              <CardDescription>Speak naturally with AI professionals</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center py-4">
                <Mic className="h-12 w-12 text-gray-600" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/how-it-works" className="w-full">
                <Button variant="outline" className="w-full">
                  How It Works
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Get Feedback</CardTitle>
              <CardDescription>Receive transcript and improve skills</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center py-4">
                <FileText className="h-12 w-12 text-gray-600" />
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/sample-feedback" className="w-full">
                <Button variant="outline" className="w-full">
                  View Sample
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">About Life Design Interviews</h2>
          <p className="text-gray-700">
            Life Design Interviews (LDIs) are intentional conversations where students ask questions about a
            professional's career path, decision-making, and lessons learned. These interviews help clarify your own
            goals and imagine possible futures.
          </p>
          <div className="mt-6">
            <Link href="/select-profession">
              <Button size="lg" className="w-full md:w-auto">
                Start Your Interview Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
