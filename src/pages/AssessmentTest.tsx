import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Logo from '@/components/Logo';
import { Brain, Code, Users, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trophy, Target, BookOpen, Rocket, ChevronRight, Award, TrendingUp, Lightbulb } from 'lucide-react';
// Add this import at the top
// Timer functionality removed as it was unused

// API configuration from RecommendationForm
const API_KEY = "Replace_Your_APIKey";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface SectionResult {
  score: number;
  totalQuestions: number;
  percentage: number;
}

const AssessmentTest = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'aptitude' | 'technical' | 'hr' | 'results'>('aptitude');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [results, setResults] = useState({
    aptitude: { score: 0, totalQuestions: 5, percentage: 0 },
    technical: { score: 0, totalQuestions: 5, percentage: 0 },
    hr: { score: 0, totalQuestions: 5, percentage: 0 }
  });
  const [jobRecommendation, setJobRecommendation] = useState('');

  const generateQuestions = async (section: 'aptitude' | 'technical' | 'hr') => {
    setLoading(true);
    try {
      // Extended fallback questions for each section
      const questionBank = {
        aptitude: [
          {
            question: "If 3x + 7 = 22, what is the value of x?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "5"
          },
          {
            question: "What comes next in the sequence: 2, 4, 8, 16, __?",
            options: ["20", "24", "32", "36"],
            correctAnswer: "32"
          },
          {
            question: "If a train travels 300 km in 4 hours, what is its speed in km/h?",
            options: ["65", "70", "75", "80"],
            correctAnswer: "75"
          },
          {
            question: "Complete the analogy: Bird : Sky :: Fish : ?",
            options: ["Water", "Land", "Air", "Sea"],
            correctAnswer: "Water"
          },
          {
            question: "What percentage of 200 is 50?",
            options: ["20%", "25%", "30%", "35%"],
            correctAnswer: "25%"
          },
          {
            question: "If 5 workers can complete a task in 6 days, how many days will 3 workers take?",
            options: ["8", "10", "12", "15"],
            correctAnswer: "10"
          },
          {
            question: "Which number is missing: 1, 4, 9, 16, 25, __, 49",
            options: ["36", "35", "34", "33"],
            correctAnswer: "36"
          },
          {
            question: "If A=1, B=2, C=3, what is the value of CAB?",
            options: ["312", "123", "321", "213"],
            correctAnswer: "312"
          },
          {
            question: "What is 15% of 200?",
            options: ["25", "30", "35", "40"],
            correctAnswer: "30"
          },
          {
            question: "If today is Tuesday, what day will it be after 100 days?",
            options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            correctAnswer: "Thursday"
          },
          {
            question: "Find the odd one out: Square, Circle, Triangle, Cylinder, Rectangle",
            options: ["Square", "Circle", "Cylinder", "Rectangle"],
            correctAnswer: "Cylinder"
          },
          {
            question: "If 8 is 4% of x, what is x?",
            options: ["200", "150", "250", "300"],
            correctAnswer: "200"
          },
          {
            question: "Complete the series: 2, 6, 12, 20, __",
            options: ["30", "28", "32", "26"],
            correctAnswer: "30"
          },
          {
            question: "If a clock shows 3:45, what is the angle between the hour and minute hands?",
            options: ["157.5°", "165°", "172.5°", "180°"],
            correctAnswer: "172.5°"
          },
          {
            question: "What is the next letter in the sequence: A, C, F, J, __?",
            options: ["N", "O", "P", "Q"],
            correctAnswer: "O"
          }
        ],
        technical: [
          {
            question: "What is the time complexity of quicksort in the average case?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            correctAnswer: "O(n log n)"
          },
          {
            question: "Which of these is not a JavaScript data type?",
            options: ["undefined", "boolean", "float", "symbol"],
            correctAnswer: "float"
          },
          {
            question: "What is the purpose of the 'useEffect' hook in React?",
            options: [
              "To handle side effects in components",
              "To create new components",
              "To style components",
              "To route between pages"
            ],
            correctAnswer: "To handle side effects in components"
          },
          {
            question: "What is a closure in JavaScript?",
            options: [
              "A function that has access to variables in its outer scope",
              "A way to close browser windows",
              "A method to end loops",
              "A type of array"
            ],
            correctAnswer: "A function that has access to variables in its outer scope"
          },
          {
            question: "Which HTTP method is idempotent?",
            options: ["GET", "POST", "PATCH", "DELETE"],
            correctAnswer: "GET"
          },
          {
            question: "What is the purpose of Redux in React applications?",
            options: [
              "State management",
              "Routing",
              "Form validation",
              "API calls"
            ],
            correctAnswer: "State management"
          },
          {
            question: "What is the difference between == and === in JavaScript?",
            options: [
              "=== checks type and value, == only checks value",
              "They are the same",
              "== checks type and value, === only checks value",
              "=== is used for strings only"
            ],
            correctAnswer: "=== checks type and value, == only checks value"
          },
          {
            question: "What is a RESTful API?",
            options: [
              "An API that follows REST architectural constraints",
              "An API that only uses GET requests",
              "An API that requires authentication",
              "An API that uses only JSON"
            ],
            correctAnswer: "An API that follows REST architectural constraints"
          },
          {
            question: "What is the purpose of Git branching?",
            options: [
              "To work on features independently",
              "To delete code",
              "To merge repositories",
              "To compile code"
            ],
            correctAnswer: "To work on features independently"
          },
          {
            question: "What is the role of a constructor in OOP?",
            options: [
              "To initialize object properties",
              "To destroy objects",
              "To copy objects",
              "To compare objects"
            ],
            correctAnswer: "To initialize object properties"
          },
          {
            question: "What is the purpose of async/await in JavaScript?",
            options: [
              "To handle asynchronous operations",
              "To create loops",
              "To define variables",
              "To style components"
            ],
            correctAnswer: "To handle asynchronous operations"
          },
          {
            question: "What is CSS Box Model?",
            options: [
              "Content, padding, border, and margin",
              "Only content and border",
              "Only margin and padding",
              "Headers and footers"
            ],
            correctAnswer: "Content, padding, border, and margin"
          },
          {
            question: "What is the purpose of TypeScript?",
            options: [
              "To add static typing to JavaScript",
              "To replace JavaScript",
              "To style web pages",
              "To handle HTTP requests"
            ],
            correctAnswer: "To add static typing to JavaScript"
          },
          {
            question: "What is JWT used for?",
            options: [
              "User authentication",
              "Database queries",
              "File compression",
              "Code compilation"
            ],
            correctAnswer: "User authentication"
          },
          {
            question: "What is the purpose of Docker?",
            options: [
              "To containerize applications",
              "To write JavaScript code",
              "To style web pages",
              "To manage databases"
            ],
            correctAnswer: "To containerize applications"
          }
        ],
        hr: [
          {
            question: "How do you handle conflicts in a team?",
            options: [
              "Address issues directly and find common ground",
              "Ignore the conflict",
              "Report to HR immediately",
              "Take sides"
            ],
            correctAnswer: "Address issues directly and find common ground"
          },
          {
            question: "What is your approach to meeting tight deadlines?",
            options: [
              "Prioritize tasks and communicate with stakeholders",
              "Work overtime without informing anyone",
              "Request deadline extension immediately",
              "Delegate all tasks to others"
            ],
            correctAnswer: "Prioritize tasks and communicate with stakeholders"
          },
          // ... Add more HR questions (continue with the pattern)
        ]
      };

      // Randomly select 5 questions from the question bank
      const selectedQuestions = shuffleArray(questionBank[section]).slice(0, 5);
      setQuestions(selectedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this utility function at the top of your component
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateJobRecommendation = async (results: any) => {
    try {
      const prompt = `
        Based on the following assessment results:
        Aptitude: ${results.aptitude.percentage}%
        Technical: ${results.technical.percentage}%
        HR: ${results.hr.percentage}%
        
        Recommend suitable job roles and career paths. Consider the following:
        1. Strong areas (highest scoring sections)
        2. Areas for improvement
        3. 3-4 specific job role recommendations
        4. Career development suggestions
      `;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      });

      const data = await response.json();
      setJobRecommendation(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    }
  };

  useEffect(() => {
    generateQuestions('aptitude');
  }, []);

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setResults(prev => ({
        ...prev,
        [currentSection]: {
          ...prev[currentSection],
          score: prev[currentSection].score + 1,
          percentage: ((prev[currentSection].score + 1) / prev[currentSection].totalQuestions) * 100
        }
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      if (currentSection === 'aptitude') {
        setCurrentSection('technical');
        generateQuestions('technical');
      } else if (currentSection === 'technical') {
        setCurrentSection('hr');
        generateQuestions('hr');
      } else {
        setCurrentSection('results');
        generateJobRecommendation(results);
      }
    }
  };

  const renderSection = (section: 'aptitude' | 'technical' | 'hr') => {
    const icons = {
      aptitude: <Brain className="w-6 h-6" />,
      technical: <Code className="w-6 h-6" />,
      hr: <Users className="w-6 h-6" />
    };

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            {icons[section]}
            <CardTitle className="capitalize">{section} Assessment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h3>
                <p className="text-gray-700">{questions[currentQuestionIndex]?.question}</p>
              </div>

              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <label htmlFor={`option-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                className="mt-6 w-full"
                onClick={handleAnswer}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Next Section' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-eduBlue/10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Trophy className="w-16 h-16 mx-auto text-eduBlue mb-4" />
            <CardTitle className="text-3xl font-heading">Assessment Results</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(results).map(([section, result], index) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute -top-2 -right-2">
                  <Award className={`w-8 h-8 ${result.percentage >= 70 ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-white to-eduBlue/5 border border-eduBlue/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {section === 'aptitude' && <Target className="w-5 h-5 text-eduBlue" />}
                    {section === 'technical' && <Code className="w-5 h-5 text-eduBlue" />}
                    {section === 'hr' && <Users className="w-5 h-5 text-eduBlue" />}
                    <h3 className="text-xl font-semibold capitalize font-heading">{section}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-eduBlue font-heading">
                        {result.percentage.toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {result.score}/{result.totalQuestions}
                      </p>
                    </div>
                    <TrendingUp className={`w-6 h-6 ${result.percentage >= 70 ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg bg-white p-6 border border-eduBlue/10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-eduBlue" />
              <h3 className="text-2xl font-bold font-heading">Career Recommendations</h3>
            </div>
            <div className="prose max-w-none">
              {jobRecommendation ? (
                <div className="space-y-4">
                  {jobRecommendation.split('\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-gray-700 leading-relaxed font-sans"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-eduBlue" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              className="w-full bg-eduBlue hover:bg-eduBlue/90 text-white font-medium transition-all duration-300 transform hover:scale-[1.02]"
              onClick={() => navigate('/landing')}
            >
              Return to Dashboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduBlue/20 via-white to-eduYellow/20">
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-eduBlue/20">
        <div className="container-custom flex justify-between items-center h-16">
          <Logo />
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-eduBlue" />
            <h1 className="text-2xl font-bold text-eduBlue">Skill Assessment</h1>
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        {currentSection === 'results' ? renderResults() : renderSection(currentSection)}
      </main>
    </div>
  );
};

export default AssessmentTest;
