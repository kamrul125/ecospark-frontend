import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/router";

export default function CreateIdea() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(""); // ✅ ইমেজের জন্য নতুন স্টেট
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        const dbData = res.data?.data || res.data || [];
        setCategories(dbData);

        // প্রথম ক্যাটাগরিকে ডিফল্ট হিসেবে সিলেক্ট করা
        if (dbData.length > 0) {
          setCategory(dbData[0].id);
        }
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category!");
      return;
    }

    setLoading(true);
    try {
      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        categoryId: category,
        // ✅ ইউজার ইমেজ লিঙ্ক না দিলে একটি ডিফল্ট ইমেজ সেট হবে
        image: image.trim() || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
      };

      const response = await API.post("/ideas", ideaData);
      if (response.data.success) {
        alert("🎉 Green Vision Shared Successfully!");
        router.push("/");
      }
    } catch (err: any) {
      alert(`❌ Error: ${err.response?.data?.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  // ইমোজি ফাংশন: নামের ওপর ভিত্তি করে ইমোজি দেখাবে
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Title</label>
              <input
                type="text"
                placeholder="আইডিয়ার নাম..."
                className="w-full p-4 font-bold text-gray-800 transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Category</label>
              <select
                className="w-full p-4 font-bold text-gray-800 border border-gray-100 outline-none cursor-pointer bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>ক্যাটাগরি সিলেক্ট করুন</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {getEmoji(cat.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Image URL Field (নতুন যোগ করা হয়েছে) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Image URL</label>
              <input
                type="text"
                placeholder="ইমেজের লিঙ্ক দিন (যেমন: https://...)"
                className="w-full p-4 font-bold text-gray-800 transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Description</label>
              <textarea
                placeholder="বিস্তারিত লিখুন..."
                rows={5}
                className="w-full p-4 text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 text-lg font-black text-white transition-all bg-green-600 shadow-xl rounded-2xl hover:bg-green-700 active:scale-95 shadow-green-100"
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