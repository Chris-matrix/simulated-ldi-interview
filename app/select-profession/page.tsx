"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Briefcase, Globe, Users } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

interface ProfessionFormData {
  profession: string;
  gender: string;
  ethnicity: string;
  region: string;
  experience: number;
  education: string;
  industry: string;
  companyType: string;
  specificCompany: string;
  workStyle: string;
  city: string;
  country: string;
  firstGeneration: boolean;
  careerChanger: boolean;
  immigrantBackground: boolean;
}

const professions = [
  { category: "Technology", jobs: [
    "Software Engineer", "Data Scientist", "UX Designer", "Product Manager", "Cybersecurity Specialist",
    "AI/ML Engineer", "DevOps Engineer", "Technical Writer", "IT Project Manager", "QA Engineer"
  ]},
  { category: "Healthcare", jobs: [
    "Doctor", "Nurse", "Pharmacist", "Physical Therapist", "Dentist", "Veterinarian",
    "Medical Researcher", "Healthcare Administrator", "Nutritionist", "Mental Health Counselor"
  ]},
  { category: "Business", jobs: [
    "Financial Analyst", "Marketing Executive", "Management Consultant", "Human Resources Manager",
    "Entrepreneur", "Business Analyst", "Investment Banker", "Accountant", "Supply Chain Manager", "Sales Director"
  ]},
  { category: "Creative", jobs: [
    "Graphic Designer", "Journalist", "Architect", "Fashion Designer", "Film Director",
    "Photographer", "Interior Designer", "Game Developer", "Content Creator", "Musician"
  ]},
  { category: "Education & Research", jobs: [
    "Teacher", "Professor", "Research Scientist", "Librarian", "Education Administrator",
    "Curriculum Developer", "School Counselor", "Educational Psychologist", "Academic Advisor", "Special Education Teacher"
  ]},
  { category: "Public Service", jobs: [
    "Social Worker", "Lawyer", "Police Officer", "Firefighter", "Government Official",
    "Urban Planner", "Diplomat", "Nonprofit Manager", "Environmental Scientist", "Public Health Specialist"
  ]},
  { category: "Trades & Services", jobs: [
    "Chef", "Electrician", "Plumber", "Carpenter", "Mechanic",
    "Hairstylist", "Real Estate Agent", "Flight Attendant", "Hotel Manager", "Personal Trainer"
  ]}
]

const educationLevels = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD/Doctorate",
  "Professional Degree (MD, JD, etc.)",
  "Trade/Vocational Training",
  "Self-taught"
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Entertainment",
  "Government",
  "Nonprofit",
  "Energy",
  "Transportation",
  "Construction",
  "Hospitality",
  "Agriculture",
  "Media"
]

