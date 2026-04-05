import React from "react";
import Link from "next/link";

interface IdeaProps {
  idea: {
    id: string;
    title: string;
    category: { id: string; name: string } | string;
    description: string;
    voteCount?: number;
    status?: string;
    userId?: string;
    isPaid?: boolean;
    image?: string;
  };
  currentUser?: { id: string };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const IdeaCard = ({ idea, currentUser, onEdit, onDelete }: IdeaProps) => {
  const status = idea.status?.toUpperCase() || "DRAFT";
  const votes = idea.voteCount || 0;
  const ideaId = idea.id;

  return (
    <div className="relative flex flex-col justify-between p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-4xl hover:shadow-2xl group">
      
      <div className="relative h-56 mb-4 overflow-hidden rounded-3xl">
        <img 
          src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80"} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          alt={idea.title}
        />
      </div>

      <span className="px-3 py-1 mb-2 text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 rounded-full border border-green-100">
        {typeof idea.category === "string" ? idea.category : idea.category?.name || "Uncategorized"}
      </span>

      <h3 className="mb-2 text-xl font-black text-gray-900 line-clamp-2 group-hover:text-green-600">
        {idea.title}
      </h3>
      <p className="mb-4 text-sm text-gray-500 line-clamp-3">{idea.description}</p>

      <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-lg font-black text-gray-900">{votes}</span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
            Votes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && idea.userId === currentUser.id && onEdit && status === "DRAFT" && (
            <button
              onClick={() => onEdit(ideaId)}
              className="px-3 py-1 text-[10px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
            >
              EDIT
            </button>
          )}
          {currentUser && idea.userId === currentUser.id && onDelete && (
            <button
              onClick={() => onDelete(ideaId)}
              className="px-3 py-1 text-[10px] font-black text-white bg-rose-500 rounded-xl hover:bg-rose-600"
            >
              DELETE
            </button>
          )}

          <Link 
            href={`/ideas/${ideaId}`}
            className="px-3 py-1 text-[10px] font-black text-white bg-gray-900 rounded-xl hover:bg-green-600"
          >
            VIEW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;