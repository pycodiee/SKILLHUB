import React, { useState, useEffect } from 'react';
import { Upload, Video, BookOpen, GraduationCap, FileText, Info, Users, Database, BarChart, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import Logo from '../components/Logo';
import axios from 'axios';

// Define types
interface Video {
  id: number;
  title: string;
  subject: string;
  description: string;
  video_url: string;
  teacher_id: number;
  created_at: string;
  teacher_name: string;
  student_count: number;
  average_progress: number;
}

interface StudentProgress {
  student_name: string;
  video_title: string;
  progress_percentage: number;
  completed: boolean;
  last_watched_at: string;
}

interface DetailedStudentProgress {
  student_id: number;
  student_name: string;
  student_email: string;
  course_progress: Array<{
    video_id: number;
    video_title: string;
    subject: string;
    progress: number;
    completed: boolean;
    last_watched: string;
  }>;
  completed_courses: number;
  total_courses: number;
  average_progress: number;
}

interface LearningData {
  student_name: string;
  video_title: string;
  goals: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const TeacherDashboard = () => {
  // State management
  const [videos, setVideos] = useState<Video[]>([]);
  const [studentsProgress, setStudentsProgress] = useState<StudentProgress[]>([]);
  const [detailedProgress, setDetailedProgress] = useState<DetailedStudentProgress[]>([]);
  const [learningData, setLearningData] = useState<LearningData[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Mock user data - in a real app, this would come from authentication
  const teacher = {
    id: 1,
    name: 'Prof. Smith',
    email: 'smith@example.edu'
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      // Fetch videos
      const videosResponse = await axios.get('http://localhost:5000/api/videos');
      if (videosResponse.data.success) {
        // Filter videos for this teacher
        const teacherVideos = videosResponse.data.videos.filter(
          (video: Video) => video.teacher_id === teacher.id
        );
        setVideos(teacherVideos);
      }

      // Fetch students progress
      const progressResponse = await axios.get(`http://localhost:5000/api/teacher/students-progress/${teacher.id}`);
      if (progressResponse.data.success) {
        setStudentsProgress(progressResponse.data.progress);
      }

      // Fetch detailed progress
      const detailedProgressResponse = await axios.get(`http://localhost:5000/api/teacher/detailed-progress/${teacher.id}`);
      if (detailedProgressResponse.data.success) {
        setDetailedProgress(detailedProgressResponse.data.students);
      }

      // Fetch learning data
      const learningDataResponse = await axios.get(`http://localhost:5000/api/teacher/student-learning-data/${teacher.id}`);
      if (learningDataResponse.data.success) {
        setLearningData(learningDataResponse.data.learningData);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('teacherName', teacher.name);
      formData.append('description', description);
      formData.append('video', selectedFile);
      formData.append('teacher_id', teacher.id.toString());

      const response = await axios.post('http://localhost:5000/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUploadSuccess(true);
        setVideos([...videos, response.data.video]);
        
        // Reset form
        setTitle('');
        setSubject('');
        setDescription('');
        setSelectedFile(null);
        
        // Refresh data
        fetchTeacherData();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduBlue/20 via-white to-eduYellow/20">
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-eduBlue/20">
        <div className="container-custom flex justify-between items-center h-16">
          <Logo />
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-eduBlue" />
            <h1 className="text-2xl font-bold text-eduBlue">Teacher Dashboard</h1>
          </div>
         
        </div>
        
      </nav>

      <main className="container-custom py-8 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-eduBlue/10">
            <h2 className="text-4xl font-extrabold text-black mb-4">Educational Content Hub</h2>
            <p className="text-gray-800 font-medium text-lg">Share your knowledge and expertise with students through engaging video content.</p>
          </div>

          <Tabs defaultValue="upload" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Content
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Library
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Progress
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Learning Data
              </TabsTrigger>
            </TabsList>

            {/* Upload Content Tab */}
            <TabsContent value="upload">
              <Card className="border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Upload className="h-5 w-5 text-eduBlue" />
                    Upload Educational Content
                  </CardTitle>
                  <CardDescription className="text-gray-800 font-medium">Create and share educational videos with your students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Video Title</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                          <Input
                            placeholder="Enter video title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="pl-10 border-eduBlue/20 focus-visible:ring-eduBlue"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Subject</label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                          <Input
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="pl-10 border-eduBlue/20 focus-visible:ring-eduBlue"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">Description</label>
                      <div className="relative">
                        <Info className="absolute left-3 top-3 h-5 w-5 text-eduGray/50" />
                        <Textarea
                          placeholder="Enter video description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          className="pl-10 min-h-[100px] border-eduBlue/20 focus-visible:ring-eduBlue"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">Video File</label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        required
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-eduBlue/10 file:text-eduBlue hover:file:bg-eduBlue/20"
                      />
                    </div>

                    {uploadSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        Video uploaded successfully!
                      </div>
                    )}

                    {uploadError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {uploadError}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-eduBlue hover:bg-eduBlue/90"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" /> Upload Video
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Course Library Tab */}
            <TabsContent value="library">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-eduBlue" />
                  Your Courses
                </h2>
                <p className="text-gray-800 font-medium">{videos.length} Videos Available</p>
              </div>

              {videos.length === 0 ? (
                <Card className="border-eduBlue/20 shadow-md bg-white/70 backdrop-blur-sm p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Video className="h-12 w-12 text-eduBlue/50" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Videos Uploaded Yet</h3>
                      <p className="text-gray-700">Start uploading your educational content in the Upload tab</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="border-eduBlue/20 shadow-md hover:shadow-lg transition-all bg-white/70 backdrop-blur-sm hover:bg-white/90">
                      <CardContent className="p-6">
                        <div className="bg-gradient-to-br from-eduBlue/20 to-eduBlue/10 rounded-lg p-4 mb-4 flex items-center justify-center">
                          <Video className="w-12 h-12 text-eduBlue" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-black">{video.title}</h3>
                        <p className="text-gray-800 text-sm mb-2 font-medium line-clamp-2">{video.description}</p>
                        <div className="space-y-2 border-t border-eduBlue/10 pt-3 mt-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-eduBlue" />
                            <p className="text-sm text-gray-800"><span className="font-bold text-black">Subject:</span> {video.subject}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-eduBlue" />
                              <span className="text-sm text-gray-800">{video.student_count || 0} Students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart className="h-4 w-4 text-eduBlue" />
                              <span className="text-sm text-gray-800">{Math.round(video.average_progress || 0)}% Avg. Progress</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t border-eduBlue/10 px-6 py-3">
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Uploaded on {formatDate(video.created_at)}
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Student Progress Tab */}
            <TabsContent value="students">
              <Card className="border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Users className="h-5 w-5 text-eduBlue" />
                    Student Progress Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-800 font-medium">
                    Track how your students are engaging with your educational content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {detailedProgress.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-eduBlue/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Student Data Yet</h3>
                      <p className="text-gray-700">Students will appear here once they start watching your videos</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-white shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Total Students</h3>
                              <Users className="h-5 w-5 text-eduBlue" />
                            </div>
                            <p className="text-3xl font-bold mt-2">{detailedProgress.length}</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Avg. Progress</h3>
                              <BarChart className="h-5 w-5 text-eduBlue" />
                            </div>
                            <p className="text-3xl font-bold mt-2">
                              {Math.round(
                                detailedProgress.reduce((sum, student) => sum + student.average_progress, 0) / 
                                detailedProgress.length || 0
                              )}%
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white shadow">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Completed Courses</h3>
                              <CheckCircle2 className="h-5 w-5 text-eduBlue" />
                            </div>
                            <p className="text-3xl font-bold mt-2">
                              {detailedProgress.reduce((sum, student) => sum + student.completed_courses, 0)}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <h3 className="text-xl font-bold mb-4">Student Details</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Courses Completed</TableHead>
                            <TableHead>Last Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detailedProgress.map((student) => (
                            <TableRow key={student.student_id}>
                              <TableCell className="font-medium">{student.student_name}</TableCell>
                              <TableCell>{student.student_email}</TableCell>
                              <TableCell>
                                <div className="w-full flex items-center gap-2">
                                  <Progress value={student.average_progress} className="h-2 w-24" />
                                  <span>{Math.round(student.average_progress)}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{student.completed_courses} of {student.total_courses}</TableCell>
                              <TableCell>
                                {student.course_progress.length > 0 
                                  ? formatDate(student.course_progress[0].last_watched)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Data Tab */}
            <TabsContent value="insights">
              <Card className="border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Database className="h-5 w-5 text-eduBlue" />
                    Student Learning Data
                  </CardTitle>
                  <CardDescription className="text-gray-800 font-medium">
                    Review student goals and notes for better understanding of their learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {learningData.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 text-eduBlue/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Learning Data Available</h3>
                      <p className="text-gray-700">Data will appear here when students add goals and notes to your courses</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {learningData.map((data, index) => (
                        <Card key={index} className="border-eduBlue/10">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-lg">{data.student_name}</CardTitle>
                                <CardDescription>{data.video_title}</CardDescription>
                              </div>
                              <p className="text-xs text-gray-500">Updated: {formatDate(data.updated_at)}</p>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1 mb-1">
                                <GraduationCap className="h-4 w-4 text-eduBlue" /> Learning Goals
                              </h4>
                              <p className="text-sm pl-5 text-gray-700">{data.goals || "No goals specified"}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-1 mb-1">
                                <FileText className="h-4 w-4 text-eduBlue" /> Notes
                              </h4>
                              <p className="text-sm pl-5 text-gray-700 whitespace-pre-line">{data.notes || "No notes added"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;