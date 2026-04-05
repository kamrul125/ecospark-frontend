import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function IdeaDetails() {
  const router = useRouter();
  const { id: queryId } = router.query;
  
  // আইডি নিশ্চিত করা
  const id = Array.isArray(queryId) ? queryId[0] : queryId;

  const [idea, setIdea] = useState<any>(null);
  const [votes, setVotes] = useState(0);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("accessToken");
    }
    return null;
  };

  // ১. আইডিয়া ডিটেইলস ফেচ করা
  useEffect(() => {
    // router.isReady নিশ্চিত করে যে আইডিটি পাওয়া গেছে
    if (!router.isReady || !id) return;

    const fetchIdeaDetails = async () => {
      try {
        setLoading(true);
        const res: any = await API.get(`/ideas/${id}`);
        const data = res.data?.data || res.data;
        
        if (data) {
          setIdea(data);
          // ভোট কাউন্ট সেট করা (Prisma _count রিলেশন অথবা voteCount)
          setVotes(data?._count?.votes ?? data?.voteCount ?? 0);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [id, router.isReady]);

  // ২. ভোট হ্যান্ডেল করা
  const handleVote = async () => {
    const token = getAuthToken();
    if (!token) return alert("দয়া করে ভোট দিতে লগইন করুন! 🔑");

    try {
      setVoting(true);
      await API.post(
        `/votes/${id}`, 
        { type: "UPVOTE" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVotes((prev) => prev + 1);
      alert("ভোট সফল হয়েছে! 💚");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "সম্ভবত আপনি অলরেডি ভোট দিয়েছেন।";
      alert(`❌ ${errorMsg}`);
    } finally {
      setVoting(false);
    }
  };

  // ৩. আপডেট হ্যান্ডেল করা
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return alert("আপডেট করতে লগইন প্রয়োজন!");

    try {
      setUpdating(true);
      await API.patch(
        `/ideas/${id}`, 
        {
          title: idea?.title,
          description: idea?.description,
          image: idea?.image 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("সফলভাবে আপডেট হয়েছে! ✨");
    } catch (err: any) {
      alert("আপডেট ব্যর্থ হয়েছে! ডাটাগুলো আবার চেক করুন।");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 border-t-4 border-green-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!idea) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="text-xl font-black text-rose-500">আইডিয়াটি খুঁজে পাওয়া যায়নি! ❌</p>
      <button onClick={() => router.push("/ideas")} className="px-6 py-2 mt-4 font-bold text-white bg-green-600 shadow-lg rounded-xl">
        আইডিয়া লিস্টে ফিরে যান
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />

      <main className="w-full max-w-4xl px-6 py-12 mx-auto grow">
        <div className="overflow-hidden bg-white shadow-xl rounded-[40px] border border-gray-100">
          
          <div className="relative bg-gray-200 h-80">
            <img
              src={idea?.image || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"}
              alt={idea?.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute px-4 py-2 shadow-sm top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">
                {idea?.category?.name || "Innovation"}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-14">
            <h1 className="mb-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">
              {idea?.title}
            </h1>

            <p className="mb-10 text-lg font-medium leading-relaxed text-gray-500 whitespace-pre-line">
              {idea?.description}
            </p>

            {/* VOTE CARD - Updated with bg-linear and rounded-4xl */}
            <div className="flex flex-col items-center justify-between p-8 mb-12 border border-green-100 md:flex-row bg-linear-to-br from-green-50 to-emerald-50 rounded-4xl">
              <div className="mb-6 text-center md:mb-0 md:text-left">
                <p className="mb-1 text-xs font-black tracking-widest text-green-600 uppercase">Community Support</p>
                <p className="text-4xl font-black text-gray-900">🔥 {votes} <span className="text-lg font-bold text-gray-400">Votes</span></p>
              </div>

              <button
                onClick={handleVote}
                disabled={voting}
                className={`w-full md:w-auto px-12 py-5 font-black text-white rounded-2xl transition-all shadow-2xl active:scale-95 ${
                  voting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {voting ? "Processing..." : "Vote for this Idea 💚"}
              </button>
            </div>

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