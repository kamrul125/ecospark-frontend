import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../utils/api";
import Link from "next/link";

const categories = ["All", "Energy", "Waste", "Transportation"];

export default function Home() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // API থেকে আইডিয়াগুলো ফেচ করা
    API.get("/ideas")
      .then((res) => {
        // পোস্টম্যান রেসপন্স অনুযায়ী: res.data.data
        const fetchedData = res.data?.data || []; 
        const dataArray = Array.isArray(fetchedData) ? fetchedData : [];
        
        setIdeas(dataArray);
        setFilteredIdeas(dataArray);
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
        setIdeas([]);
        setFilteredIdeas([]);
      });
  }, []);

  // 🔍 Filtering Logic
  useEffect(() => {
    if (!Array.isArray(ideas)) return;

    if (activeCategory === "All") {
      setFilteredIdeas(ideas);
    } else {
      setFilteredIdeas(ideas.filter((item: any) => item.category === activeCategory));
    }
  }, [activeCategory, ideas]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />

      <main className="w-full px-6 py-16 mx-auto grow max-w-7xl">
        
        {/* ✨ Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-5xl font-black tracking-tighter text-gray-900 md:text-7xl">
            Explore Green <span className="italic text-green-600">Innovations</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg font-bold leading-relaxed text-gray-500">
            একটি টেকসই পৃথিবী গড়ার লক্ষ্যে সেরা এনভায়রনমেন্টাল আইডিয়াগুলো খুঁজে নিন।
          </p>
        </motion.div>

        {/* 📑 Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 p-3 mx-auto mb-16 bg-white border border-gray-100 shadow-sm rounded-4xl w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-green-600 text-white shadow-xl shadow-green-100 scale-105' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-green-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🚀 Subscription CTA - Tailwind v4 bg-linear syntax */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex flex-col items-center justify-between p-10 mb-20 overflow-hidden text-white shadow-2xl md:flex-row bg-linear-to-r from-gray-900 to-green-900 rounded-4xl"
        >
          <div className="relative z-10 text-center md:text-left">
            <h2 className="mb-2 text-3xl italic font-black tracking-tight">Unlock Pro Blueprints 💎</h2>
            <p className="font-bold text-green-200/70">প্রিমিয়াম গাইড এবং বিস্তারিত কস্ট অ্যানালাইসিস দেখতে প্রো মেম্বারশিপ নিন।</p>
          </div>
          <Link 
            href="/subscribe" 
            className="relative z-10 mt-8 md:mt-0 bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-400 transition-all shadow-xl active:scale-95"
          >
            Upgrade to Pro
          </Link>
          <div className="absolute top-0 right-0 p-20 text-9xl opacity-10 translate-x-1/4 -translate-y-1/4">🌿</div>
        </motion.div>

        {/* 🗂️ Ideas Grid */}
        <motion.div layout className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {Array.isArray(filteredIdeas) && filteredIdeas.map((idea) => (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-lg group rounded-4xl hover:shadow-2xl"
              >
                <Link href={`/ideas/${idea.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80"} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      alt={idea.title}
                    />
                    {/* Tailwind v4 bg-linear syntax */}
                    <div className="absolute inset-0 transition-opacity opacity-0 bg-linear-to-t from-black/60 to-transparent group-hover:opacity-100"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-green-600 shadow-lg">
                      {idea.category}
                    </div>
                  </div>

                  <div className="p-8">
                    <h2 className="mb-3 text-2xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-green-600">
                      {idea.title}
                    </h2>
                    <p className="mb-6 text-sm font-medium leading-relaxed text-gray-500 line-clamp-2">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-green-500">💚</span>
                        <span className="text-sm font-black text-gray-900">{idea.voteCount || 0} Votes</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-600 group-hover:translate-x-1 transition-transform">
                        Details →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 📭 Empty State */}
        {(!filteredIdeas || filteredIdeas.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <p className="mb-4 text-2xl italic font-black tracking-widest text-gray-300 uppercase">
              No ideas found in {activeCategory}
            </p>
            <Link href="/subscribe" className="text-green-600 font-black text-[10px] uppercase tracking-widest hover:underline">
               Explore Premium Categories Instead →
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}