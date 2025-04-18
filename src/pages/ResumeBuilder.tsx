import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { FileText, Plus, Trash2, Download, Upload, Eye, X, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/Logo';

// Add these constants at the top of the file
const PINATA_API_KEY = 'b3eb07994bb708cafc84';
const PINATA_SECRET_KEY = '93d4a0afb00d15505d0796850982281db1aa124d08febb2ff2fd27f30ba44c36';

const ResumeBuilder: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    summary: ''
  });

  const [experience, setExperience] = useState<Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>>([]);

  const [skills, setSkills] = useState<Array<{
    id: string;
    name: string;
    level: string;
  }>>([]);

  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Reference for the preview modal
  const previewModalRef = useRef<HTMLDivElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: ''
    }]);
  };

  const addSkill = () => {
    setSkills([...skills, {
      id: Date.now().toString(),
      name: '',
      level: 'Beginner'
    }]);
  };

  const uploadToPinata = async (pdfBlob: Blob) => {
    try {
      const formData = new FormData();
      // Use custom filename if provided, otherwise use name from personal info or default
      const customFileName = fileName.trim() || 
                            (personalInfo.name.trim() ? `${personalInfo.name.trim()}_resume.pdf` : 'resume.pdf');
      
      formData.append('file', pdfBlob, customFileName);
      
      // Add metadata with the filename
      const metadata = JSON.stringify({
        name: customFileName,
        keyvalues: {
          createdAt: new Date().toISOString(),
          type: 'resume'
        }
      });
      formData.append('pinataMetadata', metadata);

      // Optional Pinata options
      const options = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', options);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      });

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw error;
    }
  };

  // Function to download PDF directly
  const downloadPDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      const customFileName = fileName.trim() || 
                          (personalInfo.name.trim() ? `${personalInfo.name.trim()}_resume.pdf` : 'resume.pdf');
      
      // Create high-quality canvas
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 3, // Higher resolution
        useCORS: true,
        backgroundColor: '#f0f8ff', // Light blue background
        logging: false,
        allowTaint: true,
      });
      
      // Create PDF with proper dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF with proper positioning
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Handle multi-page if content is too long
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        let position = 0;
        
        heightLeft -= pageHeight;
        position -= pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      }
      
      // Save PDF with custom filename
      pdf.save(customFileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF for download');
    }
  };

  const handleGeneratePDF = async () => {
    if (!resumePreviewRef.current) return;
  
    try {
      setUploading(true);
      
      // Create high-quality canvas
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 3, // Higher resolution for better quality
        useCORS: true,
        backgroundColor: '#f0f8ff', // Light blue background
        logging: false,
        allowTaint: true,
      });
  
      // Create PDF with proper dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF with proper positioning
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Handle multi-page if content is too long
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        let position = 0;
        
        heightLeft -= pageHeight;
        position -= pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
        }
      }
      
      // Convert PDF to blob for upload
      const pdfBlob = pdf.output('blob');
      
      // Upload to Pinata
      const hash = await uploadToPinata(pdfBlob);
      setIpfsHash(hash);
      
      alert(`Resume successfully uploaded to IPFS with hash: ${hash}`);
  
    } catch (error) {
      console.error('Error generating/uploading PDF:', error);
      alert('Error uploading resume to IPFS');
    } finally {
      setUploading(false);
    }
  };

  // Function to close the preview modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (previewModalRef.current && e.target === previewModalRef.current) {
      setShowPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduBlue/10 via-white to-eduYellow/10">
      {/* Header remains the same */}
      
      <div className="container mx-auto py-8 px-4">
        <Card className="border-eduBlue/20 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-eduGray">Create Your Professional Resume</CardTitle>
            <p className="text-sm text-gray-600">Fill in the details below to generate your professional resume</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-eduGray flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  placeholder="Full Name *"
                  className="border-eduBlue/20"
                  required
                />
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  placeholder="Email Address *"
                  className="border-eduBlue/20"
                  required
                />
                <Input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  placeholder="Phone Number *"
                  className="border-eduBlue/20"
                  required
                />
                <Input
                  type="text"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                  placeholder="Location (City, Country)"
                  className="border-eduBlue/20"
                />
                <Input
                  type="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                  placeholder="LinkedIn URL"
                  className="border-eduBlue/20"
                />
                <Input
                  type="url"
                  value={personalInfo.website}
                  onChange={(e) => setPersonalInfo({...personalInfo, website: e.target.value})}
                  placeholder="Portfolio Website"
                  className="border-eduBlue/20"
                />
                <Textarea
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  placeholder="Professional Summary (Brief introduction about yourself) *"
                  className="border-eduBlue/20 md:col-span-2"
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Experience Section with proper layout */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-eduGray flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </h2>
                <Button 
                  onClick={addExperience}
                  variant="outline"
                  className="border-eduBlue/20 hover:bg-eduBlue/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              
              {experience.map((exp, index) => (
                <Card key={exp.id} className="border-eduBlue/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">Experience {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setExperience(experience.filter(e => e.id !== exp.id));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index].company = e.target.value;
                          setExperience(newExp);
                        }}
                        placeholder="Company Name *"
                        className="border-eduBlue/20"
                        required
                      />
                      <Input
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index].position = e.target.value;
                          setExperience(newExp);
                        }}
                        placeholder="Job Title *"
                        className="border-eduBlue/20"
                        required
                      />
                      <Input
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index].duration = e.target.value;
                          setExperience(newExp);
                        }}
                        placeholder="Duration (e.g., Jan 2020 - Present) *"
                        className="border-eduBlue/20"
                        required
                      />
                      <Textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...experience];
                          newExp[index].description = e.target.value;
                          setExperience(newExp);
                        }}
                        placeholder="Job Description and Achievements *"
                        className="border-eduBlue/20 md:col-span-2"
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Skills Section with improved layout */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-eduGray flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skills
                </h2>
                <Button 
                  onClick={addSkill}
                  variant="outline"
                  className="border-eduBlue/20 hover:bg-eduBlue/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <Card key={skill.id} className="border-eduBlue/20">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...skills];
                              newSkills[index].name = e.target.value;
                              setSkills(newSkills);
                            }}
                            placeholder="Skill Name *"
                            className="border-eduBlue/20"
                            required
                          />
                        </div>
                        <Select
                          value={skill.level}
                          onValueChange={(value) => {
                            const newSkills = [...skills];
                            newSkills[index].level = value;
                            setSkills(newSkills);
                          }}
                        >
                          <SelectTrigger className="w-[180px] border-eduBlue/20">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setSkills(skills.filter(s => s.id !== skill.id));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add File Name Input Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-eduGray">File Name (Optional)</label>
              <Input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter custom filename"
                className="border-eduBlue/20"
              />
              <p className="text-sm text-gray-500">If left blank, will use your name or default to "resume.pdf"</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="border-eduBlue/20 hover:bg-eduBlue/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            
            </div>
          </CardContent>
        </Card>

        {/* Preview Modal */}
        {showPreview && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            ref={previewModalRef}
            onClick={handleOutsideClick}
          >
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto m-4">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-eduGray">Resume Preview</h2>
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-8">
                <div ref={resumePreviewRef} className="bg-white shadow-lg p-8 rounded-lg space-y-6">
                  {/* Personal Information */}
                  <div className="border-b pb-6">
                    <h1 className="text-3xl font-bold text-eduBlue mb-2">{personalInfo.name}</h1>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {personalInfo.email && <p>{personalInfo.email}</p>}
                      {personalInfo.phone && <p>{personalInfo.phone}</p>}
                      {personalInfo.address && <p>{personalInfo.address}</p>}
                      {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-eduBlue hover:underline">
                          LinkedIn Profile
                        </a>
                      )}
                      {personalInfo.website && (
                        <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-eduBlue hover:underline">
                          Portfolio Website
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {personalInfo.summary && (
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-eduGray">Professional Summary</h2>
                      <p className="text-gray-600">{personalInfo.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-eduGray">Work Experience</h2>
                      {experience.map((exp) => (
                        <div key={exp.id} className="space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{exp.position}</h3>
                            <span className="text-gray-600">{exp.duration}</span>
                          </div>
                          <p className="text-eduBlue">{exp.company}</p>
                          <p className="text-gray-600 whitespace-pre-line">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-eduGray">Skills</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {skills.map((skill) => (
                          <div key={skill.id} className="flex justify-between items-center">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end gap-4">
                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  className="border-eduBlue/20 hover:bg-eduBlue/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button onClick={() => setShowPreview(false)}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;