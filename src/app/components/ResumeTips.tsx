import React from 'react';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface Tip {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

const ResumeTips: React.FC = () => {
  const tips: Tip[] = [
    {
      type: 'success',
      title: 'Highlight Achievements',
      description: 'Use action verbs and quantify results when describing your accomplishments.'
    },
    {
      type: 'warning',
      title: 'Avoid Common Mistakes',
      description: 'Remove personal pronouns, outdated skills, and irrelevant experience.'
    },
    {
      type: 'info',
      title: 'ATS Optimization',
      description: 'Include relevant keywords from the job description to pass ATS screening.'
    },
    {
      type: 'success',
      title: 'Format Consistently',
      description: 'Maintain consistent fonts, spacing, and bullet points throughout.'
    },
    {
      type: 'info',
      title: 'Keep it Concise',
      description: 'Limit your resume to 1-2 pages, focusing on the most relevant information.'
    }
  ];

  const getIcon = (type: Tip['type']) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'info':
        return InformationCircleIcon;
      default:
        return LightBulbIcon;
    }
  };

  const getColor = (type: Tip['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <LightBulbIcon className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Resume Writing Tips</h2>
      </div>
      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = getIcon(tip.type);
          return (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getColor(tip.type)} backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">{tip.title}</h3>
                  <p className="text-sm opacity-80">{tip.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeTips; 