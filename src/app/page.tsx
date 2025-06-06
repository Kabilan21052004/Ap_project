'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon, ArrowUpTrayIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ResumeAnalysis from './components/ResumeAnalysis';
import AnimatedBackground from './components/AnimatedBackground';
import ResumeTips from './components/ResumeTips';
import ActionItems from './components/ActionItems';
import UtilityLinks from './components/UtilityLinks';

const careerResources = [
  {
    name: 'Medium',
    description: 'Read latest articles on resume writing and career development',
    url: 'https://medium.com/tag/resume-tips',
    startColor: '#1a1a1a',
    endColor: '#404040'
  },
  {
    name: 'LinkedIn',
    description: 'Check trending jobs and industry updates',
    url: 'https://www.linkedin.com/jobs',
    startColor: '#0077b5',
    endColor: '#004d73'
  },
  {
    name: 'Coursera',
    description: 'Enhance your skills with online courses',
    url: 'https://www.coursera.org',
    startColor: '#2A73CC',
    endColor: '#1F4D99'
  },
  {
    name: 'GitHub',
    description: 'Showcase your projects and contributions',
    url: 'https://github.com',
    startColor: '#2b3137',
    endColor: '#24292e'
  }
];

const jobResources = [
  {
    name: 'Glassdoor',
    description: 'Research company reviews and salaries',
    url: 'https://www.glassdoor.com',
    startColor: '#0caa41',
    endColor: '#088631'
  },
  {
    name: 'Indeed',
    description: 'Browse latest job postings',
    url: 'https://www.indeed.com',
    startColor: '#2557a7',
    endColor: '#1a3d7c'
  },
  {
    name: 'Resume.io',
    description: 'Get inspiration from professional resume templates',
    url: 'https://resume.io',
    startColor: '#6366f1',
    endColor: '#4338ca'
  },
  {
    name: 'AngelList',
    description: 'Discover startup jobs and connect with founders',
    url: 'https://angel.co',
    startColor: '#000000',
    endColor: '#333333'
  }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
        setAnalysis('');
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection) {
        if (rejection.errors[0].code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        } else {
          setError('Error uploading file. Please try again.');
        }
      }
    }
  });

  const analyzeResume = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis('');
    setAnalysisComplete(false);

    try {
      let fileContent;
      console.log('Reading file content...');
      
      fileContent = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsText(file);
      });

      console.log('Making API request...');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: fileContent,
          fileType: file.type
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();
      console.log('API response received');
      
      if (!data.analysis) {
        throw new Error('No analysis received from the server');
      }

      setAnalysis(data.analysis);
      setLoading(false);
      setTimeout(() => {
        setAnalysisComplete(true);
      }, 500);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze resume');
      setAnalysisComplete(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground 
        isAnalyzing={loading} 
        isComplete={analysisComplete} 
      />
      
      <main className="container mx-auto px-4 py-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl transform -translate-y-8" />
          
          <h1 className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient mb-6">
            AI Resume Analyzer
          </h1>
          <p className="relative text-xl text-blue-100/90 max-w-2xl mx-auto font-light">
            Upload your resume and get professional analysis with actionable improvement suggestions
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Left Side - Resume Tips and Career Resources */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-72 space-y-8"
          >
            <ResumeTips />
            <UtilityLinks title="Career Resources" links={careerResources} />
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-glow rounded-2xl shadow-xl p-8"
              onMouseMove={handleMouseMove}
            >
              <div
                {...getRootProps()}
                className={`relative border-3 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 z-30 ${
                  isDragActive 
                    ? 'border-blue-400 bg-blue-400/10 scale-[0.99]' 
                    : 'border-gray-400/30 hover:border-blue-400/50 hover:bg-white/5'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <DocumentTextIcon className="w-16 h-16 mx-auto text-blue-400" />
                  <p className="text-lg text-blue-100 font-medium">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse files
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PDF, DOC, DOCX, and TXT formats
                  </p>
                </motion.div>
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                      <span className="text-sm text-blue-100 font-medium truncate">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/10 rounded-lg flex items-start space-x-3"
                    >
                      <ExclamationCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}

                  <button
                    onClick={analyzeResume}
                    disabled={loading}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative z-40"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card-glow rounded-2xl shadow-xl p-8 relative z-30"
              style={{ pointerEvents: 'auto' }}
              onMouseMove={handleMouseMove}
            >
              <ResumeAnalysis analysis={analysis} loading={loading} />
            </motion.div>
          </div>

          {/* Right Side - Action Items and Job Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-72 space-y-8"
          >
            <ActionItems analysis={analysis} />
            <UtilityLinks title="Job Resources" links={jobResources} />
          </motion.div>
        </div>
      </main>
    </div>
  );
} 