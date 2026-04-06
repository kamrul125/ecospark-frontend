import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174";

export default function IdeaDetails() {
  const router = useRouter();
  const { id: queryId } = router.query;
  const id = typeof queryId === "string" ? queryId : "";

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchIdeaDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res: any = await API.get(`/ideas/${id}`);
      const ideaData = res.data?.data || res.data;
      setIdea(ideaData);
      setImageUrl(ideaData?.image || DEFAULT_IMAGE);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (router.isReady && id) fetchIdeaDetails();
  }, [id, router.isReady, fetchIdeaDetails]);

  const handleIdeaUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await API.put(`/ideas/${id}`, {
        title: idea?.title,
        description: idea?.description,
        image: imageUrl
      }, getAuthHeader());

      alert("আইডিয়া সফলভাবে আপডেট হয়েছে! ✨");
      fetchIdeaDetails(); // ডাটা রিফ্রেশ করবে
      window.scrollTo({ top: 0, behavior: 'smooth' }); // স্ক্রল করে উপরে নিয়ে যাবে
    } catch (err: any) {
      alert(err.response?.data?.message || "আপডেট ব্যর্থ হয়েছে!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full max-w-4xl px-6 py-12 mx-auto grow">
        
        {/* ভিউ সেকশন */}
        <div className="bg-white shadow-xl rounded-[40px] mb-10 overflow-hidden">
          <img src={imageUrl} className="object-cover w-full h-80" alt="" />
          <div className="p-8 md:p-14">
            <h1 className="mb-6 text-4xl font-black text-gray-900">{idea?.title}</h1>
            <p className="text-lg text-gray-500 whitespace-pre-line">{idea?.description}</p>
          </div>
        </div>

        {/* এডিট ফর্ম সেকশন */}
        <div className="bg-white p-8 md:p-14 rounded-[40px] shadow-lg border border-indigo-100">
          <h3 className="mb-8 text-2xl font-black text-gray-900">Edit Idea Details</h3>
          <form onSubmit={handleIdeaUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 text-xs font-black text-gray-400 uppercase">Title</label>
              <input 
                value={idea?.title || ""} 
                onChange={(e) => setIdea({ ...idea, title: e.target.value })} 
                className="w-full p-5 border bg-gray-50 rounded-2xl focus:ring-2 focus:ring-indigo-300" 
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-black text-gray-400 uppercase">Image URL</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-5 border bg-gray-50 rounded-2xl" />
            </div>
            <div>
              <label className="block mb-2 text-xs font-black text-gray-400 uppercase">Description</label>
              <textarea 
                rows={4} 
                value={idea?.description || ""} 
                onChange={(e) => setIdea({ ...idea, description: e.target.value })} 
                className="w-full p-5 border bg-gray-50 rounded-2xl" 
              />
            </div>
            <button type="submit" disabled={updating} className="w-full py-5 font-black text-white bg-indigo-600 rounded-2xl">
              {updating ? "Saving..." : "SAVE CHANGES ✨"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}