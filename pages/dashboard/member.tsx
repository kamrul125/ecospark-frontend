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
}

export default function MemberDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Ideas
  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Backend route এর সাথে match করা
      const res = await API.get("/ideas"); // "my-ideas" না, backend অনুযায়ী
      const rawData = res.data?.data || res.data?.result || res.data || [];
      const finalData: Idea[] = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
      setIdeas(finalData);
      console.log("Dashboard Data Loaded:", finalData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setIdeas([]);
      setError("Failed to load your ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // ✅ Handle Delete
  const handleDelete = async (id: string) => {
    if (!id) return alert("Error: Idea ID not found.");

    if (!confirm("Are you sure you want to delete this idea?")) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      await API.delete(`/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // UI থেকে সাথে সাথে রিমুভ করা
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      alert("✅ Successfully deleted!");
    } catch (err: any) {
      console.error("Delete failed:", err.response?.data);
      alert(err.response?.data?.message || "Failed to delete idea.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />
      <main className="w-full max-w-6xl px-6 py-10 mx-auto grow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            My Dashboard <span className="text-green-600">({ideas.length})</span>
          </h1>
          <Link
            href="/ideas/create"
            className="px-6 py-3 font-bold text-white bg-green-600 rounded-2xl hover:bg-green-700 transition-all"
          >
            + New Idea
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-gray-500">Loading your ideas...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center bg-white shadow-sm rounded-[40px] border border-dashed border-gray-300">
            <p className="text-xl font-bold text-red-500">{error}</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="p-20 text-center bg-white shadow-sm rounded-[40px] border border-dashed border-gray-300">
            <p className="text-xl font-bold text-gray-400">You haven't shared any ideas yet.</p>
            <Link
              href="/ideas/create"
              className="inline-block mt-4 text-green-600 font-black hover:underline"
            >
              Start sharing now 🚀
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, index) => (
              <div
                key={idea.id || `idea-${index}`}
                className="group p-5 bg-white border border-gray-100 shadow-xl rounded-4xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"}
                    className="object-cover w-full h-48 group-hover:scale-110 transition-transform duration-500"
                    alt={idea.title || "Idea Image"}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-green-700 shadow-sm">
                    🔥 {idea.voteCount || 0} Votes
                  </div>
                </div>

                <h2 className="mt-5 text-xl font-black text-gray-900 line-clamp-1">{idea.title}</h2>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{idea.description}</p>

                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/ideas/${idea.id}`}
                    className="flex-1 text-center py-3 text-[11px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    EDIT / VIEW
                  </Link>

                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="flex-1 py-3 text-[11px] font-black text-white bg-rose-500 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
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