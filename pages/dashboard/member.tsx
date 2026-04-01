import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function MemberDashboard() {
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // এখানে আপনার ব্যাকএন্ড এন্ডপয়েন্ট অনুযায়ী ডাটা ফেচ হবে
    API.get("/ideas/my-ideas")
      .then((res) => setMyIdeas(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await API.delete(`/ideas/${id}`);
        setMyIdeas(myIdeas.filter((idea) => idea.id !== id));
      } catch (err) {
        alert("Failed to delete idea");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="w-full px-6 py-12 mx-auto grow max-w-7xl">
        {/* 📊 Dashboard Header */}
        <div className="flex flex-col items-center justify-between gap-6 p-8 mb-12 bg-white border border-gray-100 shadow-sm md:flex-row rounded-4xl">
          <div>
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Member <span className="text-green-600">Dashboard</span>
            </h1>
            <p className="italic font-medium text-gray-500">আপনার সব গ্রিন আইডিয়া এখান থেকে ম্যানেজ করুন।</p>
          </div>
          <Link 
            href="/ideas/create" 
            className="px-8 py-4 font-black text-white transition-all bg-green-600 shadow-lg rounded-2xl shadow-green-100 hover:bg-green-700 active:scale-95"
          >
            + Create New Idea
          </Link>
        </div>

        {/* 📈 Stats Summary */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Total Ideas</p>
            <p className="text-4xl font-black text-gray-900">{myIdeas.length}</p>
          </div>
          <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Active Status</p>
            <p className="text-4xl font-black tracking-tighter text-green-600">Member</p>
          </div>
          <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">Impact Score</p>
            <p className="text-4xl font-black text-amber-500">🏆 95</p>
          </div>
        </div>

        {/* 📝 My Ideas Table/List */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-4xl">
          <div className="flex items-center justify-between p-8 border-b border-gray-50">
            <h2 className="text-2xl font-black text-gray-900">My Posted Ideas</h2>
          </div>

          {loading ? (
            <div className="p-20 font-bold text-center text-gray-400">Loading your ideas...</div>
          ) : myIdeas.length === 0 ? (
            <div className="p-20 text-center">
              <p className="mb-4 text-2xl font-bold text-gray-300">No ideas posted yet!</p>
              <Link href="/ideas/create" className="font-black text-green-600 hover:underline">Start sharing now →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs font-black tracking-widest text-gray-400 uppercase bg-gray-50">
                  <tr>
                    <th className="px-8 py-4">Idea Title</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4 text-center">Votes</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myIdeas.map((idea) => (
                    <tr key={idea.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900">{idea.title}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase">
                          {idea.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-center text-gray-700">
                        {idea.voteCount || 0}
                      </td>
                      <td className="px-8 py-6 space-x-4 text-right">
                        <Link 
                          href={`/ideas/edit/${idea.id}`} 
                          className="text-sm font-bold text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(idea.id)}
                          className="text-sm font-bold text-red-500 hover:underline"
                        >
                          Delete
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