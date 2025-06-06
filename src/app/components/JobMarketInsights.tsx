import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface JobMarketInsightsProps {
  analysis: string;
}

interface JobInsight {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const JobMarketInsights: React.FC<JobMarketInsightsProps> = ({ analysis }) => {
  // Extract key skills and experience from analysis
  const extractKeywords = (text: string) => {
    const skillsRegex = /skills?|technologies?|programming|languages?|frameworks?/gi;
    const experienceRegex = /experience|worked|developed|managed|led/gi;
    
    const words = text.split(/\s+/);
    const skills = words.filter(word => word.match(skillsRegex));
    const experience = words.filter(word => word.match(experienceRegex));
    
    return { skills, experience };
  };

  const { skills, experience } = extractKeywords(analysis);

  const insights: JobInsight[] = [
    {
      title: 'In-Demand Roles',
      description: 'Software Engineer, Data Scientist, Cloud Engineer, DevOps Engineer, Full Stack Developer are trending in India',
      icon: BriefcaseIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Salary Range',
      description: '₹6,00,000 – ₹35,00,000 based on your experience and skill set',
      icon: CurrencyDollarIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'Skill Development',
      description: 'Consider learning: Cloud Computing, AI/ML, Cybersecurity, Data Analytics, Blockchain',
      icon: AcademicCapIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      title: 'Growth Opportunities',
      description: '30% projected job growth in tech and IT sectors in India over the next 3 years',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      title: 'Top Locations',
      description: 'Bengaluru, Hyderabad, Pune, Gurugram, Mumbai have high demand',
      icon: MapPinIcon,
      color: 'bg-gradient-to-r from-red-500 to-red-600'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Job Market Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${insight.color} rounded-lg p-6 relative overflow-hidden`}
          >
            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <insight.icon className="h-8 w-8 text-white/90 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobMarketInsights; 