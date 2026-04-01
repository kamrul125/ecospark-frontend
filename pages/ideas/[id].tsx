import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function IdeaDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      API.get(`/ideas/${id}`)
        .then((res) => setIdea(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleVote = async () => {
    try {
      await API.post(`/ideas/${id}/vote`);
      alert("ধন্যবাদ! আপনার ভোটটি সফলভাবে জমা হয়েছে।💚");
    } catch (err) {
      alert("ভোট দিতে সমস্যা হয়েছে। অনুগ্রহ করে লগইন করুন।");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-12 h-12 border-t-4 border-green-600 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!idea) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="mb-4 text-2xl font-black text-red-500">Idea not found!</p>
      <button onClick={() => router.push('/')} className="font-bold text-green-600 hover:underline">Go Home</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="w-full max-w-5xl px-6 py-12 mx-auto grow">
        {/* 🔙 Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 font-black hover:text-green-600 transition-all uppercase text-[10px] tracking-[0.2em]"
        >
          ← Back to Ideas
        </button>

        <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-4xl shadow-green-100/40">
          
          {/* 🖼️ Hero Image using h-100 (400px) */}
          <div className="relative w-full overflow-hidden h-100 group">
            <img 
              src={idea.image || "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e2?auto=format&fit=crop&q=80"} 
              alt={idea.title}
              className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
            />
            {/* 🎨 Tailwind v4 Syntax: bg-linear-to-t */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-8 left-10">
              <span className="px-6 py-2.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-green-500/50">
                {idea.category}
              </span>
            </div>
          </div>

          {/* 📝 Main Content Section */}
          <div className="p-10 md:p-16 lg:p-20">
            <div className="flex flex-col items-start justify-between gap-12 mb-16 lg:flex-row">
              <div className="grow">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                  {idea.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-2">👤 Author Name</span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="flex items-center gap-2">📅 March 2026</span>
                </div>
              </div>

              {/* 🗳️ Vote Widget using min-w-45 (180px) */}
              <div className="p-10 text-center transition-transform border border-green-100 shadow-sm bg-green-50 rounded-4xl min-w-45 hover:scale-105">
                <p className="mb-1 text-5xl font-black leading-none tracking-tighter text-green-700">
                  {idea.voteCount || 0}
                </p>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-8 opacity-70">Community Votes</p>
                <button 
                  onClick={handleVote}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-green-700 shadow-xl shadow-green-200 transition-all active:scale-90"
                >
                  Vote Now 💚
                </button>
              </div>
            </div>

            {/* 📖 Description Area */}
            <div className="max-w-none">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl font-black tracking-tight text-gray-900">
                  Project Overview
                </h3>
                <div className="h-1 rounded-full grow bg-gray-50"></div>
              </div>
              <p className="text-gray-600 leading-[1.8] text-lg font-medium whitespace-pre-line">
                {idea.description}
              </p>
            </div>

            {/* 💎 Premium Badge */}
            {idea.isPaid && (
              <div className="flex items-center gap-8 p-10 mt-20 border shadow-sm bg-linear-to-r from-amber-50 to-orange-50 rounded-4xl border-amber-100">
                <div className="text-5xl animate-bounce">💎</div>
                <div>
                    <h4 className="mb-1 text-xl font-black tracking-tight text-amber-900">Premium Architecture</h4>
                    <p className="text-sm font-bold leading-relaxed text-amber-700/80">
                        এই আইডিয়াটির পূর্ণাঙ্গ ব্লুপ্রিন্ট, খরচ এবং বাস্তবায়নের গাইড দেখতে প্রিমিয়াম মেম্বারশিপ প্রয়োজন।
                    </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}