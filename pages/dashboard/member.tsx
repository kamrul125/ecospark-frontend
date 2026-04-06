import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description?: string;
  image?: string;
  voteCount?: number;
  isExpanded?: boolean; // নতুন স্টেট যোগ করা হয়েছে
}

export default function MemberDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      const res = await API.get("/ideas/my-ideas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const finalData = res.data?.data || [];
      
      // ডাটা আসার সময় প্রতিটি আইডিয়াতে isExpanded: false সেট করে দিচ্ছি
      const processedData = (Array.isArray(finalData) ? finalData : []).map((item: Idea) => ({
        ...item,
        isExpanded: false
      }));

      setIdeas(processedData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to load your ideas.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIdeas(); }, []);

  // See More টগল করার ফাংশন
  const toggleExpand = (id: string) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isExpanded: !i.isExpanded } : i))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      await API.delete(`/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      alert("✅ Deleted!");
    } catch (err: any) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full max-w-6xl px-6 py-10 mx-auto grow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Dashboard</h1>
          <Link href="/ideas/create" className="px-6 py-3 font-bold text-white bg-green-600 rounded-2xl">+ New Idea</Link>
        </div>

        {loading ? (
          <div className="py-20 text-center">Loading...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <div key={idea.id} className="flex flex-col justify-between p-5 bg-white border border-gray-100 shadow-xl rounded-4xl">
                <div>
                  <img 
                    src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"} 
                    className="object-cover w-full h-48 rounded-2xl" 
                    alt={idea.title} 
                  />
                  <h2 className="mt-5 text-xl font-black text-gray-900">{idea.title}</h2>
                  
                  {/* ডেসক্রিপশন সেকশন উইথ See More */}
                  <div className="mt-2">
                    <p className={`text-sm text-gray-500 leading-relaxed ${!idea.isExpanded ? "line-clamp-3" : ""}`}>
                      {idea.description || "No description provided."}
                    </p>
                    
                    {idea.description && idea.description.length > 80 && (
                      <button 
                        onClick={() => toggleExpand(idea.id)}
                        className="text-[11px] font-black text-indigo-600 mt-2 uppercase hover:underline cursor-pointer"
                      >
                        {idea.isExpanded ? "Show Less ▲" : "See More ▼"}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/ideas/${idea.id}`}
                    className="flex-1 text-center py-3 text-[11px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    EDIT IDEA
                  </Link>
                  <button 
                    onClick={() => handleDelete(idea.id)} 
                    className="flex-1 py-3 text-[11px] font-black text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}