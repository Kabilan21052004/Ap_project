import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface UtilityLink {
  name: string;
  description: string;
  url: string;
  startColor: string;
  endColor: string;
}

interface UtilityLinksProps {
  title: string;
  links: UtilityLink[];
}

const UtilityLinks: React.FC<UtilityLinksProps> = ({ title, links }) => {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-6">
        <ArrowTopRightOnSquareIcon className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="grid gap-4">
        {links.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative p-4 rounded-lg border border-white/10 backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-transform duration-200"
            style={{
              background: `linear-gradient(135deg, ${link.startColor}40, ${link.endColor}40)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
            <h3 className="font-medium text-white mb-1">{link.name}</h3>
            <p className="text-sm text-white/70">{link.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default UtilityLinks; 