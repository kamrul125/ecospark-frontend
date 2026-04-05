import { useState, useEffect } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

export default function CreateIdea() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // আপনার ডাটাবেস স্ক্রিনশট অনুযায়ী 'Waste' ক্যাটাগরির আইডি ডিফল্ট করা হলো
  const [category, setCategory] = useState("c2080777-5cb9-4dd6-b8a7-7d5b2db76e47");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // টোকেন চেক করা হচ্ছে
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        alert("❌ আপনি লগইন করা নেই! দয়া করে আবার লগইন করুন।");
        router.push("/auth/login"); // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ আপডেট করা হয়েছে
        return;
      }

      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        categoryId: category,
        image: image.trim() || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
      };

      // এপিআই কল (আপনার API ইউটিলিটি ব্যবহার করে)
      const response = await API.post("/ideas", ideaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("🎉 Your Green Vision has been shared successfully!");
        
        // ফর্ম রিসেট
        setTitle("");
        setDescription("");
        
        /**
         * গুরুত্বপূর্ণ: আপনার 'pages/ideas.tsx' ফাইল নেই।
         * তাই আমরা ইউজারকে হোম পেজে অথবা মেম্বার ড্যাশবোর্ডে পাঠিয়ে দিচ্ছি।
         */
        router.push("/"); 
      }

    } catch (err: any) {
      console.error("Full Error Details:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Submission failed! Please try again.";
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
            <p className="italic font-medium text-gray-500">আপনার পরিবেশবান্ধব আইডিয়াটি বিশ্বকে জানান</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title</label>
              <input
                type="text"
                placeholder="আইডিয়ার নাম..."
                className="w-full p-4 font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description</label>
              <textarea
                placeholder="বিস্তারিত লিখুন..."
                rows={5}
                className="w-full p-4 text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Category Select - IDs matched with your Prisma Screenshot */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
              <select
                className="w-full p-4 font-bold text-gray-800 border border-gray-100 outline-none cursor-pointer bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="c2080777-5cb9-4dd6-b8a7-7d5b2db76e47">Waste ♻️</option>
                <option value="67243b53-95e2-47a5-a3c8-044f51952e46">Energy ⚡</option>
                <option value="4cec4e26-9309-42db-973d-55e143007077">Others 🌍</option>
              </select>
            </div>

            {/* Image URL Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-4 text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <button 
              type="submit"
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