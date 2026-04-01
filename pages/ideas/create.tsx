import { useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CreateIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // সরাসরি ডাটাবেসের এনার্জি ক্যাটাগরি আইডি ডিফল্ট হিসেবে সেট করা
  const [category, setCategory] = useState("3bb3df6b-55af-404f-922a-f887b7440461");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        alert("❌ আপনি লগইন করা নেই! দয়া করে আবার লগইন করুন।");
        setLoading(false);
        return;
      }

      const ideaData = {
        title,
        description,
        categoryId: category,
        image: image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
      };

      await API.post("/ideas", ideaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("🎉 Your Green Vision has been shared!");
      setTitle("");
      setDescription("");
      setImage("");
      
    } catch (err: any) {
      console.error("Full Error:", err);
      const errorMsg = err.response?.data?.message || "Submission failed!";
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-16 grow">
        <div className="w-full max-w-2xl p-10 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Create New <span className="text-green-600">Idea</span>
            </h1>
            <p className="italic font-medium text-gray-500">আপনার পরিবেশবান্ধব আইডিয়াটি বিশ্বকে জানান</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title</label>
              <input
                type="text"
                placeholder="আইডিয়ার নাম..."
                className="w-full p-4 font-bold border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description</label>
              <textarea
                placeholder="বিস্তারিত লিখুন..."
                rows={5}
                className="w-full p-4 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="w-full p-4 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
              <select
                className="w-full p-4 font-bold border border-gray-100 outline-none cursor-pointer bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {/* সরাসরি আইডিগুলো বসিয়ে দেওয়া হয়েছে */}
                <option value="3bb3df6b-55af-404f-922a-f887b7440461">Energy ⚡</option>
                <option value="41ef6f1e-ade1-4abe-ade2-581896796695">Waste ♻️</option>
                <option value="7dd12cc1-d0b8-416e-a5ee-826727012502">Transportation 🚲</option>
                <option value="95a0516d-de19-40ee-8114-1e05a815a208">Sustainability 🌱</option>
              </select>
            </div>

            <button 
              disabled={loading}
              className={`w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700 shadow-xl shadow-green-100'}`}
            >
              {loading ? "Sharing..." : "Share Your Idea 🚀"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}