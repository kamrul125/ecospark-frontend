import React, { useState, useEffect } from "react";
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

  // ডাটাবেজ থেকে আসা comments যদি idea.comments এ থাকে তবে সেটা নিবে
  const [comments, setComments] = useState(idea.comments || []);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyingUserName, setReplyingUserName] = useState<string | null>(null);

  const ideaId = idea.id;

  // কনসোলে চেক করার জন্য
  useEffect(() => {
    if (showCommentBox) {
      console.log("Current Comments State:", comments);
    }
  }, [comments, showCommentBox]);

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
    } catch (err) { alert("Error."); } finally { setIsVoting(false); }
  };

  return (
    <div className="relative flex flex-col justify-between p-6 transition-all duration-500 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-2xl group h-fit">
      {/* ক্যাটাগরি এবং টাইটেল অংশ */}
      <div>
        <div className="relative h-56 mb-5 overflow-hidden rounded-2xl bg-gray-50">
          <img
            src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"}
            className="object-cover w-full h-full"
            alt={idea.title}
          />
        </div>
        <span className="inline-block px-4 py-1.5 mb-3 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 rounded-full">
          {typeof idea.category === "string" ? idea.category : idea.category?.name || "Concept"}
        </span>
        <h3 className="mb-2 text-xl font-black text-gray-900 line-clamp-1">{idea.title}</h3>
        <p className="mb-6 text-sm text-gray-500 line-clamp-3">{idea.description}</p>
      </div>

      {/* নিচের বাটনগুলো */}
      <div className="flex flex-col gap-4 pt-5 mt-auto border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleVote} className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${isVoted ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
              🔥 <span className="text-sm font-black">{votes}</span>
            </button>

            {/* কমেন্ট বাটন - এখানে ক্লিক করলেই বক্স খুলবে */}
            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all ${showCommentBox ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              💬 <span className="ml-1 text-[10px] font-black">{comments.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/ideas/${ideaId}`} className="px-5 py-2.5 text-[11px] font-black text-white bg-gray-900 rounded-2xl hover:bg-emerald-600 transition-all">
              View
            </Link>
          </div>
        </div>

        {/* কমেন্ট বক্স অংশ */}
        {showCommentBox && (
          <div className="mt-4 space-y-4 border-t pt-4 border-gray-50">
            <div className="pr-1 space-y-4 overflow-y-auto max-h-80">
              {comments.length > 0 ? (
                comments
                  .filter((c: any) => !c.parentId)
                  .map((mainComment: any) => (
                    <div key={mainComment.id} className="flex flex-col gap-2 mb-4">
                      {/* মেইন কমেন্ট কার্ড */}
                      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">
                            {mainComment.user?.name || "Unknown User"}
                          </span>
                          {/* ✅ রিপ্লাই বাটন - আমি এটাকে আরও বোল্ড করেছি */}
                          <button 
                            onClick={(e) => {
                                e.preventDefault();
                                setReplyToId(mainComment.id);
                                setReplyingUserName(mainComment.user?.name);
                            }}
                            className="text-[10px] font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          >
                            REPLY
                          </button>
                        </div>
                        {/* আপনার ডাটাবেজে ফিল্ডের নাম 'content', তাই এখানে content চেক করছি */}
                        <p className="text-[13px] text-gray-800 font-medium">
                          {mainComment.content || mainComment.text || "No message content"}
                        </p>
                      </div>

                      {/* রিপ্লাই লিস্ট */}
                      {mainComment.replies && mainComment.replies.length > 0 && (
                        <div className="ml-8 space-y-2 border-l-2 border-indigo-100 pl-4 mt-1">
                          {mainComment.replies.map((reply: any) => (
                            <div key={reply.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <span className="text-[9px] font-black text-emerald-600 uppercase block mb-1">
                                  {reply.user?.name || "Member"}
                                </span>
                                <p className="text-[12px] text-gray-700">
                                  {reply.content || reply.text}
                                </p>
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

            {/* ইনপুট এরিয়া */}
            <div className="flex flex-col gap-2 mt-4 bg-gray-50 p-3 rounded-2xl">
              {replyingUserName && (
                <div className="flex items-center justify-between px-3 py-1 bg-indigo-100 rounded-lg">
                    <span className="text-[10px] font-bold text-indigo-700">Replying to {replyingUserName}</span>
                    <button onClick={() => {setReplyToId(null); setReplyingUserName(null)}} className="text-xs text-rose-500 font-black">✕</button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyToId ? "রিপ্লাই দিন..." : "মতামত লিখুন..."}
                  className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none text-black"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="px-5 py-2 text-xs font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                >
                  {replyToId ? "REPLY" : "POST"}
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