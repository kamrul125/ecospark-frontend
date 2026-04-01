import React from 'react';
import Link from 'next/link';

interface IdeaProps {
  idea: {
    id: string;
    title: string;
    category: string;
    description: string;
    voteCount?: number;
    isPaid?: boolean;
  }
}

const IdeaCard = ({ idea }: IdeaProps) => {
  return (
    <div className="relative flex flex-col justify-between p-8 overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-sm group rounded-4xl hover:shadow-2xl hover:shadow-green-100/50 hover:-translate-y-2">
      
      {/* 🟢 Background subtle decoration */}
      <div className="absolute w-24 h-24 transition-opacity duration-500 rounded-full opacity-0 -right-4 -top-4 bg-green-50 group-hover:opacity-100"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <span className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-black text-green-700 bg-green-50 rounded-full border border-green-100">
            {idea.category}
          </span>
          {idea.isPaid && (
            <span className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-black text-amber-700 bg-amber-50 rounded-full border border-amber-100">
              Premium
            </span>
          )}
        </div>
        
        <h3 className="mb-3 text-2xl font-black text-gray-900 transition-colors line-clamp-1 group-hover:text-green-600">
          {idea.title}
        </h3>
        
        <p className="mb-6 text-sm font-medium leading-relaxed text-gray-500 line-clamp-3">
          {idea.description}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-6 mt-auto border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-black leading-none text-gray-900">
              {idea.voteCount || 0}
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
              Community Votes
            </span>
          </div>
        </div>
        
        <Link 
          href={`/ideas/${idea.id}`}
          className="flex items-center px-6 py-3 text-sm font-bold text-white transition-all bg-gray-900 shadow-lg group-hover:bg-green-600 rounded-2xl active:scale-90"
        >
          View
          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default IdeaCard;