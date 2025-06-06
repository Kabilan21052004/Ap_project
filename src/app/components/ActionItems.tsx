import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  PencilSquareIcon,
  DocumentPlusIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

interface ActionItemsProps {
  analysis: string;
}

interface ActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ElementType;
}

const ActionItems: React.FC<ActionItemsProps> = ({ analysis }) => {
  const actionItems: ActionItem[] = [
    {
      title: 'Update Resume Format',
      description: 'Convert your resume to a more ATS-friendly format like DOCX or plain text.',
      priority: 'high',
      icon: DocumentCheckIcon
    },
    {
      title: 'Add Measurable Results',
      description: 'Include specific numbers and metrics to quantify your achievements.',
      priority: 'high',
      icon: ArrowTrendingUpIcon
    },
    {
      title: 'Enhance Skills Section',
      description: 'Add relevant technical skills and certifications prominently.',
      priority: 'medium',
      icon: PencilSquareIcon
    },
    {
      title: 'Improve Readability',
      description: 'Use clear headings and bullet points for better organization.',
      priority: 'medium',
      icon: ClipboardDocumentCheckIcon
    },
    {
      title: 'Add Project Details',
      description: 'Include more specific details about your key projects.',
      priority: 'low',
      icon: DocumentPlusIcon
    }
  ];

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getPriorityLabel = (priority: ActionItem['priority']) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1) + ' Priority';
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Action Items</h2>
      </div>
      <div className="space-y-4">
        {actionItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getPriorityColor(item.priority)} backdrop-blur-sm`}
          >
            <div className="flex items-start space-x-3">
              <item.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                    {getPriorityLabel(item.priority)}
                  </span>
                </div>
                <p className="text-sm opacity-80 mt-1">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActionItems; 