import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen } from 'lucide-react';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';

// Sample data arrays
const techStacks = ["React", "Angular", "Vue", "Node.js", "Python", "Java"];
const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist"];
const salaryRanges = ["$50k-75k", "$75k-100k", "$100k-125k", "$125k-150k", "$150k+"];

// Gemini API configuration
const API_KEY = "Replace_Your_APIKey";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const RecommendationForm = () => {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState('');
  const [role, setRole] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const generateJobDescription = async () => {
    if (!techStack || !role || !salaryRange) {
      setError("Please select all required fields.");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const prompt = `
        Generate a comprehensive job description for a ${role} position.
        Technical skills required: ${techStack}
        Salary range: ${salaryRange}
        Additional information: ${additionalDetails || "None provided"}
        
        Format the job description with the following sections:
        1. Company Overview
        2. Role Summary
        3. Key Responsibilities
        4. Required Qualifications
        5. Preferred Qualifications
        6. Benefits and Perks
        7. Application Process
      `;

      const requestBody = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      };

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }

    } catch (err: any) {
      console.error("Error calling Gemini API:", err);
      setError(`Error generating job description: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduBlue/20 via-white to-eduYellow/20">
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-eduBlue/20">
        <div className="container-custom flex justify-between items-center h-16">
          <Logo />
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-eduBlue" />
            <h1 className="text-2xl font-bold text-eduBlue">Job Resource</h1>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-black">Job Description Generator</CardTitle>
              <CardDescription>Generate tailored job descriptions based on your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tech Stack</label>
                  <Select onValueChange={setTechStack} value={techStack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tech Stack" />
                    </SelectTrigger>
                    <SelectContent>
                      {techStacks.map((tech) => (
                        <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary Range</label>
                  <Select onValueChange={setSalaryRange} value={salaryRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Salary Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Add any specific requirements or preferences..."
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="min-h-[100px] border-eduBlue/20"
                />
              </div>

              {error && (
                <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                onClick={generateJobDescription}
                disabled={loading}
                className="w-full bg-eduBlue hover:bg-eduBlue/90"
              >
                {loading ? 'Generating...' : 'Generate Job Description'}
              </Button>

              {response && (
                <Card className="mt-6 border-eduBlue/20">
                  <CardHeader>
                    <CardTitle className="text-black">Generated Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap">{response}</div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecommendationForm;
