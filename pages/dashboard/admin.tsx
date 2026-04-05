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
      // ব্যাকএন্ডের বিভিন্ন ফরম্যাট (data.data বা সরাসরি data) হ্যান্ডেল করা
      const rawData = res.data?.data || res.data?.result || res.data || [];
      setMyIdeas(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Fetch Error caught");
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
        await API.delete(`/ideas/${id}`);
        alert("Deleted Successfully!");
        fetchIdeas(); // টেবিল রিফ্রেশ
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full px-6 py-12 mx-auto grow max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 p-8 mb-12 bg-white border border-gray-100 shadow-sm md:flex-row rounded-4xl">
          <div>
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Member <span className="text-green-600">Dashboard</span>
            </h1>
            <p className="text-sm italic font-medium text-gray-500">আপনার সব গ্রিন আইডিয়া এখান থেকে ম্যানেজ করুন।</p>
          </div>
          <Link href="/ideas/create" className="px-8 py-4 font-bold text-white transition-all bg-green-600 shadow-lg rounded-2xl hover:bg-green-700 active:scale-95">
            + Create New Idea
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-12 text-center md:grid-cols-3">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="mb-2 text-xs font-black text-gray-400 uppercase">Total Ideas</p>
            <p className="text-4xl font-black text-gray-900">{myIdeas.length}</p>
          </div>
          <div className="p-6 text-green-600 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="mb-2 text-xs font-black text-gray-400 uppercase">Status</p>
            <p className="text-4xl font-black">Active</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl text-amber-500">
            <p className="mb-2 text-xs font-black text-gray-400 uppercase">Impact</p>
            <p className="text-4xl font-black">🏆 95</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-4xl">
          {loading ? (
            <div className="p-20 font-bold text-center text-gray-400 animate-pulse">Loading ideas...</div>
          ) : myIdeas.length === 0 ? (
            <div className="p-20 text-center border-t border-gray-50">
              <p className="mb-4 text-xl font-bold text-gray-300">No ideas found!</p>
              <button onClick={fetchIdeas} className="mb-4 font-bold text-blue-500 underline">Click to Refresh</button>
              <br />
              <Link href="/ideas/create" className="font-bold text-green-600 hover:underline">Create one now →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs font-black text-gray-400 uppercase bg-gray-50">
                  <tr>
                    <th className="px-8 py-4">Title</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myIdeas.map((idea) => {
                    const ideaId = idea.id || idea._id;
                    const status = idea.status?.toUpperCase() || "DRAFT";
                    return (
                      <tr key={ideaId} className="transition-colors hover:bg-gray-50/50">
                        <td className="px-8 py-6 font-bold text-gray-900">{idea.title}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-700">
                            {status}
                          </span>
                        </td>
                        <td className="px-8 py-6 space-x-3 text-right">
                          <Link href={`/dashboard/edit-idea/${ideaId}`} className="px-4 py-2 text-xs font-black text-white bg-blue-600 shadow-md rounded-xl hover:bg-blue-700">
                            EDIT
                          </Link>
                          <button onClick={() => handleDelete(ideaId)} className="px-4 py-2 text-xs font-black text-white bg-red-500 shadow-md rounded-xl hover:bg-red-600">
                            DELETE
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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