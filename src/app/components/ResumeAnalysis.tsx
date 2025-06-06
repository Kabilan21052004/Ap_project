import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { DocumentTextIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeStatistics from './ResumeStatistics';
import JobMarketInsights from './JobMarketInsights';

const utilityLinks = [
  {
    name: 'Medium',
    description: 'Read latest articles on resume writing and career development',
    url: 'https://medium.com/tag/resume-tips',
    color: 'from-gray-500 to-black'
  },
  {
    name: 'LinkedIn',
    description: 'Check trending jobs and industry updates',
    url: 'https://www.linkedin.com/jobs',
    color: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Glassdoor',
    description: 'Research company reviews and salaries',
    url: 'https://www.glassdoor.com',
    color: 'from-green-600 to-green-800'
  },
  {
    name: 'Indeed',
    description: 'Browse latest job postings',
    url: 'https://www.indeed.com',
    color: 'from-blue-400 to-blue-600'
  }
];

interface ResumeScoreMeterProps {
  score: number;
}

const ResumeScoreMeter: React.FC<ResumeScoreMeterProps> = ({ score }) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            stroke="rgb(34, 197, 94)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center"
          >
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className="text-lg text-white">/100</span>
          </motion.div>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-4 text-lg font-medium text-white"
      >
        Resume Score
      </motion.p>
    </div>
  );
};

interface ExportOptionsProps {
  onDownloadPDF: () => void;
  onShare: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onDownloadPDF, onShare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center space-x-4 mb-6"
    >
      <button
        onClick={onDownloadPDF}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-200"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        <span>Download PDF</span>
      </button>
      <button
        onClick={onShare}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors duration-200"
      >
        <ShareIcon className="w-5 h-5" />
        <span>Share Results</span>
      </button>
    </motion.div>
  );
};

interface ResumeAnalysisProps {
  analysis: string;
  loading: boolean;
}

const ResumeAnalysis = ({ analysis, loading }: ResumeAnalysisProps) => {
  const analysisRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!analysisRef.current) return;

    try {
      // Create a canvas from the analysis content
      const canvas = await html2canvas(analysisRef.current, {
        scale: 2,
        backgroundColor: '#1a1a1a',
        logging: true, // Enable logging for debugging
        useCORS: true, // Enable CORS for images
        allowTaint: true, // Allow tainted canvas
      });

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add content to PDF
      pdf.setFillColor(26, 26, 26); // Dark background
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      // Add title with white color
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('Resume Analysis Report', 20, 40);
      
      // Add timestamp
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 60);

      // Add the analysis content
      pdf.addImage(imgData, 'PNG', 0, 80, pdfWidth, pdfHeight - 80);

      // Save the PDF
      pdf.save('resume-analysis.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Resume Analysis Results',
          text: 'Check out my resume analysis results!',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const dummyInput = document.createElement('input');
        dummyInput.value = window.location.href;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        document.execCommand('copy');
        document.body.removeChild(dummyInput);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Link copied to clipboard instead.');
    }
  };

  // Calculate a sample score based on analysis length and content
  const calculateScore = (analysisText: string): number => {
    if (!analysisText) return 0;
    // This is a simple example - you would want to implement more sophisticated scoring
    const baseScore = 70; // Start with a base score
    const length = analysisText.length;
    const keywords = ['excellent', 'great', 'good', 'impressive'];
    const keywordCount = keywords.reduce((count, word) => 
      count + (analysisText.toLowerCase().match(new RegExp(word, 'g')) || []).length, 0
    );
    
    let score = baseScore + (keywordCount * 2);
    score = Math.min(100, Math.max(0, score)); // Ensure score is between 0 and 100
    return Math.round(score);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full py-12"
      >
        <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="space-y-2 text-center">
          <p className="text-red-400 font-medium text-lg animate-pulse">Analyzing your resume...</p>
          <p className="text-gray-400 text-sm">This may take a few moments</p>
        </div>
      </motion.div>
    );
  }

  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-full text-center space-y-4"
      >
        <div className="w-16 h-16 text-blue-400">
          <DocumentTextIcon />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">No Resume Analyzed Yet</h3>
          <p className="text-gray-300">
            Upload your resume to get detailed analysis and personalized improvement suggestions
          </p>
        </div>
      </motion.div>
    );
  }

  const score = calculateScore(analysis);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="prose prose-invert max-w-none text-white"
    >
      <ResumeScoreMeter score={score} />
      
      {/* Export Options */}
      <div className="relative">
        <div className="flex justify-center space-x-4 mb-6 relative z-50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPDF();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors duration-200"
          >
            <ShareIcon className="w-5 h-5" />
            <span>Share Results</span>
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <ResumeStatistics content={analysis} />

      {/* Analysis Content */}
      <div ref={analysisRef} className="max-h-[600px] overflow-y-auto custom-scrollbar pr-4 mb-8">
        <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm rounded-lg p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h2>,
                p: ({ children }) => <p className="text-gray-200 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="space-y-2 list-none">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start space-x-2 text-gray-200">
                    <span className="text-blue-400 flex-shrink-0 mt-1">•</span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => <strong className="text-blue-300 font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-purple-300 italic">{children}</em>,
              }}
            >
              {analysis}
            </ReactMarkdown>
          </motion.div>
        </div>
      </div>

      {/* Job Market Insights */}
      <JobMarketInsights analysis={analysis} />
    </motion.div>
  );
};

export default ResumeAnalysis; 