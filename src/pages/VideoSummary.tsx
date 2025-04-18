import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, Save } from 'lucide-react';
import axios from 'axios';

const VideoSummaryGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPoints, setIsGeneratingPoints] = useState(false);
  const [generatedPoints, setGeneratedPoints] = useState<string[]>([]);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [videoData, setVideoData] = useState({
    title: 'Video Title Will Appear Here',
    duration: '15:30',
    channel: 'Educational Channel',
    thumbnail: '/api/placeholder/180/120',
    summary: '',
    keyPoints: [],
    readingTime: '5 min',
    pointCount: 10,
    accuracy: '95%',
    keywords: ['education', 'learning', 'tutorial', 'how-to'],
    relatedVideos: [
      { title: 'Related Video 1', publishedAt: '2023-01-15' },
      { title: 'Related Video 2', publishedAt: '2023-02-20' },
      { title: 'Related Video 3', publishedAt: '2023-03-10' },
    ]
  });

  // Effect to slowly display the key points
  useEffect(() => {
    if (isGeneratingPoints && currentPointIndex < generatedPoints.length) {
      const timer = setTimeout(() => {
        setVideoData(prev => ({
          ...prev,
          keyPoints: [...prev.keyPoints, generatedPoints[currentPointIndex]]
        }));
        setCurrentPointIndex(currentPointIndex + 1);
      }, 500 + Math.random() * 1000); // Random delay between 500ms and 1500ms
      
      return () => clearTimeout(timer);
    } else if (isGeneratingPoints && currentPointIndex >= generatedPoints.length) {
      setIsGeneratingPoints(false);
      setIsLoading(false);
    }
  }, [isGeneratingPoints, currentPointIndex, generatedPoints]);

  const getVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const keywords = text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => 
        word.length > 3 && 
        !commonWords.has(word)
      );
    
    const keywordCount: Record<string, number> = {};
    keywords.forEach(word => {
      keywordCount[word] = (keywordCount[word] || 0) + 1;
    });

    return Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  // Intro phrase templates that will be randomly selected
  const introPhrases = [
    "The video explains in detail",
    "A key highlight discusses",
    "A detailed examination shows",
    "A comprehensive overview shows",
    "The video delves into",
    "The discussion elaborates on",
    "The content thoroughly covers",
    "The analysis demonstrates",
    "The presenter explains",
    "The tutorial walks through",
    "The lecture focuses on",
    "The speaker emphasizes",
    "An in-depth look reveals",
    "The course material presents",
    "The video breaks down",
    "The instructor highlights",
    "The explanation clarifies",
    "The demonstration showcases",
    "The video illustrates",
    "The content dives deep into"
  ];

  // Get a random intro phrase that's different from the last used one
  const getRandomUniqueIntroPhrase = (usedPhrases: string[]): string => {
    // Filter out already used phrases
    const availablePhrases = introPhrases.filter(phrase => !usedPhrases.includes(phrase));
    
    // If we've used all phrases, reset
    if (availablePhrases.length === 0) {
      return introPhrases[Math.floor(Math.random() * introPhrases.length)];
    }
    
    // Return a random phrase from the available ones
    return availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
  };

  // Extract meaningful phrases from description text
  const extractMeaningfulPhrases = (description: string): string[] => {
    if (!description) return [];
    
    // Split description into sentences
    const sentences = description
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter(s => s.trim().length > 15); // Filter out very short sentences
    
    // Extract phrases from sentences
    const phrases = [];
    
    sentences.forEach(sentence => {
      // Clean the sentence
      const cleanSentence = sentence.trim();
      
      if (cleanSentence.length > 20) {
        phrases.push(cleanSentence);
      }
    });
    
    return phrases;
  };

  // Generate key points from video description with unique intro phrases
  const generateKeyPoints = (description: string, topicHints: string[] = []): string[] => {
    // Extract base phrases from description
    const extractedPhrases = extractMeaningfulPhrases(description);
    
    // Track used intro phrases to avoid repetition
    const usedIntroPhrases: string[] = [];
    
    // If we have enough phrases from the description, use those
    if (extractedPhrases.length >= 5) {
      return extractedPhrases
        .slice(0, 10)
        .map(phrase => {
          const introPhrase = getRandomUniqueIntroPhrase(usedIntroPhrases);
          usedIntroPhrases.push(introPhrase);
          return `${introPhrase} ${phrase}`;
        });
    }
    
    // Fallback to synthetic content generation based on topic hints
    return generateSyntheticPoints(topicHints, usedIntroPhrases);
  };

  const generateSyntheticPoints = (topicHints: string[], usedIntroPhrases: string[] = []): string[] => {
    // Determine main topic based on hints
    let mainTopic = 'default';
    const topicMap = {
      'pyspark': ['pyspark', 'spark', 'apache spark', 'data processing'],
      'azure': ['azure', 'microsoft cloud', 'cloud computing', 'microsoft'],
      'databricks': ['databricks', 'data analytics', 'big data', 'delta lake'],
      'python': ['python', 'programming', 'coding', 'development'],
      'data engineering': ['data engineering', 'etl', 'data pipeline', 'data warehouse'],
      'machine learning': ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning']
    };
    
    for (const [topic, keywords] of Object.entries(topicMap)) {
      for (const hint of topicHints) {
        if (keywords.some(keyword => hint.toLowerCase().includes(keyword))) {
          mainTopic = topic;
          break;
        }
      }
      if (mainTopic !== 'default') break;
    }
    
    // Content templates based on main topic
    const contentTemplates = {
      'pyspark': [
        "setting up PySpark environments for optimal performance",
        "data engineering interview questions with practical examples",
        "building end-to-end Azure data engineering projects with PySpark",
        "Databricks certified course materials for data engineers",
        "PySpark optimization techniques for big data workloads",
        "real-time data processing with PySpark streaming",
        "implementing machine learning pipelines using PySpark MLlib",
        "connecting PySpark to various data sources including SQL and NoSQL databases",
        "debugging and troubleshooting common PySpark issues",
        "PySpark best practices for production environments"
      ],
      'azure': [
        "Azure Data Factory implementation for modern ETL workflows",
        "Azure Synapse Analytics for enterprise data warehousing",
        "integrating Azure services in a data engineering ecosystem",
        "Azure DevOps pipelines for continuous integration and deployment",
        "security best practices for Azure data services",
        "Azure Kubernetes Service for containerized data applications",
        "serverless data processing with Azure Functions",
        "cost optimization strategies for Azure data solutions",
        "Azure cognitive services for intelligent data enrichment",
        "monitoring and logging Azure data platforms"
      ],
      'databricks': [
        "Databricks architecture and workspace configuration",
        "Delta Lake optimizations for data reliability",
        "MLflow integration for machine learning lifecycle management",
        "Databricks SQL analytics capabilities and implementation",
        "optimizing Databricks cluster configurations for cost and performance",
        "implementing data governance in Databricks environments",
        "ETL pipeline design patterns in Databricks",
        "integrating Databricks with enterprise data sources",
        "performance tuning for Spark jobs in Databricks",
        "implementing CI/CD for Databricks notebooks"
      ],
      'python': [
        "advanced Python data structures for efficient programming",
        "Python for data engineering workflows and pipelines",
        "Pandas and NumPy for data manipulation and analysis",
        "asynchronous programming with Python's asyncio",
        "Python testing frameworks and test-driven development",
        "performance optimization techniques for Python applications",
        "modern Python package management with Poetry",
        "implementing machine learning models with scikit-learn",
        "data visualization best practices with Python libraries",
        "deploying Python applications using Docker containers"
      ],
      'data engineering': [
        "designing scalable data pipelines for enterprise applications",
        "implementing data quality frameworks in ETL processes",
        "real-time vs. batch processing in modern data architectures",
        "data modeling techniques for various storage paradigms",
        "implementing data governance and lineage tracking",
        "metadata management strategies for data catalogs",
        "performance tuning techniques for data pipelines",
        "designing fault-tolerant ETL workflows",
        "implementing CDC (Change Data Capture) in data pipelines",
        "data engineering patterns for cloud-native applications"
      ],
      'machine learning': [
        "feature engineering techniques for predictive models",
        "evaluating and improving model performance metrics",
        "deploying machine learning models to production",
        "implementing MLOps practices for model lifecycle",
        "explainable AI techniques for model interpretability",
        "handling imbalanced datasets in classification problems",
        "implementing ensemble methods for improved accuracy",
        "hyperparameter tuning strategies for model optimization",
        "time series forecasting techniques and applications",
        "deep learning architectures for various problem domains"
      ],
      'default': [
        "key concepts and fundamental principles",
        "important methodologies and frameworks",
        "implementation strategies and best practices",
        "performance optimizations and benchmarks",
        "advanced topics and expert techniques",
        "practical applications and case studies",
        "common challenges and their solutions",
        "integration with related technologies",
        "real-world examples and demonstrations",
        "future trends and upcoming developments"
      ]
    };
    
    // Get content templates for selected main topic
    const templates = contentTemplates[mainTopic as keyof typeof contentTemplates] || contentTemplates.default;
    
    // Generate key points by combining unique intro phrases with content templates
    return templates.map(template => {
      const introPhrase = getRandomUniqueIntroPhrase(usedIntroPhrases);
      usedIntroPhrases.push(introPhrase);
      return `${introPhrase} ${template}`;
    });
  };

  const generateMockRelatedVideos = (keywords: string[]) => {
    const videoTemplates = [
      {
        title: "Complete Guide to {keyword}",
        description: "Learn everything about {keyword} in this comprehensive tutorial."
      },
      {
        title: "Understanding {keyword} - Deep Dive",
        description: "An in-depth exploration of {keyword} concepts."
      },
      {
        title: "{keyword} Masterclass",
        description: "Master the fundamentals of {keyword} with practical examples."
      },
      {
        title: "{keyword} Tips and Tricks",
        description: "Essential tips for working with {keyword}."
      },
      {
        title: "Advanced {keyword} Techniques",
        description: "Take your {keyword} skills to the next level."
      }
    ];

    const relatedVideos = [];
    keywords.forEach(keyword => {
      const template = videoTemplates[Math.floor(Math.random() * videoTemplates.length)];
      relatedVideos.push({
        id: Math.random().toString(36).substr(2, 9),
        title: template.title.replace('{keyword}', keyword),
        description: template.description.replace('{keyword}', keyword),
        thumbnail: `/api/placeholder/300/180?text=${encodeURIComponent(keyword)}`,
        publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    return relatedVideos;
  };

  const formatDuration = (duration: string) => {
    // Implement duration formatting if needed
    return duration;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createYouTubeSearchURL = (title: string) => {
    const searchQuery = encodeURIComponent(title);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  // Parse video metadata from YouTube
  const parseVideoMetadata = (videoId: string, mockData = true) => {
    if (mockData) {
      // Sample descriptions that might be found in real videos
      const sampleDescriptions = [
        `This comprehensive course covers PySpark for data engineers, Azure data engineering, Databricks certified course materials, and Python programming for big data applications. Learn interview techniques, real-world project scenarios, and hands-on exercises.`,
        
        `In this in-depth tutorial, you'll learn everything about data engineering with PySpark and Azure. We cover data transformation techniques, ETL pipeline design, performance optimization, and integration with cloud services. Perfect for beginners and advanced users alike who want to master big data processing.`,
        
        `Join me as we explore the world of data engineering using PySpark and Azure. This video covers essential concepts such as data lakes, data warehousing, real-time processing, and batch analytics. I'll also show you how to implement production-ready solutions with Databricks and demonstrate optimization techniques for large-scale data processing.`,
        
        `This is a full end-to-end tutorial on building data engineering pipelines with PySpark and Azure. Topics include: configuring development environments, designing efficient data models, implementing parallel processing, handling data quality issues, and deploying solutions to production. Ideal for data engineers preparing for interviews or real-world projects.`
      ];
      
      // Randomly select a description
      const randomDescription = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
      
      // Sample titles
      const sampleTitles = [
        "Data Engineering with PySpark and Azure: Complete Guide",
        "PySpark for Data Engineers: Azure Integration Masterclass",
        "Azure Data Engineering with PySpark: From Beginner to Expert",
        "Databricks & PySpark: Ultimate Data Engineering Tutorial"
      ];
      
      // Randomly select a title
      const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      
      // Create mock video info
      return {
        title: randomTitle,
        channel: ['Tech Learning Hub', 'Data Engineering Academy', 'Cloud Masters', 'Big Data Tutorials'][Math.floor(Math.random() * 4)],
        duration: `${Math.floor(30 + Math.random() * 90)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        description: randomDescription
      };
    } else {
      // In a real implementation, you would fetch actual metadata from YouTube API
      // This would require API keys and proper authentication
      return null;
    }
  };

  // Simulate analysis time with a promise
  const simulateAnalysisTime = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleGenerateSummary = async () => {
    if (!videoUrl) return;
    
    setIsLoading(true);
    // Reset key points
    setVideoData(prev => ({ ...prev, keyPoints: [] }));
    setCurrentPointIndex(0);
    
    try {
      // Get video ID from URL
      const videoId = getVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // In a real implementation, you would call YouTube API here
      // For this example, we'll use mock data
      const videoInfo = parseVideoMetadata(videoId);
      
      if (!videoInfo) {
        throw new Error('Failed to fetch video information');
      }

      // Show initial video info without key points
      setVideoData(prev => ({
        ...prev,
        title: videoInfo.title,
        duration: videoInfo.duration,
        channel: videoInfo.channel,
        thumbnail: videoInfo.thumbnail,
        keyPoints: []
      }));

      // Simulate analysis time (3-5 seconds)
      await simulateAnalysisTime(3000 + Math.random() * 2000);

      // Generate key points from the description
      const topicHints = [videoInfo.title, ...videoInfo.description.split(' ')];
      const keyPoints = generateKeyPoints(videoInfo.description, topicHints);
      
      // Extract keywords from the description
      const keywords = extractKeywords(videoInfo.description);

      // Set up for displaying points one by one
      setGeneratedPoints(keyPoints);
      setIsGeneratingPoints(true);

      // Update other data immediately
      setVideoData(prev => ({
        ...prev,
        readingTime: `${Math.ceil((keyPoints.join(' ').length) / 1000)} min`,
        pointCount: keyPoints.length,
        accuracy: `${Math.floor(80 + Math.random() * 20)}%`,
        keywords: keywords,
        relatedVideos: generateMockRelatedVideos(keywords)
      }));

    } catch (error) {
      console.error('Error:', error);
      setVideoData(prev => ({
        ...prev,
        keyPoints: [`Error: ${error instanceof Error ? error.message : 'Failed to generate summary'}`]
      }));
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      const response = await axios.post('/api/create-flashcards', {
        points: videoData.keyPoints
      });
      
      if (response.data.success) {
        window.location.href = '/flash';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(videoData.keyPoints.join('\n\n'));
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([videoData.keyPoints.join('\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoData.title.replace(/\s+/g, '_')}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full p-4 bg-indigo-600 flex justify-between items-center z-50">
        <a href="#" className="text-white font-bold text-xl">LearnGenie</a>
        <div className="flex gap-4">
          {/* Navigation buttons can be added here */}
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Video Summary Generator</h1>
            <div className="flex gap-4 mb-6">
              <Input
                type="text"
                className="flex-1 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="Paste your YouTube video URL here"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <Button 
                className="bg-indigo-700 hover:bg-indigo-600"
                onClick={handleGenerateSummary}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Summary'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="bg-white/70 p-6 rounded-xl text-center">
                <div className="text-4xl mb-4 text-indigo-600">🎯</div>
                <h3 className="font-medium mb-2">Key Points</h3>
                <p className="text-gray-600">Extract main ideas and crucial information</p>
              </Card>
              <Card className="bg-white/70 p-6 rounded-xl text-center">
                <div className="text-4xl mb-4 text-indigo-600">⚡️</div>
                <h3 className="font-medium mb-2">Quick Analysis</h3>
                <p className="text-gray-600">Get summaries in seconds</p>
              </Card>
              <Card className="bg-white/70 p-6 rounded-xl text-center">
                <div className="text-4xl mb-4 text-indigo-600">📊</div>
                <h3 className="font-medium mb-2">Smart Insights</h3>
                <p className="text-gray-600">AI-powered content analysis</p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card>
          <CardContent className="p-8">
            {/* Video Preview */}
            <div className="bg-gray-100 p-6 rounded-xl mb-6 flex flex-col md:flex-row items-center gap-6">
              <img 
                src={videoData.thumbnail} 
                alt="Video thumbnail" 
                className="w-full md:w-48 h-32 rounded-lg object-cover"
              />
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold mb-2">{videoData.title}</h2>
                <p className="text-gray-600">Duration: {formatDuration(videoData.duration)} • Channel: {videoData.channel}</p>
              </div>
            </div>

            {/* Summary Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b-2 border-gray-100">
              <h2 className="text-xl font-semibold mb-4 md:mb-0">Video Content Analysis</h2>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCopySummary} disabled={isLoading || videoData.keyPoints.length === 0}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={handleDownloadSummary} disabled={isLoading || videoData.keyPoints.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" disabled={isLoading || videoData.keyPoints.length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Loading Animation */}
            {(isLoading && !isGeneratingPoints) && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                <p className="text-gray-600 animate-pulse text-lg">Analyzing video content...</p>
                <p className="text-gray-500 text-sm mt-3">This may take a few moments</p>
              </div>
            )}

            {/* Points being generated with animations */}
            {isGeneratingPoints && currentPointIndex < generatedPoints.length && (
              <div className="flex justify-center items-center py-4">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mr-4"></div>
                <p className="text-indigo-600 font-medium">Extracting key points...</p>
              </div>
            )}

            {/* Key Points List - New Format */}
            <div className="space-y-4">
              {videoData.keyPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg transform transition-all duration-500 ease-in-out"
                  style={{
                    animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-start">
                    <div className="text-indigo-700 font-bold mr-4">{index + 1}.</div>
                    <div className="text-gray-700">{point}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            {videoData.keyPoints.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">{videoData.readingTime}</div>
                  <div className="text-gray-600">Reading Time</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">{videoData.pointCount}</div>
                  <div className="text-gray-600">Key Points</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">{videoData.accuracy}</div>
                  <div className="text-gray-600">Accuracy</div>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            {videoData.keyPoints.length > 0 && (
              <div className="text-center mt-8">
               
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Videos Section - Only show when we have keywords */}
        {videoData.keywords.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-8">Related Content</h2>
              
              {/* Keywords */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Key Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {videoData.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm border-2 border-indigo-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoData.relatedVideos.map((video, index) => (
                  <a
                    key={index}
                    href={createYouTubeSearchURL(video.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 rounded-xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="bg-indigo-700 h-48 flex items-center justify-center text-white text-xl">
                      {video.title.split(' ')[0]}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Published: {formatDate(video.publishedAt)}</p>
                      <div className="flex items-center text-red-600 font-medium">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                        Watch on YouTube
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VideoSummaryGenerator;