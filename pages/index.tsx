import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../utils/api";
import IdeaCard from "../components/IdeaCard";
import { useRouter } from "next/router";

const categories = ["All", "Energy", "Waste", "Transportation", "Sustainability"];

export default function Home() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try { setCurrentUser(JSON.parse(userData)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    API.get("/ideas")
      .then((res) => {
        const data = res.data?.data || res.data?.result || res.data || [];
        const finalData = Array.isArray(data) ? data : [];
        setIdeas(finalData);
        setFilteredIdeas(finalData);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setIdeas([]);
        setFilteredIdeas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ ক্যাটাগরি ফিল্টারিং ফিক্স
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredIdeas(ideas);
    } else {
      const filtered = ideas.filter((idea) => {
        const ideaCatName = idea.category?.name?.trim().toLowerCase();
        const selectedCatName = activeCategory.trim().toLowerCase();
        return ideaCatName === selectedCatName;
      });
      setFilteredIdeas(filtered);
    }
  }, [activeCategory, ideas]);

  const handleDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত এটি ডিলিট করতে চান?")) {
      try {
        await API.delete(`/ideas/${id}`);
        setIdeas(prev => prev.filter(i => i.id !== id));
        alert("সফলভাবে ডিলিট হয়েছে! ✅");
      } catch (err) { alert("ডিলিট করতে সমস্যা হয়েছে।"); }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full px-6 py-16 mx-auto grow max-w-7xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeCategory === cat ? "bg-green-600 text-white shadow-xl scale-105" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-t-4 border-green-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          /* ✅ ফিক্সড গ্রিড: items-start যোগ করা হয়েছে */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  currentUser={currentUser || undefined} 
                  onDelete={handleDelete} 
                  // ✅ এডিট পাথ ফিক্স (৪-০-৪ এরর ঠেকাতে)
                  onEdit={(id) => router.push(`/ideas/${id}?edit=true`)} 
                />
              ))
            ) : (
              <div className="py-20 text-center bg-white border border-gray-200 border-dashed rounded-[40px] col-span-full">
                <p className="text-2xl font-black text-gray-300">No ideas found in "{activeCategory}"</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}