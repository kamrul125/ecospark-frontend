import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

export default function CreateIdea() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        const dbData = res.data?.data || res.data || [];
        setCategories(dbData);
        if (dbData.length > 0) setCategory(dbData[0].id);
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert("দয়া করে একটি ক্যাটাগরি সিলেক্ট করুন!");
      return;
    }

    setLoading(true);
    try {
      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        categoryId: category,
        // ✅ লজিক: যদি ইমেজ বক্সে লিঙ্ক থাকে তবে সেটি যাবে, নাহলে ডিফল্ট ইমেজ যাবে
        image: image.trim() !== "" 
          ? image.trim() 
          : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
      };

      const response = await API.post("/ideas", ideaData, getAuthHeader());
      
      if (response.data.success || response.status === 201) {
        alert("🎉 Green Vision Shared Successfully!");
        router.push("/dashboard/member");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "আইডিয়া শেয়ার করতে সমস্যা হয়েছে!";
      alert(`❌ Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("waste")) return "♻️";
    if (n.includes("energy")) return "⚡";
    if (n.includes("transportation")) return "🚗";
    if (n.includes("sustainability")) return "🌱";
    return "🌍";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex items-center justify-center px-4 py-16 font-sans grow">
        <div className="w-full max-w-2xl p-10 bg-white border border-gray-100 shadow-2xl rounded-4xl md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Create New <span className="text-green-600">Idea</span>
            </h1>
            <p className="text-sm font-bold tracking-tighter text-gray-400 uppercase">পৃথিবীকে সবুজ করতে আপনার ভাবনা শেয়ার করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Idea Title</label>
              <input 
                type="text" 
                placeholder="আপনার আইডিয়ার নাম..." 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Category</label>
              <select 
                className="w-full p-5 font-bold text-gray-800 border-none cursor-pointer bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required
              >
                <option value="" disabled>ক্যাটাগরি সিলেক্ট করুন</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name} {getEmoji(cat.name)}</option>
                ))}
              </select>
            </div>

            {/* Image URL - ✅ এখন এটি আপনার লিঙ্কটি গুরুত্ব দিবে */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Image URL (Optional)</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg" 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
              <p className="text-[10px] text-gray-400 italic mt-1 ml-1">*ইমেজ লিঙ্ক না দিলে একটি ডিফল্ট সবুজ ইমেজ ব্যবহার করা হবে।</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Description</label>
              <textarea 
                placeholder="আপনার আইডিয়ার বিস্তারিত বিবরণ লিখুন..." 
                rows={6} 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none leading-relaxed" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-5 text-lg font-black text-white bg-green-600 rounded-2xl shadow-xl hover:bg-gray-900 transition-all uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Sharing..." : "Post My Idea 🚀"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}