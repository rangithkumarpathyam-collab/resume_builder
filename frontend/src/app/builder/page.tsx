'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { FaArrowLeft, FaDownload, FaSave, FaCheck, FaTrash, FaPlus } from 'react-icons/fa';
import ResumePreview from '@/components/templates/ResumePreview';

// Basic empty resume structure
const emptyResume = {
  title: 'Untitled Resume',
  template: 'modern',
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: []
};

import { Suspense } from 'react';

function BuilderContent() {
  const { loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');

  const [resume, setResume] = useState<any>(emptyResume);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [fetching, setFetching] = useState(true);

  // Fetch resume data from localStorage
  useEffect(() => {
    if (resumeId) {
      const saved = localStorage.getItem('resumes');
      if (saved) {
        const resumes = JSON.parse(saved);
        const current = resumes.find((r: any) => r._id === resumeId);
        if (current) {
          // Ensure all required fields exist
          const sanitized = {
            ...emptyResume,
            ...current,
            personalInfo: { ...emptyResume.personalInfo, ...(current.personalInfo || {}) },
            experience: current.experience || [],
            education: current.education || [],
            skills: current.skills || [],
            projects: current.projects || []
          };
          setResume(sanitized);
        }
      }
    }
    setFetching(false);
  }, [resumeId]);

  // Auto-save to localStorage
  useEffect(() => {
    if (fetching || !resumeId || resume === emptyResume) return;
    
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resume, fetching]);

  const handleSave = () => {
    if (!resumeId) return;
    setSaving(true);
    
    const saved = localStorage.getItem('resumes');
    const resumes = saved ? JSON.parse(saved) : [];
    const index = resumes.findIndex((r: any) => r._id === resumeId);
    
    const updatedResume = { ...resume, updatedAt: new Date().toISOString() };
    
    if (index !== -1) {
      resumes[index] = updatedResume;
    } else {
      resumes.push(updatedResume);
    }
    
    localStorage.setItem('resumes', JSON.stringify(resumes));
    setLastSaved(new Date());
    setSaving(false);
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (section === 'root') {
      setResume({ ...resume, [field]: value });
    } else {
      setResume({
        ...resume,
        [section]: { ...resume[section], [field]: value }
      });
    }
  };

  const handleArrayChange = (section: string, index: number, field: string, value: any) => {
    const newArray = [...resume[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    setResume({ ...resume, [section]: newArray });
  };

  const handleAddItem = (section: string, emptyItem: any) => {
    setResume({ ...resume, [section]: [...(resume[section] || []), emptyItem] });
  };

  const handleRemoveItem = (section: string, index: number) => {
    const newArray = [...resume[section]];
    newArray.splice(index, 1);
    setResume({ ...resume, [section]: newArray });
  };

  const handleDownloadPDF = async () => {
    try {
      handleSave(); // save first
      const res = await api.post(`/resumes/export/pdf`, resume, { responseType: 'blob' });
      
      // Check if the response is actually a JSON error hidden in a blob
      if (res.data.type === 'application/json') {
        const text = await res.data.text();
        const error = JSON.parse(text);
        alert(error.message || 'Failed to generate PDF');
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.personalInfo?.fullName || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error', error);
      alert('Error downloading PDF. The PDF engine might be starting up, please try again in a few seconds.');
    }
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center">Loading builder...</div>;

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'templates', label: 'Templates' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Builder Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
            <FaArrowLeft />
          </Link>
          <input 
            type="text" 
            value={resume.title} 
            onChange={(e) => handleChange('root', 'title', e.target.value)}
            className="font-bold text-lg text-gray-900 border-none bg-transparent focus:ring-0 p-0 w-64 focus:outline-none"
            placeholder="Resume Title"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {saving ? (
              <span className="flex items-center gap-1"><span className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></span> Saving...</span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 text-green-600"><FaCheck size={10} /> Saved</span>
            ) : null}
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <FaDownload size={14} /> Download PDF
          </button>
        </div>
      </header>

      {/* Main Builder Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Editor Sidebar */}
        <div className="w-[450px] bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                      value={resume.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                        value={resume.personalInfo.email} onChange={(e) => handleChange('personalInfo', 'email', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                        value={resume.personalInfo.phone} onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                      value={resume.personalInfo.location} onChange={(e) => handleChange('personalInfo', 'location', e.target.value)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn URL</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                        value={resume.personalInfo.linkedin} onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Portfolio/Website</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                        value={resume.personalInfo.website} onChange={(e) => handleChange('personalInfo', 'website', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Professional Summary</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 resize-none" 
                      value={resume.personalInfo.summary} onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
                </div>
                
                {resume.experience.map((exp: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                    <button onClick={() => handleRemoveItem('experience', index)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTrash size={12} />
                    </button>
                    
                    <div className="space-y-3 mt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Job Title</label>
                          <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={exp.position} onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Company</label>
                          <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                          <input type="text" placeholder="MM/YYYY" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={exp.startDate} onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                          <input type="text" placeholder="MM/YYYY" disabled={exp.current} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400" value={exp.endDate} onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)} />
                        </div>
                        <div className="flex items-center justify-center mt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={exp.current} onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                            <span className="text-xs font-medium text-gray-700">Current</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Description</label>
                        <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white resize-none" value={exp.description} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Highlights (Comma separated)</label>
                        <textarea rows={2} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white resize-none" 
                          value={exp.highlights ? exp.highlights.join(', ') : ''} 
                          onChange={(e) => {
                            const val = e.target.value;
                            const arr = val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
                            handleArrayChange('experience', index, 'highlights', arr);
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddItem('experience', { company: '', position: '', startDate: '', endDate: '', current: false, description: '', highlights: [] })}
                  className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm flex justify-center items-center gap-2"
                >
                  <FaPlus size={12} /> Add Experience
                </button>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Education</h2>
                </div>
                
                {resume.education.map((edu: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                    <button onClick={() => handleRemoveItem('education', index)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTrash size={12} />
                    </button>
                    
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">School / University</label>
                        <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.institution} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Degree</label>
                          <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Field of Study</label>
                          <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.field} onChange={(e) => handleArrayChange('education', index, 'field', e.target.value)} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Start Date</label>
                          <input type="text" placeholder="YYYY" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.startDate} onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">End Date</label>
                          <input type="text" placeholder="YYYY" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.endDate} onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">GPA (Optional)</label>
                          <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={edu.gpa} onChange={(e) => handleArrayChange('education', index, 'gpa', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })}
                  className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm flex justify-center items-center gap-2"
                >
                  <FaPlus size={12} /> Add Education
                </button>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Skills</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">Group your skills by category (e.g., Programming Languages, Frameworks, Tools).</p>
                
                {resume.skills.map((skill: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                    <button onClick={() => handleRemoveItem('skills', index)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTrash size={12} />
                    </button>
                    
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Category</label>
                        <input type="text" placeholder="e.g. Frontend Frameworks" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" value={skill.category} onChange={(e) => handleArrayChange('skills', index, 'category', e.target.value)} />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(skill.items || []).map((item: string, tagIndex: number) => (
                            <span key={tagIndex} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                              {item}
                              <button onClick={() => {
                                const newItems = [...skill.items];
                                newItems.splice(tagIndex, 1);
                                handleArrayChange('skills', index, 'items', newItems);
                              }} className="text-blue-500 hover:text-blue-700">&times;</button>
                            </span>
                          ))}
                        </div>
                        <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" 
                          placeholder="Type a skill and press Enter or Comma"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val && !(skill.items || []).includes(val)) {
                                handleArrayChange('skills', index, 'items', [...(skill.items || []), val]);
                              }
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleAddItem('skills', { category: '', items: [] })}
                  className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm flex justify-center items-center gap-2"
                >
                  <FaPlus size={12} /> Add Skill Group
                </button>
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Choose Template</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
                    { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-800' },
                    { id: 'creative', name: 'Creative', color: 'bg-purple-600' }
                  ].map(tmpl => (
                    <div 
                      key={tmpl.id}
                      onClick={() => handleChange('root', 'template', tmpl.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col items-center gap-3 ${resume.template === tmpl.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className={`w-12 h-12 rounded-full ${tmpl.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                        {tmpl.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{tmpl.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 bg-gray-500 overflow-y-auto p-8 flex justify-center relative shadow-inner">
          <div className="absolute top-4 right-8 bg-gray-800/80 backdrop-blur text-white px-3 py-1.5 rounded text-xs font-medium z-10 shadow-lg">
            Live Preview (A4 Size)
          </div>
          <div className="origin-top" style={{ transform: 'scale(0.8) translateY(-40px)' }}>
            <ResumePreview data={resume} template={resume.template} scale={1} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
