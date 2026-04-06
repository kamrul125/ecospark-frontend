import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function MemberDashboard() {
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await API.get("/ideas/my-ideas");
      const rawData = res.data?.data || res.data || [];
      setMyIdeas(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setMyIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        const res = await API.delete(`/ideas/${id}`);
        if (res.data.success) {
          alert("Deleted Successfully! 🎉");
          fetchIdeas();
        }
      } catch (err: any) {
        alert("Delete failed!");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="w-full px-6 py-12 mx-auto grow max-w-7xl">
        
        {/* Header - rounded-4xl ব্যবহার করা হয়েছে */}
        <div className="flex flex-col items-center justify-between gap-6 p-8 mb-12 bg-white border border-gray-100 shadow-sm md:flex-row rounded-4xl">
          <div>
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Member <span className="text-green-600">Dashboard</span>
            </h1>
            <p className="text-sm italic font-medium text-gray-500">
              আপনার সব গ্রিন আইডিয়া এখান থেকে ম্যানেজ করুন।
            </p>
          </div>
          <Link 
            href="/ideas/create" 
            className="px-8 py-4 font-bold text-white transition-all bg-green-600 shadow-lg rounded-2xl hover:bg-green-700 active:scale-95"
          >
            + Create New Idea
          </Link>
        </div>

        {/* Stats Cards - rounded-4xl ব্যবহার করা হয়েছে */}
        <div className="grid grid-cols-1 gap-6 mb-12 text-center md:grid-cols-3">
          <div className="p-8 transition-transform bg-white border border-gray-100 shadow-sm rounded-4xl hover:scale-105">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Total Ideas</p>
            <p className="text-5xl font-black text-gray-900">{myIdeas.length}</p>
          </div>
          <div className="p-8 transition-transform bg-white border border-gray-100 shadow-sm rounded-4xl hover:scale-105">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Status</p>
            <p className="text-4xl font-black text-green-600">Active ✅</p>
          </div>
          <div className="p-8 transition-transform bg-white border border-gray-100 shadow-sm rounded-4xl hover:scale-105">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Impact Point</p>
            <p className="text-4xl font-black text-amber-500">🏆 95</p>
          </div>
        </div>

        {/* Table Container - rounded-4xl ব্যবহার করা হয়েছে */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-4xl">
          {loading ? (
            <div className="p-32 text-2xl font-black text-center text-gray-300 animate-pulse">
              Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] font-black text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-10 py-5">Idea Details</th>
                    <th className="px-10 py-5 text-center">Category</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myIdeas.map((idea) => (
                    <tr key={idea.id} className="transition-all hover:bg-green-50/30">
                      <td className="px-10 py-7">
                        <p className="text-lg font-bold text-gray-900">{idea.title}</p>
                      </td>
                      <td className="px-10 text-center py-7">
                        <span className="px-4 py-1 text-[10px] font-black bg-gray-100 text-gray-600 rounded-lg">
                          {idea.category?.name || "General"}
                        </span>
                      </td>
                      <td className="px-10 space-x-3 text-right py-7">
                        <Link 
                          href={`/ideas/edit/${idea.id}`} 
                          className="inline-block px-5 py-2 text-[10px] font-black text-white bg-blue-600 rounded-xl"
                        >
                          EDIT
                        </Link>
                        <button 
                          onClick={() => handleDelete(idea.id)} 
                          className="px-5 py-2 text-[10px] font-black text-white bg-red-500 rounded-xl"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}