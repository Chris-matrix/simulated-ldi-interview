'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Sparkles, CheckCircle2, AlertCircle, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

type Experience = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
};

type ResumeData = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
};

type ResumeAnalysis = {
  score: number;
  strengths: string[];
  improvements: string[];
  atsScore: number;
  suggestions: string[];
};

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('builder');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experiences: [
      {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ],
    education: [
      {
        id: crypto.randomUUID(),
        degree: '',
        institution: '',
        graduationYear: '',
      },
    ],
    skills: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: crypto.randomUUID(),
          title: '',
          company: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    if (resumeData.experiences.length > 1) {
      setResumeData(prev => ({
        ...prev,
        experiences: prev.experiences.filter(exp => exp.id !== id),
      }));
    }
  };

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analysis - in a real app, this would come from an API
      const mockAnalysis: ResumeAnalysis = {
        score: 78,
        atsScore: 85,
        strengths: [
          'Strong action verbs in experience descriptions',
          'Good use of quantifiable achievements',
          'Clear and concise summary',
        ],
        improvements: [
          'Could add more metrics to quantify achievements',
          'Consider adding a skills section with relevant technologies',
          'Include more industry-specific keywords',
        ],
        suggestions: [
          'Tailor your resume to the job description',
          'Use more action verbs like "Led", "Developed", "Implemented"',
          'Keep resume to 1-2 pages maximum',
        ],
      };
      
      setAnalysis(mockAnalysis);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadResume = (format: 'json' | 'pdf' = 'json') => {
    if (format === 'json') {
      // Download as JSON
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Resume downloaded as JSON');
    } else {
      // In a real app, this would generate a PDF
      // For now, we'll just show a message
      toast.info('PDF export would be generated here in a production app');
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          // Basic validation of the uploaded JSON
          if (data.name && data.experiences) {
            setResumeData(data);
            toast.success('Resume imported successfully');
          } else {
            throw new Error('Invalid resume format');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          toast.error('Invalid resume file. Please upload a valid JSON resume.');
        }
      };
      reader.readAsText(file);
    } else {
      // In a real app, you would parse PDF/DOCX here
      toast.info('File uploaded. In a real app, we would parse the resume content.');
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const resetResume = () => {
    if (confirm('Are you sure you want to start a new resume? This will clear all current data.')) {
      setResumeData({
        name: '',
        email: '',
        phone: '',
        summary: '',
        experiences: [{
          id: crypto.randomUUID(),
          title: '',
          company: '',
          startDate: '',
          endDate: '',
          description: '',
        }],
        education: [{
          id: crypto.randomUUID(),
          degree: '',
          institution: '',
          graduationYear: '',
        }],
        skills: '',
      });
      toast.success('Started a new resume');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-background shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">Resume Builder</CardTitle>
                <CardDescription className="mt-1">
                  Create and optimize your resume for better job opportunities
                </CardDescription>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button asChild variant="outline" className="hidden sm:flex">
                  <Link href="/">← Back to Home</Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
                <TabsTrigger value="builder">Resume Builder</TabsTrigger>
                <TabsTrigger value="analysis" disabled={!analysis}>
                  {analysis ? 'Analysis' : 'Analysis (Complete Builder First)'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder">
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input
                            name="name"
                            value={resumeData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            name="email"
                            type="email"
                            value={resumeData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            name="phone"
                            value={resumeData.phone}
                            onChange={handleInputChange}
                            placeholder="(123) 456-7890"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="summary"
                        value={resumeData.summary}
                        onChange={handleInputChange}
                        placeholder="Experienced professional with a strong background in..."
                        rows={4}
                        className="min-h-[120px]"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                      <CardTitle className="text-xl">Work Experience</CardTitle>
                      <Button size="sm" onClick={addExperience}>
                        Add Experience
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.experiences.map((exp, index) => (
                        <div key={exp.id} className="p-4 border rounded-lg relative">
                          {index > 0 && (
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              aria-label="Remove experience"
                            >
                              ×
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Job Title</label>
                              <Input
                                value={exp.title}
                                onChange={(e) =>
                                  handleExperienceChange(exp.id, 'title', e.target.value)
                                }
                                placeholder="Senior Software Engineer"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Company</label>
                              <Input
                                value={exp.company}
                                onChange={(e) =>
                                  handleExperienceChange(exp.id, 'company', e.target.value)
                                }
                                placeholder="Company Name"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Start Date</label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) =>
                                  handleExperienceChange(exp.id, 'startDate', e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">End Date</label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) =>
                                  handleExperienceChange(exp.id, 'endDate', e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) =>
                                handleExperienceChange(exp.id, 'description', e.target.value)
                              }
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Degree</label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                setResumeData(prev => ({
                                  ...prev,
                                  education: prev.education.map(ed =>
                                    ed.id === edu.id ? { ...ed, degree: e.target.value } : ed
                                  ),
                                }))
                              }
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Institution</label>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                setResumeData(prev => ({
                                  ...prev,
                                  education: prev.education.map(ed =>
                                    ed.id === edu.id ? { ...ed, institution: e.target.value } : ed
                                  ),
                                }))
                              }
                              placeholder="University Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Graduation Year</label>
                            <Input
                              type="number"
                              value={edu.graduationYear}
                              onChange={(e) =>
                                setResumeData(prev => ({
                                  ...prev,
                                  education: prev.education.map(ed =>
                                    ed.id === edu.id ? { ...ed, graduationYear: e.target.value } : ed
                                  ),
                                }))
                              }
                              placeholder="2020"
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="skills"
                        value={resumeData.skills}
                        onChange={handleInputChange}
                        placeholder="List your skills separated by commas (e.g., JavaScript, React, Project Management)"
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => downloadResume('json')}
                        disabled={isAnalyzing}
                        className="flex-1 sm:flex-none"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Download JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => downloadResume('pdf')}
                        disabled={isAnalyzing}
                        className="flex-1 sm:flex-none"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleImportClick}
                        disabled={isAnalyzing}
                        className="flex-1 sm:flex-none"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".json,.pdf,.doc,.docx"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={resetResume}
                        disabled={isAnalyzing}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                      >
                        New Resume
                      </Button>
                    </div>
                    <div className="w-full">
                      <Button
                        onClick={analyzeResume}
                        disabled={isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Analyze Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-8">
                {analysis && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Resume Analysis</CardTitle>
                        <CardDescription>
                          Your resume has been analyzed. Here are the results and suggestions for improvement.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Overall Score</h3>
                            <div className="text-4xl font-bold text-primary">
                              {analysis.score}/100
                            </div>
                            <div className="w-full bg-muted rounded-full h-4 mt-2">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${analysis.score}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">ATS Compatibility</h3>
                            <div className="text-4xl font-bold text-primary">
                              {analysis.atsScore}/100
                            </div>
                            <div className="w-full bg-muted rounded-full h-4 mt-2">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${analysis.atsScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                Strengths
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.strengths.map((strength, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center">
                                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                                Areas for Improvement
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {analysis.improvements.map((improvement, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-amber-500 mr-2">•</span>
                                    <span>{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Suggestions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {analysis.suggestions.map((suggestion, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-blue-500 mr-2">💡</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                      <Button onClick={() => setActiveTab('builder')}>
                        Back to Builder
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
