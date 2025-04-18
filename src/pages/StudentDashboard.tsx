import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Code, GitBranch, Terminal, CheckCircle2, PlayCircle, Home, FileText, PlaySquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import Logo from '@/components/Logo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    githubProfile: '',
    languages: {
      javascript: false,
      python: false,
      java: false,
      cpp: false
    },
    tools: {
      git: false,
      docker: false,
      algorithms: false,
      apis: false
    }
  });

  const [skills, setSkills] = useState({
    languages: {},
    tools: {}
  });

  const [availableCourses, setAvailableCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [progressData, setProgressData] = useState({
    courses: [],
    skills: [],
    track: null
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [learningData, setLearningData] = useState({
    goals: '',
    notes: ''
  });
  const [videoProgress, setVideoProgress] = useState(0);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.id) {
      setUserId(userData.id);
      setProfile(prev => ({
        ...prev,
        fullName: userData.name || '',
        email: userData.email || ''
      }));
      
      // Fetch student profile data
      fetchStudentData(userData.id);
    }
  }, []);

  const fetchStudentData = async (studentId) => {
    try {
      // Fetch available courses
      const coursesResponse = await axios.get(`${API_URL}/available-courses/${studentId}`);
      setAvailableCourses(coursesResponse.data.courses);
      
      // Fetch recommended courses
      const recommendedResponse = await axios.get(`${API_URL}/student/recommended-courses/${studentId}`);
      setRecommendedCourses(recommendedResponse.data.courses);
      
      // Fetch progress data
      const progressResponse = await axios.get(`${API_URL}/student/progress/${studentId}`);
      setProgressData(progressResponse.data.progress);
      
      // Convert skills data to format needed for UI
      const languageSkills = {};
      const toolSkills = {};
      
      progressResponse.data.progress.skills.forEach(skill => {
        if (skill.skill_type === 'language') {
          languageSkills[skill.skill_name] = skill.proficiency || 0;
        } else if (skill.skill_type === 'tool') {
          toolSkills[skill.skill_name] = skill.proficiency || 0;
        }
      });
      
      setSkills({
        languages: languageSkills,
        tools: toolSkills
      });
      
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!userId) return;
    
    try {
      // Prepare data for API
      const profileData = {
        user_id: userId,
        github_profile: profile.githubProfile,
        languages: profile.languages,
        tools: profile.tools
      };
      
      // Update profile in the backend
      await axios.post(`${API_URL}/student/profile`, profileData);
      
      // Refresh student data
      fetchStudentData(userId);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const selectVideo = async (video) => {
    setSelectedVideo(video);
    
    try {
      // Fetch learning data for this video
      const learningDataResponse = await axios.get(`${API_URL}/student/learning-data/${userId}/${video.id}`);
      setLearningData(learningDataResponse.data.data);
      
      // Set current progress
      setVideoProgress(video.progress || 0);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setLearningData({ goals: '', notes: '' });
      setVideoProgress(0);
    }
  };

  const updateLearningData = async () => {
    if (!userId || !selectedVideo) return;
    
    try {
      await axios.post(`${API_URL}/student/learning-data`, {
        student_id: userId,
        video_id: selectedVideo.id,
        goals: learningData.goals,
        notes: learningData.notes
      });
      
      alert('Learning data saved successfully!');
    } catch (error) {
      console.error("Error saving learning data:", error);
      alert('Failed to save learning data. Please try again.');
    }
  };

  const updateVideoProgress = async (progress, completed = false) => {
    if (!userId || !selectedVideo) return;
    
    try {
      await axios.post(`${API_URL}/student/course-progress`, {
        student_id: userId,
        video_id: selectedVideo.id,
        progress_percentage: progress,
        completed: completed
      });
      
      setVideoProgress(progress);
      
      // Refresh course data
      fetchStudentData(userId);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduBlue/20 via-white to-eduYellow/20 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col items-center py-8 sticky top-0 h-screen">
        <div className="space-y-4 w-full px-4">
          <Button
            variant="ghost"
            className="w-full h-16 rounded-xl flex items-center gap-3 hover:bg-eduBlue/10 justify-start px-4"
            onClick={() => navigate('/landing')}
          >
            <Home className="h-6 w-6 text-eduBlue" />
            <span className="text-sm text-eduBlue">Home</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full h-16 rounded-xl flex items-center gap-3 hover:bg-eduBlue/10 justify-start px-4"
            onClick={() => navigate('/code-editor')}
          >
            <PlaySquare className="h-6 w-6 text-eduBlue" />
            <span className="text-sm text-eduBlue">Play N Learn</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full h-16 rounded-xl flex items-center gap-3 hover:bg-eduBlue/10 justify-start px-4"
            onClick={() => {
              try {
                navigate('/recommendation-form');
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback navigation
                window.location.href = '/recommendation-form';
              }
            }}
          >
            <BookOpen className="h-6 w-6 text-eduBlue" />
            <span className="text-sm text-eduBlue">Job Resource</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full h-16 rounded-xl flex items-center gap-3 hover:bg-eduBlue/10 justify-start px-4"
            onClick={() => navigate('/resume-builder')}
          >
            <FileText className="h-6 w-6 text-eduBlue" />
            <span className="text-sm text-eduBlue">Resume Builder</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-eduBlue/20">
          <div className="container-custom flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-eduBlue" />
              <h1 className="text-2xl font-bold text-eduBlue">Student Dashboard</h1>
            </div>
          </div>
        </nav>

        <main className="container-custom py-8 min-h-[calc(100vh-4rem)]">
          <div className="max-w-4xl mx-auto">
            {/* Profile Setup Section */}
            <Card className="mb-8 border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-black">Profile Setup</CardTitle>
                <CardDescription>Complete your profile to track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      className="border-eduBlue/20"
                      disabled
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="border-eduBlue/20"
                      disabled
                    />
                    <Input
                      placeholder="GitHub Profile"
                      value={profile.githubProfile}
                      onChange={(e) => setProfile({...profile, githubProfile: e.target.value})}
                      className="border-eduBlue/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">Technical Stack</h3>
                      <div className="space-y-2">
                        {Object.entries(profile.languages).map(([lang, checked]) => (
                          <div key={lang} className="flex items-center gap-2">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(checked) => 
                                setProfile({
                                  ...profile,
                                  languages: {...profile.languages, [lang]: !!checked}
                                })
                              }
                            />
                            <span className="capitalize">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Tools</h3>
                      <div className="space-y-2">
                        {Object.entries(profile.tools).map(([tool, checked]) => (
                          <div key={tool} className="flex items-center gap-2">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(checked) => 
                                setProfile({
                                  ...profile,
                                  tools: {...profile.tools, [tool]: !!checked}
                                })
                              }
                            />
                            <span className="capitalize">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-eduBlue hover:bg-eduBlue/90">
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Available Courses Section */}
            <Card className="mb-8 border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-black">Available Courses</CardTitle>
                <CardDescription>Browse all available educational content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCourses.map((course) => (
                    <Card key={course.id} className="bg-white shadow hover:shadow-md transition-all cursor-pointer"
                      onClick={() => selectVideo(course)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PlayCircle className="h-5 w-5 text-eduBlue" />
                          <h3 className="font-bold">{course.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                          <span>Subject: {course.subject}</span>
                          <span>By: {course.teacher_name}</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={course.progress || 0} className="h-1" />
                          <div className="flex justify-between text-xs mt-1">
                            <span>Progress: {course.progress || 0}%</span>
                            {course.completed && <span className="text-green-500">Completed</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Video Section */}
            {selectedVideo && (
              <Card className="mb-8 border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-black">{selectedVideo.title}</CardTitle>
                  <CardDescription>By {selectedVideo.teacher_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
                    <video 
                      src={`http://localhost:5000${selectedVideo.video_url}`} 
                      controls 
                      className="w-full h-full"
                      onTimeUpdate={(e) => {
                        const video = e.target;
                        const progress = Math.floor((video.currentTime / video.duration) * 100);
                        if (progress > videoProgress) {
                          setVideoProgress(progress);
                          updateVideoProgress(progress);
                        }
                      }}
                      onEnded={() => updateVideoProgress(100, true)}
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Your Progress</h3>
                    <Progress value={videoProgress} className="h-2 mb-1" />
                    <div className="flex justify-between text-xs">
                      <span>{videoProgress}% complete</span>
                      {videoProgress >= 100 && <span className="text-green-500">Completed</span>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Learning Goals</h3>
                      <Textarea
                        placeholder="What do you want to learn from this video?"
                        value={learningData.goals}
                        onChange={(e) => setLearningData({...learningData, goals: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <Textarea
                        placeholder="Take notes while watching the video"
                        value={learningData.notes}
                        onChange={(e) => setLearningData({...learningData, notes: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={updateLearningData} className="w-full bg-eduBlue hover:bg-eduBlue/90">
                    Save Learning Data
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Skills Progress Section */}
            <Card className="mb-8 border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-black">Skills Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Selected Languages</h3>
                    {Object.entries(skills.languages).length > 0 ? (
                      Object.entries(skills.languages).map(([lang, progress]) => (
                        <div key={lang} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="capitalize">{lang}</span>
                            <span>{progress}% proficiency</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No languages selected yet. Update your profile to track language skills.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Selected Tools</h3>
                    {Object.entries(skills.tools).length > 0 ? (
                      Object.entries(skills.tools).map(([tool, progress]) => (
                        <div key={tool} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="capitalize">{tool}</span>
                            <span>{progress}% proficiency</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No tools selected yet. Update your profile to track tool skills.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card className="mb-8 border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-black">Recommended For You</CardTitle>
                <CardDescription>Based on your selected skills and learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedCourses.length > 0 ? (
                    recommendedCourses.map((course) => (
                      <Card key={course.id} className="bg-white shadow hover:shadow-md transition-all cursor-pointer"
                        onClick={() => selectVideo(course)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <PlayCircle className="h-5 w-5 text-eduBlue" />
                            <h3 className="font-bold">{course.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Subject: {course.subject}</span>
                            <span>By: {course.teacher_name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-gray-500 py-8">
                      No recommendations available yet. Update your profile with skills and watch some courses to get personalized recommendations.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;