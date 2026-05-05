'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { FaPlus, FaEdit, FaTrash, FaCopy, FaDownload } from 'react-icons/fa';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchResumes = () => {
    const saved = localStorage.getItem('resumes');
    if (saved) {
      setResumes(JSON.parse(saved));
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const saveToLocal = (newResumes: any[]) => {
    setResumes(newResumes);
    localStorage.setItem('resumes', JSON.stringify(newResumes));
  };

  const createResume = () => {
    const newResume = {
      _id: Math.random().toString(36).substr(2, 9),
      title: 'Untitled Resume',
      template: 'modern',
      personalInfo: { fullName: '' },
      updatedAt: new Date().toISOString()
    };
    const updated = [newResume, ...resumes];
    saveToLocal(updated);
    router.push(`/builder?id=${newResume._id}`);
  };

  const deleteResume = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    const updated = resumes.filter(r => r._id !== id);
    saveToLocal(updated);
  };

  const duplicateResume = (id: string) => {
    const original = resumes.find(r => r._id === id);
    if (!original) return;
    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      _id: Math.random().toString(36).substr(2, 9),
      title: `${original.title} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    const updated = [duplicate, ...resumes];
    saveToLocal(updated);
  };

  const handleDownloadPDF = async (id: string, name: string) => {
    try {
      const resume = resumes.find(r => r._id === id);
      if (!resume) return;
      
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
      link.setAttribute('download', `${name || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error', error);
      alert('Error downloading PDF. The PDF engine might be starting up, please try again in a few seconds.');
    }
  };

  if (loading || fetching) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">Loading...</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
        <button
          onClick={createResume}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FaPlus size={14} /> New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-500 mb-6">Create your first resume to get started</p>
          <button onClick={createResume} className="text-blue-600 font-medium hover:underline">
            Create new resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden group">
              <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 relative">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <Link href={`/builder?id=${resume._id}`} className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors" title="Edit">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDownloadPDF(resume._id, resume.personalInfo?.fullName)} className="p-3 bg-white text-green-600 rounded-full hover:bg-green-50 transition-colors" title="Download PDF">
                    <FaDownload />
                  </button>
                  <button onClick={() => duplicateResume(resume._id)} className="p-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors" title="Duplicate">
                    <FaCopy />
                  </button>
                  <button onClick={() => deleteResume(resume._id)} className="p-3 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors" title="Delete">
                    <FaTrash />
                  </button>
                </div>
                <div className="text-gray-400 text-xs tracking-widest uppercase">
                  {resume.template} Template
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{resume.title}</h3>
                <p className="text-sm text-gray-500">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
