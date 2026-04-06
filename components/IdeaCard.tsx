import React, { useState } from "react";
import Link from "next/link";
import API from "../utils/api"; 

interface IdeaProps {
  idea: any;
  currentUser?: { id: string } | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const IdeaCard = ({ idea, currentUser, onEdit, onDelete }: IdeaProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [votes, setVotes] = useState(idea.voteCount || 0);
  const [isVoting, setIsVoting] = useState(false);

  const status = idea.status?.toUpperCase() || "DRAFT";
  const ideaId = idea.id;

  // ✅ আপনার দেওয়া কমেন্ট সাবমিট ফাংশনটি এখানে থাকবে
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;

      if (!token) {
        alert("কমেন্ট করতে আগে লগইন করুন! 😊");
        return;
      }

      await API.post(
        `/ideas/${ideaId}/comments`, 
        { text: commentText }, // আপনার ব্যাকএন্ডে 'content' চাইলে এখানে পরিবর্তন করবেন
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("কমেন্ট সফলভাবে যোগ করা হয়েছে! ✅");
      setCommentText("");
      setShowCommentBox(false);
      // এখানে আইডিয়া অবজেক্ট সরাসরি আপডেট করা কঠিন, তাই সফল হলে ইউজারকে মেসেজ দেখানোই ভালো
    } catch (err: any) {
      console.error("Comment Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "কমেন্ট যোগ করা যায়নি।";
      alert(errorMsg);
    }
  };

  const handleVote = async () => {
    if (!currentUser) return alert("Please login to vote!");
    try {
      setIsVoting(true);
      await API.post(`/ideas/${ideaId}/vote`); 
      setVotes((prev: number) => prev + 1);
    } catch (err) { alert("Error occurred."); }
    finally { setIsVoting(false); }
  };

  return (
    <div className="relative flex flex-col justify-between p-6 transition-all duration-500 bg-white border border-gray-100 shadow-sm rounded-[40px] hover:shadow-2xl group h-full">
      
      <div>
        <div className="relative h-56 mb-5 overflow-hidden rounded-4xl bg-gray-50">
          <img 
            src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            alt={idea.title}
          />
        </div>

        <span className="inline-block px-4 py-1.5 mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
          {typeof idea.category === "string" ? idea.category : idea.category?.name || "Concept"}
        </span>

        <h3 className="mb-2 text-xl font-black text-gray-900 line-clamp-1">{idea.title}</h3>

        <div className="mb-6">
          <p className={`text-sm text-gray-500 leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}>
            {idea.description}
          </p>
          {idea.description && idea.description.length > 100 && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-[10px] font-black text-indigo-600 uppercase">
              {isExpanded ? "Show Less ▲" : "Read More ▼"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-5 mt-auto border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ভোট বাটন */}
            <button onClick={handleVote} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border bg-white hover:bg-emerald-50 transition-all">
              <div className="flex items-center justify-center w-8 h-8 shadow-lg bg-emerald-500 rounded-xl shadow-emerald-100">
                 <span className="text-sm">🔥</span>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-black text-gray-900">{votes}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase">Upvote</span>
              </div>
            </button>

            {/* কমেন্ট টগল বাটন */}
            <button 
              onClick={() => setShowCommentBox(!showCommentBox)}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${showCommentBox ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 hover:bg-blue-50 text-gray-400'}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">💬</span>
                <span className="text-[9px] font-black">{idea.commentCount || 0}</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
             {currentUser && idea.userId === currentUser.id && onEdit && status === "DRAFT" && (
                <button onClick={() => onEdit(ideaId)} className="px-3 py-2 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-xl">Edit</button>
             )}
             <Link href={`/ideas/${ideaId}`} className="px-5 py-2.5 text-[11px] font-black text-white bg-gray-900 rounded-2xl hover:bg-emerald-600">View</Link>
          </div>
        </div>

        {/* ইন-কার্ড কমেন্ট ইনপুট বক্স */}
        {showCommentBox && (
          <div className="flex flex-col gap-2 mt-2">
            <textarea
              className="w-full p-3 text-xs border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
            />
            <button 
              onClick={handleCommentSubmit}
              className="self-end px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl hover:bg-blue-700"
            >
              Post Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;