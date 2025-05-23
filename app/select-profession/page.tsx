"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const professions = [
  "Software Engineer",
  "Doctor",
  "Lawyer",
  "Teacher",
  "Entrepreneur",
  "Designer",
  "Marketing Executive",
  "Financial Analyst",
  "Architect",
  "Scientist",
  "Journalist",
  "Chef",
  "Social Worker",
  "HR Professional",
  "Product Manager",
]

export default function SelectProfession() {
  const router = useRouter()
  const [profession, setProfession] = useState("")
  const [customProfession, setCustomProfession] = useState("")
  const [gender, setGender] = useState("")
  const [ethnicity, setEthnicity] = useState("")
  const [region, setRegion] = useState("")
  const [yearsExperience, setYearsExperience] = useState([10])
  const [showCustom, setShowCustom] = useState(false)

  const handleProfessionChange = (value: string) => {
    if (value === "custom") {
      setShowCustom(true)
      setProfession("")
    } else {
      setShowCustom(false)
      setProfession(value)
    }
  }

  const handleSubmit = () => {
    const selectedProfession = showCustom ? customProfession : profession
    const params = new URLSearchParams({
      profession: selectedProfession,
      gender: gender || "any",
      ethnicity: ethnicity || "any",
      region: region || "any",
      experience: yearsExperience[0].toString(),
    })

    router.push(`/interview?${params.toString()}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
      <div className="max-w-2xl w-full">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Select Interview Parameters</CardTitle>
            <CardDescription>
              Choose the profession and demographics of the person you'd like to interview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Select onValueChange={handleProfessionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom profession...</SelectItem>
                </SelectContent>
              </Select>

              {showCustom && (
                <div className="mt-2">
                  <Input
                    id="customProfession"
                    placeholder="Enter profession"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity (Optional)</Label>
              <Select onValueChange={setEthnicity}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                  <SelectItem value="indigenous">Indigenous</SelectItem>
                  <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region (Optional)</Label>
              <Select onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                  <SelectItem value="south-america">South America</SelectItem>
                  <SelectItem value="australia">Australia/Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="experience">Years of Experience</Label>
                <span className="text-sm text-gray-500">{yearsExperience[0]} years</span>
              </div>
              <Slider
                id="experience"
                min={1}
                max={40}
                step={1}
                value={yearsExperience}
                onValueChange={setYearsExperience}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={!profession && !customProfession}>
              Start Interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
