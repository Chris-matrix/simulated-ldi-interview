import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SampleFeedback() {
  const sampleTranscript = [
    {
      role: "ai",
      content:
        "Hi there! I'm Dr. Sarah Chen, a pediatrician with 15 years of experience. I currently work at Children's Memorial Hospital as the Head of Pediatric Care. I'm happy to chat with you today about my career path and experiences in medicine. What would you like to know?",
    },
    {
      role: "user",
      content:
        "Thanks for speaking with me, Dr. Chen. I'm interested in medicine, particularly pediatrics. Could you tell me about what led you to choose this specialty?",
    },
    {
      role: "ai",
      content:
        "That's a great question. My path to pediatrics was influenced by several experiences. During medical school, I rotated through different specialties, but I found that I connected most with children and their families. There's something special about helping kids during their formative years and seeing them grow healthy and strong.\n\nBut what really cemented my decision was volunteering at a summer camp for children with chronic illnesses during my second year of med school. Seeing these kids with serious health challenges still finding joy and resilience was incredibly moving. I realized I wanted to be part of that journey—not just treating illnesses but supporting their overall development and well-being.\n\nI also appreciated the variety in pediatrics. You're not just treating the physical ailments but considering their developmental, emotional, and social needs too. Every day is different, and the relationships you build with families over years is rewarding in a way I didn't find in other specialties.",
    },
    {
      role: "user",
      content:
        "That's really insightful. What would you say are the biggest challenges you've faced in your career, and how did you overcome them?",
    },
    {
      role: "ai",
      content:
        "The challenges in pediatrics can be both emotional and practical. One of the biggest challenges early in my career was the emotional toll of caring for seriously ill children. There were cases where despite our best efforts, we couldn't save a child, and those moments are devastating. Learning to process that grief while still being present for other patients and their families was difficult.\n\nI overcame this by finding a support network of fellow physicians who understood these experiences. Our hospital also has a good system for debriefing after difficult cases. Over time, I've developed better emotional resilience, though I never want to become so detached that I lose empathy.\n\nAnother significant challenge was work-life balance, especially when my own children were young. The demanding hours and on-call schedules meant missing important moments with my family. I addressed this by setting clearer boundaries, negotiating a more flexible schedule as I advanced in my career, and being fully present when I was home.\n\nThe administrative burden in healthcare has also grown tremendously. The paperwork, electronic health records, and insurance requirements can take away from patient care. I've managed this by advocating for better systems within our hospital and delegating appropriately to our excellent nursing and support staff.\n\nFinally, keeping up with rapidly evolving medical knowledge is a constant challenge. I dedicate specific time each week to reading journals and attending continuing education. Being part of a teaching hospital helps too—the questions from residents and students keep me on my toes!",
    },
    {
      role: "user",
      content:
        "Thank you for sharing that. I'm curious about your typical day. What does your schedule look like, and what aspects of your work do you find most fulfilling?",
    },
    {
      role: "ai",
      content:
        "My typical day starts early—I'm usually at the hospital by 7:00 AM for rounds. As the department head, I see a mix of my own patients and consult on complex cases with our team of pediatricians and specialists.\n\nMornings are often filled with inpatient rounds, checking on children admitted to the hospital. We work as a team with residents, nurses, and specialists to develop and adjust treatment plans. I'll typically have teaching sessions with medical students or residents during this time too.\n\nAfternoons vary—some days I have clinic hours seeing outpatients for well-child visits, managing chronic conditions, or addressing acute illnesses. Other days involve administrative work, department meetings, or research activities. I also reserve time for calling parents with test results or discussing concerns.\n\nAs for the most fulfilling aspects, there are several that keep me passionate about my work. First is witnessing a child recover from a serious illness—seeing them regain their energy and return to normal childhood activities is incredibly rewarding.\n\nI also find great satisfaction in the long-term relationships with families. Watching children grow from infancy through adolescence, guiding their health journey, and becoming a trusted advisor to parents is a privilege.\n\nThe teaching aspect of my role is another source of fulfillment. Mentoring young doctors and medical students, seeing them develop their skills and confidence, feels like I'm multiplying my impact on children's health.\n\nFinally, the moments of connection with my young patients are priceless—when a previously shy or frightened child greets me with a smile or shares their accomplishments. Those small interactions remind me why I chose this path in the first place.",
    },
    {
      role: "user",
      content:
        "That's really helpful to understand. Looking back at your career path, is there anything you would have done differently, or any advice you'd give to someone considering pediatrics today?",
    },
    {
      role: "ai",
      content:
        "That's a thoughtful question. Looking back, there are a few things I might have approached differently.\n\nFirst, I would have sought more mentorship early in my career. I was somewhat independent and tried to figure everything out myself. Having found great mentors later, I realize how much guidance and support they provide—not just clinically but in navigating career decisions and work-life integration.\n\nI also would have been more intentional about self-care from the beginning. There's a culture of self-sacrifice in medicine that can lead to burnout. I pushed myself too hard in my residency and early practice years. Now I understand that taking care of myself makes me a better doctor for my patients.\n\nAs for advice to someone considering pediatrics today:\n\nFirst, get diverse experiences with children before committing. Volunteer in different settings—hospitals, community clinics, schools, camps. Pediatrics requires a genuine connection with children and their families.\n\nSecond, develop excellent communication skills. Much of pediatric care involves translating complex medical information to parents and connecting with children at their developmental level.\n\nThird, be prepared for the emotional aspects of the work. You'll share in families' greatest joys and deepest sorrows. Having healthy coping mechanisms and support systems is essential.\n\nFourth, embrace the preventive aspect of pediatrics. Some of your most important work will be in well-child care, anticipatory guidance, and advocacy—not just treating illnesses.\n\nFinally, recognize that pediatrics is evolving rapidly with advances in genetics, technology, and our understanding of developmental health. Maintain curiosity and a commitment to lifelong learning.\n\nDespite the challenges, pediatrics remains an incredibly rewarding specialty. The opportunity to positively impact a child's entire life trajectory is a profound privilege that continues to inspire me every day.",
    },
    {
      role: "user",
      content:
        "Thank you so much for sharing your experiences and insights, Dr. Chen. This has been incredibly valuable for me as I consider my own path in medicine.",
    },
    {
      role: "ai",
      content:
        "You're very welcome! I'm glad our conversation has been helpful as you explore your potential path in medicine. Your thoughtful questions show you're approaching this decision with the right mindset—considering both the rewards and challenges of the profession.\n\nPediatrics has given me a fulfilling career that aligns with my values and allows me to make a meaningful difference. Whatever specialty you ultimately choose, that alignment between your personal values and your daily work is what will sustain you through the demanding journey of medicine.\n\nStay curious, seek mentors, and trust your instincts about where you can best contribute and find fulfillment.\n\nI wish you the very best in your medical journey! If you have any other questions down the road, don't hesitate to reach out to physicians in your areas of interest. Most of us are happy to share our experiences with the next generation of doctors. Good luck!",
    },
  ]

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
          <h1 className="text-3xl font-bold tracking-tight">Sample Interview Feedback</h1>
          <p className="text-gray-600 mt-1">Pediatrician • Dr. Sarah Chen • Sample Interview</p>
        </div>

        <Tabs defaultValue="feedback" className="w-full">
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
                <CardDescription>Conversation between student and Dr. Sarah Chen (Pediatrician)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleTranscript.map((message, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                    <p className="font-semibold text-sm text-gray-500 mb-1">
                      {message.role === "user" ? "Student" : "Dr. Sarah Chen"}
                    </p>
                    <p>{message.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
