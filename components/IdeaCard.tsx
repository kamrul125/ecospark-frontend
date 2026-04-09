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

  const [comments, setComments] = useState(idea.comments || []);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyingUserName, setReplyingUserName] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const ideaId = idea.id;

  const handleVote = async () => {
    if (!currentUser || isVoting) return;
    try {
      setIsVoting(true);
      const res = await API.post(`/ideas/${ideaId}/vote`);
      if (res.data?.success) {
        if (isVoted) {
          setVotes((prev: number) => prev - 1);
          setIsVoted(false);
        } else {
          setVotes((prev: number) => prev + 1);
          setIsVoted(true);
        }
      }
    } catch (err) { 
      console.error("Vote failed", err);
    } finally { 
      setIsVoting(false); 
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      if (!token) return alert("লগইন করুন! 😊");

      if (editingCommentId) {
        const res = await API.patch(`/comments/${editingCommentId}`, 
          { content: commentText },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          const updatedComment = res.data.data;
          setComments((prev: any[]) =>
            prev.map((c) => {
              if (c.id === editingCommentId) return { ...c, content: updatedComment.content };
              if (c.replies) {
                return {
                  ...c,
                  replies: c.replies.map((r: any) => 
                    r.id === editingCommentId ? { ...r, content: updatedComment.content } : r
                  )
                };
              }
              return c;
            })
          );
          setEditingCommentId(null);
        }
      } else {
        const res = await API.post(`/ideas/${ideaId}/comments`,
          { content: commentText, parentId: replyToId || null },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          const newComment = res.data.data;
          if (replyToId) {
            setComments((prev: any[]) =>
              prev.map((c) =>
                c.id === replyToId ? { ...c, replies: [...(c.replies || []), newComment] } : c
              )
            );
          } else {
            setComments((prev: any[]) => [...prev, newComment]);
          }
        }
      }
      setCommentText("");
      setReplyToId(null);
      setReplyingUserName(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "ব্যর্থ হয়েছে।");
    }
  };

  const handleDeleteComment = async (commentId: string, isReply: boolean, parentId?: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      await API.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

      if (isReply && parentId) {
        setComments((prev: any[]) =>
          prev.map((c) =>
            c.id === parentId ? { ...c, replies: c.replies.filter((r: any) => r.id !== commentId) } : c
          )
        );
      } else {
        setComments((prev: any[]) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err: any) { alert("ডিলিট করা যায়নি।"); }
  };

  return (
    <div className="relative flex flex-col justify-between p-6 transition-all duration-500 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-2xl h-fit">
      <div>
        <div className="relative h-56 mb-5 overflow-hidden rounded-2xl bg-gray-50">
          <img src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"} className="object-cover w-full h-full" alt="" />
        </div>
        <h3 className="mb-2 text-xl font-black text-gray-900 line-clamp-1">{idea.title}</h3>
        <p className="mb-6 text-sm text-gray-500 line-clamp-3">{idea.description}</p>
      </div>

      <div className="flex flex-col gap-4 pt-5 mt-auto border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ✅ এখানে VOTE লেখা যোগ করা হয়েছে */}
            <button 
              onClick={handleVote} 
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${isVoted ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'}`}
            >
              <span className="text-xs font-black uppercase">Vote</span>
              <span className="text-sm font-black">{votes}</span>
            </button>

            <button 
              onClick={() => setShowCommentBox(!showCommentBox)} 
              className={`flex items-center justify-center w-12 h-12 rounded-2xl border ${showCommentBox ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              💬 <span className="ml-1 text-[10px] font-black">{comments.length}</span>
            </button>
          </div>
          <Link href={`/ideas/${ideaId}`} className="px-5 py-2.5 text-[11px] font-black text-white bg-gray-900 rounded-2xl hover:bg-emerald-600 transition-all">View</Link>
        </div>

        {showCommentBox && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-4 overflow-y-auto max-h-80 custom-scrollbar">
              {comments.filter((c: any) => !c.parentId).map((mainComment: any) => (
                <div key={mainComment.id} className="flex flex-col gap-2 mb-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{mainComment.user?.name}</span>
                      <div className="flex gap-2">
                        {(currentUser?.id === mainComment.userId || currentUser?.role === 'ADMIN') && (
                          <>
                            <button onClick={() => { setEditingCommentId(mainComment.id); setCommentText(mainComment.content); }} className="text-[9px] font-bold text-gray-500">EDIT</button>
                            <button onClick={() => handleDeleteComment(mainComment.id, false)} className="text-[9px] font-bold text-rose-500">DELETE</button>
                          </>
                        )}
                        <button onClick={() => { setReplyToId(mainComment.id); setReplyingUserName(mainComment.user?.name); }} className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-1 rounded-lg">REPLY</button>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-800 font-medium">{mainComment.content}</p>
                  </div>

                  {mainComment.replies?.map((reply: any) => (
                    <div key={reply.id} className="ml-8 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex justify-between">
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-emerald-600 block">{reply.user?.name}</span>
                        <p className="text-[12px] text-gray-700">{reply.content}</p>
                      </div>
                      {(currentUser?.id === reply.userId || currentUser?.role === 'ADMIN') && (
                        <div className="flex gap-2 ml-2">
                          <button onClick={() => { setEditingCommentId(reply.id); setCommentText(reply.content); }} className="text-[9px] font-bold text-gray-400">EDIT</button>
                          <button onClick={() => handleDeleteComment(reply.id, true, mainComment.id)} className="text-[9px] font-bold text-rose-400">🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 bg-gray-100 p-3 rounded-2xl">
              {(replyingUserName || editingCommentId) && (
                <div className="flex items-center justify-between px-3 py-1 bg-indigo-100 rounded-lg">
                  <span className="text-[10px] font-bold text-indigo-700">
                    {editingCommentId ? "Editing comment..." : `Replying to ${replyingUserName}`}
                  </span>
                  <button onClick={() => { setReplyToId(null); setEditingCommentId(null); setCommentText(""); setReplyingUserName(null); }} className="text-xs text-rose-500 font-black">✕</button>
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="লিখুন..." className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none text-black" />
                <button onClick={handleCommentSubmit} className="px-5 py-2 text-xs font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  {editingCommentId ? "UPDATE" : replyToId ? "REPLY" : "POST"}
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