const companyTypes = [
  "Startup",
  "Small Business",
  "Medium Enterprise",
  "Large Corporation",
  "Multinational",
  "Government Agency",
  "Nonprofit Organization",
  "Self-employed/Freelance",
  "Academic Institution"
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
  const [education, setEducation] = useState("")
  const [industry, setIndustry] = useState("")
  const [companyType, setCompanyType] = useState("")
  const [specificCompany, setSpecificCompany] = useState("")
  const [workStyle, setWorkStyle] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [firstGeneration, setFirstGeneration] = useState(false)
  const [careerChanger, setCareerChanger] = useState(false)
  const [immigrantBackground, setImmigrantBackground] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  
  // Load previously saved form data when component mounts
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem("professionFormData")
      if (savedData) {
        const parsedData: ProfessionFormData = JSON.parse(savedData)
        
        // Restore form state from saved data
        if (parsedData.profession) {
          // Check if it's a standard profession or custom one
          const isPredefinedProfession = professions.some(category => 
            category.jobs.includes(parsedData.profession)
          )
          
          if (isPredefinedProfession) {
            setProfession(parsedData.profession)
            setShowCustom(false)
          } else {
            setCustomProfession(parsedData.profession)
            setShowCustom(true)
          }
        }
        
        // Restore other form fields
        setGender(parsedData.gender !== "any" ? parsedData.gender : "")
        setEthnicity(parsedData.ethnicity !== "any" ? parsedData.ethnicity : "")
        setRegion(parsedData.region !== "any" ? parsedData.region : "")
        setYearsExperience([parsedData.experience])
        setEducation(parsedData.education !== "any" ? parsedData.education : "")
        setIndustry(parsedData.industry !== "any" ? parsedData.industry : "")
        setCompanyType(parsedData.companyType !== "any" ? parsedData.companyType : "")
        setSpecificCompany(parsedData.specificCompany !== "any" ? parsedData.specificCompany : "")
        setWorkStyle(parsedData.workStyle !== "any" ? parsedData.workStyle : "")
        setCity(parsedData.city !== "any" ? parsedData.city : "")
        setCountry(parsedData.country !== "any" ? parsedData.country : "")
        setFirstGeneration(parsedData.firstGeneration)
        setCareerChanger(parsedData.careerChanger)
        setImmigrantBackground(parsedData.immigrantBackground)
      }
    } catch (error) {
      console.error("Error loading saved form data:", error)
      // Don't show error to user, just silently fail and use default values
    }
  }, []) // Empty dependency array ensures this runs only once on mount

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
    // Reset any previous errors
    setFormError(null)
    
    const selectedProfession = showCustom ? customProfession : profession
    
    // Validate required fields
    if (!selectedProfession) {
      setFormError("Please select or enter a profession")
      return
    }
    
    // Create form data object with proper types
    const formData: ProfessionFormData = {
      profession: selectedProfession,
      gender: gender || "any",
      ethnicity: ethnicity || "any",
      region: region || "any",
      experience: yearsExperience[0],
      education: education || "any",
      industry: industry || "any",
      companyType: companyType || "any",
      specificCompany: specificCompany || "any",
      workStyle: workStyle || "any",
      city: city || "any",
      country: country || "any",
      firstGeneration: firstGeneration,
      careerChanger: careerChanger,
      immigrantBackground: immigrantBackground
    }
    
    try {
      // Convert to URL parameters
      const params = new URLSearchParams({
        profession: formData.profession,
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        region: formData.region,
        experience: formData.experience.toString(),
        education: formData.education,
        industry: formData.industry,
        companyType: formData.companyType,
        specificCompany: formData.specificCompany,
        workStyle: formData.workStyle,
        city: formData.city,
        country: formData.country,
        firstGeneration: formData.firstGeneration.toString(),
        careerChanger: formData.careerChanger.toString(),
        immigrantBackground: formData.immigrantBackground.toString()
      })
      
      // Save form data to session storage for potential future use
      sessionStorage.setItem("professionFormData", JSON.stringify(formData))
      
      // Navigate to interview page
      router.push(`/interview?${params.toString()}`)
    } catch (error) {
      console.error("Error processing form data:", error)
      setFormError("An error occurred while processing your request. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
      <div className="max-w-3xl w-full">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Interview Experience</CardTitle>
            <CardDescription>
              Customize the professional you'd like to interview based on career, demographics, and background
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profession" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profession" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Career
                </TabsTrigger>
                <TabsTrigger value="demographics" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Demographics
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Location
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profession" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select onValueChange={handleProfessionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a profession" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {professions.map((category) => (
                        <SelectGroup key={category.category}>
                          <SelectLabel>{category.category}</SelectLabel>
                          {category.jobs.map((job) => (
                            <SelectItem key={job} value={job}>
                              {job}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomProfession(e.target.value)}
                      />
                    </div>
                  )}
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

                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select onValueChange={setEducation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind.toLowerCase().replace(/\s+/g, '-')}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type</Label>
                  <Select onValueChange={setCompanyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {companyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specificCompany">Specific Company (Optional)</Label>
                  <Input
                    id="specificCompany"
                    placeholder="e.g. Google, NASA, etc."
                    value={specificCompany}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpecificCompany(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workStyle">Work Style</Label>
                  <Select onValueChange={setWorkStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="in-office">In-Office</SelectItem>
                      <SelectItem value="field-work">Field Work</SelectItem>
                      <SelectItem value="travel-heavy">Travel-Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Career Background</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="career-changer" checked={careerChanger} onCheckedChange={(checked: boolean | 'indeterminate') => setCareerChanger(checked === true)} />
                    <label htmlFor="career-changer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Career changer (switched fields)
                    </label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="demographics" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="transgender">Transgender</SelectItem>
                      <SelectItem value="genderqueer">Genderqueer</SelectItem>
                      <SelectItem value="genderfluid">Genderfluid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select onValueChange={setEthnicity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                      <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                      <SelectItem value="indigenous">Indigenous</SelectItem>
                      <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="multiracial">Multiracial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="first-gen" checked={firstGeneration} onCheckedChange={(checked: boolean | 'indeterminate') => setFirstGeneration(checked === true)} />
                      <label htmlFor="first-gen" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        First-generation college graduate
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="immigrant" checked={immigrantBackground} onCheckedChange={(checked: boolean | 'indeterminate') => setImmigrantBackground(checked === true)} />
                      <label htmlFor="immigrant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Immigrant or first-generation American
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
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
                      <SelectItem value="middle-east">Middle East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country (Optional)</Label>
                  <Input
                    id="country"
                    placeholder="e.g. United States, Japan, etc."
                    value={country}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City (Optional)</Label>
                  <Input
                    id="city"
                    placeholder="e.g. New York, London, etc."
                    value={city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            {formError && (
              <div className="w-full p-3 mb-2 text-sm text-red-700 bg-red-100 rounded-md">
                {formError}
              </div>
            )}
            <div className="flex justify-between w-full">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </Link>
              <Button onClick={handleSubmit} disabled={!profession && !customProfession}>
                Start Interview <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
