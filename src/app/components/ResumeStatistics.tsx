import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ResumeStatisticsProps {
  content: string;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const ResumeStatistics: React.FC<ResumeStatisticsProps> = ({ content }) => {
  // Calculate statistics
  const calculateStats = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const readingTime = Math.ceil(words / 200); // Average reading speed of 200 wpm
    
    // Calculate keyword density
    const commonKeywords = ['experience', 'skills', 'project', 'education', 'work'];
    const keywordCount = commonKeywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);
    
    const keywordDensity = ((keywordCount / words) * 100).toFixed(1);

    return {
      words,
      characters,
      sentences,
      readingTime,
      keywordDensity
    };
  };

  const stats = calculateStats(content);

  const statCards: StatCard[] = [
    {
      title: 'Word Count',
      value: stats.words,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Reading Time',
      value: `${stats.readingTime} min`,
      icon: ClockIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Keyword Density',
      value: `${stats.keywordDensity}%`,
      icon: SparklesIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'ATS Score',
      value: '85%',
      icon: CheckCircleIcon,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Content Score',
      value: '92%',
      icon: ChartBarIcon,
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Resume Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${stat.color} p-4`}
          >
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <stat.icon className="h-8 w-8 text-white/80 mb-2" />
            <p className="text-sm text-white/80">{stat.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResumeStatistics; 