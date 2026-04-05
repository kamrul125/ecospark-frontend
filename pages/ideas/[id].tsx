import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ডিফল্ট ইমেজ ইউআরএল
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174";

export default function IdeaDetails() {
  const router = useRouter();
  const { id: queryId } = router.query;
  const id = Array.isArray(queryId) ? queryId[0] : queryId;

  const [idea, setIdea] = useState<any>(null);
  const [votes, setVotes] = useState(0);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- ইমেজ আপডেটের জন্য নতুন স্টেট (New) ---
  const [imageUrl, setImageUrl] = useState("");

  // কমেন্ট এবং রিপ্লাই স্টেট
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("accessToken");
    }
    return null;
  };

  useEffect(() => {
    if (!router.isReady || !id) return;
    const fetchIdeaDetails = async () => {
      try {
        setLoading(true);
        const res: any = await API.get(`/ideas/${id}`);
        const data = res.data?.data || res.data;
        if (data) {
          setIdea(data);
          setVotes(data?._count?.votes ?? data?.voteCount ?? 0);
          
          // --- ডাটা লোড হওয়ার সময় ছবি সেট করা (New) ---
          setImageUrl(data?.image || DEFAULT_IMAGE);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeaDetails();
  }, [id, router.isReady]);

  // ১. ভোট হ্যান্ডেল
  const handleVote = async () => {
    const token = getAuthToken();
    if (!token) return alert("দয়া করে ভোট দিতে লগইন করুন! 🔑");
    try {
      setVoting(true);
      await API.post(`/votes/${id}`, { type: "UPVOTE" });
      setVotes((prev) => prev + 1);
      alert("ভোট সফল হয়েছে! 💚");
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || "ভোট দিতে সমস্যা হয়েছে।"}`);
    } finally {
      setVoting(false);
    }
  };

  // ২. কমেন্ট ও রিপ্লাই হ্যান্ডেল
  const handleCommentSubmit = async (parentId: string | null = null) => {
    const token = getAuthToken();
    if (!token) return alert("আগে লগইন করুন! 😊");
    
    const content = parentId ? replyContent : comment;
    if (!content.trim()) return alert("কিছু লিখুন!");

    try {
      setIsCommenting(true);
      const res = await API.post("/comments", {
        ideaId: id,
        content: content,
        parentId: parentId
      });

      if (res.data?.success) {
        alert(parentId ? "রিপ্লাই সফল হয়েছে! ↩️" : "কমেন্ট সফল হয়েছে! 🎉");
        setComment("");
        setReplyContent("");
        setActiveReplyId(null);
        window.location.reload(); 
      }
    } catch (err: any) {
      alert("পোস্ট করা সম্ভব হয়নি।");
    } finally {
      setIsCommenting(false);
    }
  };

  // ৩. আপডেট হ্যান্ডেল (এখানে ছবি যোগ করা হয়েছে)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return alert("আপডেট করতে লগইন প্রয়োজন!");

    try {
      setUpdating(true);
      // ✅ ব্যাকঅ্যান্ডে নতুন ইমেজ ইউআরএল পাঠানো হচ্ছে
      await API.patch(`/ideas/${id}`, {
        title: idea?.title,
        description: idea?.description,
        image: imageUrl // আপনার দেওয়া নতুন ইমেজ ইউআরএল
      });
      alert("সফলভাবে আপডেট হয়েছে! ✨");
    } catch (err: any) {
      alert("আপডেট ব্যর্থ হয়েছে!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-white"><div className="w-10 h-10 border-t-4 border-green-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />
      <main className="w-full max-w-4xl px-6 py-12 mx-auto grow">
        <div className="overflow-hidden bg-white shadow-xl rounded-[40px] border border-gray-100">
          
          <div className="relative bg-gray-200 h-80">
            {/* ✅ এখানে ডাইনামিক প্রিভিউ দেখানো হচ্ছে (imageUrl) */}
            <img 
              src={imageUrl} 
              alt={idea?.title} 
              className="object-cover w-full h-full" 
            />
            <div className="absolute px-4 py-2 shadow-sm top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">{idea?.category?.name || "Innovation"}</span>
            </div>
          </div>

          <div className="p-8 md:p-14">
            <h1 className="mb-6 text-4xl font-black text-gray-900 md:text-5xl">{idea?.title}</h1>
            <p className="mb-10 text-lg font-medium text-gray-500 whitespace-pre-line">{idea?.description}</p>

            {/* ভোট কার্ড */}
            <div className="flex flex-col items-center justify-between p-8 mb-12 border border-green-100 md:flex-row bg-linear-to-br from-green-50 to-emerald-50 rounded-4xl">
              <div className="text-center md:text-left">
                <p className="text-xs font-black tracking-widest text-green-600 uppercase">Support</p>
                <p className="text-4xl font-black text-gray-900">🔥 {votes} <span className="text-lg font-bold text-gray-400">Votes</span></p>
              </div>
              <button onClick={handleVote} disabled={voting} className="mt-4 md:mt-0 px-12 py-5 font-black text-white bg-green-600 rounded-2xl shadow-2xl active:scale-95 disabled:bg-gray-400">
                {voting ? "Wait..." : "Vote Now 💚"}
              </button>
            </div>

            {/* কমেন্ট সেকশন */}
            <div className="pt-12 border-t border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Community Discussion</h3>
              
              <div className="p-6 mb-12 bg-gray-50 rounded-3xl border border-gray-100">
                <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="আপনার মতামত লিখুন..." className="w-full p-5 bg-white border-2 border-transparent outline-none rounded-2xl focus:border-green-500" />
                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleCommentSubmit(null)} disabled={isCommenting} className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600">Post Comment 🚀</button>
                </div>
              </div>

              <div className="space-y-8 mb-16">
                {idea?.comments?.filter((c: any) => !c.parentId).map((c: any) => (
                  <div key={c.id} className="group">
                    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                      <p className="text-sm font-black text-gray-900 mb-2">{c?.user?.name || "User"}</p>
                      <p className="text-gray-600 text-sm mb-4">{c.content}</p>
                      <button onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)} className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline">Reply ↩️</button>
                      
                      {activeReplyId === c.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                          <textarea rows={2} value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="আপনার রিপ্লাই..." className="w-full p-3 bg-white rounded-xl text-sm outline-none" />
                          <div className="mt-2 flex justify-end gap-2">
                            <button onClick={() => setActiveReplyId(null)} className="text-[9px] font-black text-gray-400">Cancel</button>
                            <button onClick={() => handleCommentSubmit(c.id)} className="px-6 py-2 bg-green-600 text-white text-[9px] font-black rounded-lg">Reply</button>
                          </div>
                        </div>
                      )}
                    </div>
                    {idea?.comments?.filter((r: any) => r.parentId === c.id).map((reply: any) => (
                      <div key={reply.id} className="ml-10 mt-4 p-4 bg-gray-50/50 border-l-4 border-green-200 rounded-r-2xl">
                        <p className="text-[11px] font-black text-gray-700 mb-1">{reply?.user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* এডিট সেকশন (এখন ছবি পরিবর্তনের সুবিধা সহ) */}
            <div className="pt-12 border-t border-gray-100">
              <h3 className="flex items-center gap-2 mb-8 text-2xl font-black text-gray-900">
                <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                Edit Idea Details
              </h3>
              
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-2 ml-2 text-xs font-black text-gray-400 uppercase">Title</label>
                    <input
                      value={idea?.title || ""}
                      onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                      className="w-full p-5 font-bold text-gray-700 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* ✅ ছবি পরিবর্তনের জন্য নতুন ইনপুট ফিল্ড (New) */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 ml-2 text-xs font-black text-gray-400 uppercase">Image URL</label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="নতুন ছবির ইউআরএল দিন (যেমন: Unsplash link)"
                      className="w-full p-5 font-medium text-gray-700 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 ml-2 text-xs font-black text-gray-400 uppercase">Description</label>
                    <textarea
                      rows={5}
                      value={idea?.description || ""}
                      onChange={(e) => setIdea({ ...idea, description: e.target.value })}
                      className="w-full p-5 font-medium text-gray-600 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={updating}
                  className={`w-full py-5 font-black text-white transition-all shadow-xl rounded-2xl active:scale-95 ${
                    updating ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {updating ? "Updating..." : "Save Changes ✨"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}