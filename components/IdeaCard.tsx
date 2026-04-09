import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router"; 
import API from "../utils/api";

interface IdeaProps {
  idea: any;
  currentUser?: { id: string; name?: string; role?: string } | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const IdeaCard = ({ idea, currentUser, onEdit, onDelete }: IdeaProps) => {
  const router = useRouter(); 
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [votes, setVotes] = useState(idea.voteCount || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [isVoted, setIsVoted] = useState(false); 

  const [comments, setComments] = useState(idea.comments || []);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyingUserName, setReplyingUserName] = useState<string | null>(null);

  const ideaId = idea.id;

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      if (!token) return alert("লগইন করুন! 😊");

      const res = await API.post(
        `/ideas/${ideaId}/comments`,
        { text: commentText, parentId: replyToId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        const newComment = res.data.data;
        // যদি এটি রিপ্লাই হয়, তবে মেইন কমেন্টের replies এরে-তে পুশ করবে
        if (replyToId) {
          setComments((prev: any[]) =>
            prev.map((c) =>
              c.id === replyToId
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : c
            )
          );
        } else {
          setComments((prev: any[]) => [...prev, newComment]);
        }
        
        setCommentText("");
        setReplyToId(null);
        setReplyingUserName(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "ব্যর্থ হয়েছে।");
    }
  };

  const handleVote = async () => {
    if (!currentUser || isVoting) return;
    try {
      setIsVoting(true);
      await API.post(`/ideas/${ideaId}/vote`);
      
      if (isVoted) {
        setVotes((prev: number) => prev - 1);
        setIsVoted(false);
      } else {
        setVotes((prev: number) => prev + 1);
        setIsVoted(true);
      }
    } catch (err) { 
      alert("Error processing vote."); 
    } finally { 
      setIsVoting(false); 
    }
  };

  return (
    <div className="relative flex flex-col justify-between p-6 transition-all duration-500 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-2xl group h-fit">
      <div>
        <div className="relative h-56 mb-5 overflow-hidden rounded-2xl bg-gray-50">
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
        <p className="mb-6 text-sm text-gray-500 leading-relaxed line-clamp-3">{idea.description}</p>
      </div>

      <div className="flex flex-col gap-4 pt-5 mt-auto border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleVote} 
              className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border transition-all shadow-sm ${isVoted ? 'bg-emerald-500 border-emerald-600' : 'bg-white border-gray-100 hover:bg-emerald-50'}`}
            >
              <div className={`flex items-center justify-center w-8 h-8 shadow-md rounded-xl font-bold text-[10px] ${isVoted ? 'bg-white text-emerald-500' : 'bg-emerald-500 text-white'}`}>🔥</div>
              <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] font-black uppercase tracking-tighter ${isVoted ? 'text-white' : 'text-emerald-600'}`}>Vote</span>
                <span className={`text-sm font-black ${isVoted ? 'text-white' : 'text-gray-900'}`}>{votes}</span>
              </div>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setShowCommentBox(!showCommentBox);
              }}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${showCommentBox ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              💬 <span className="ml-1 text-[10px] font-black">{comments.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && idea.userId === currentUser.id && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/ideas/${ideaId}?edit=true`);
                }} 
                className="px-4 py-2.5 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest shadow-sm border border-indigo-100"
              >
                Edit
              </button>
            )}

            {currentUser && (idea.userId === currentUser.id || currentUser.role === "ADMIN") && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onDelete) onDelete(ideaId);
                }} 
                className="px-4 py-2.5 text-[10px] font-black text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest shadow-sm border border-rose-100"
              >
                Delete
              </button>
            )}

            <Link href={`/ideas/${ideaId}`} className="px-5 py-2.5 text-[11px] font-black text-white bg-gray-900 rounded-2xl hover:bg-emerald-600 transition-all shadow-md">
              View
            </Link>
          </div>
        </div>

        {showCommentBox && (
          <div className="mt-4 space-y-4 border-t pt-4 border-gray-50">
            {/* কমেন্ট লিস্ট */}
            <div className="pr-1 space-y-4 overflow-y-auto max-h-80 custom-scrollbar">
              {comments.filter((c: any) => !c.parentId).length > 0 ? (
                comments
                  .filter((c: any) => !c.parentId)
                  .map((mainComment: any) => (
                    <div key={mainComment.id} className="flex flex-col gap-2 mb-4">
                      {/* মেইন কমেন্ট বক্স */}
                      <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-3xl relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{mainComment.user?.name || "Member"}</span>
                          {/* ✅ রিপ্লাই বাটন */}
                          <button 
                            onClick={() => {
                                setReplyToId(mainComment.id);
                                setReplyingUserName(mainComment.user?.name);
                            }}
                            className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase transition-all"
                          >
                            Reply
                          </button>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed font-medium">{mainComment.text || mainComment.content}</p>
                      </div>

                      {/* ✅ নেস্টেড রিপ্লাইগুলো দেখানো */}
                      {mainComment.replies && mainComment.replies.length > 0 && (
                        <div className="ml-8 space-y-2 border-l-2 border-indigo-50 pl-4 mt-1">
                          {mainComment.replies.map((reply: any) => (
                            <div key={reply.id} className="p-3 bg-indigo-50/30 rounded-2xl border border-indigo-50/50">
                                <span className="text-[9px] font-black text-emerald-600 uppercase block mb-1">{reply.user?.name || "Member"}</span>
                                <p className="text-[12px] text-gray-600 leading-tight">{reply.text || reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-[10px] text-center text-gray-400 font-bold italic py-4">No comments yet.</p>
              )}
            </div>

            {/* ইনপুট ফিল্ড (কমেন্ট এবং রিপ্লাই উভয়ের জন্য) */}
            <div className="flex flex-col gap-2 mt-4">
              {replyingUserName && (
                <div className="flex items-center justify-between px-3 py-1 bg-indigo-50 rounded-lg">
                    <span className="text-[10px] font-bold text-indigo-600">Replying to {replyingUserName}</span>
                    <button onClick={() => {setReplyToId(null); setReplyingUserName(null)}} className="text-xs text-rose-500 font-bold">×</button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyToId ? "রিপ্লাই লিখুন..." : "আপনার মতামত লিখুন..."}
                  className="flex-1 px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="px-6 py-3 text-xs font-black text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                  POST
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;