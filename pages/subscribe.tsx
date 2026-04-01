import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../utils/api";

export default function Subscribe() {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async (plan: string, price: number) => {
    setLoading(true);
    try {
      // ব্যাকএন্ডে পেমেন্ট ইনিশিয়েট করার রিকোয়েস্ট
      const res = await API.post("/payments/init", { plan, price });
      
      // SSLCommerz থেকে আসা গেটওয়ে লিঙ্কে রিডাইরেক্ট করা
      if (res.data.gatewayUrl) {
        window.location.href = res.data.gatewayUrl;
      }
    } catch (err) {
      alert("পেমেন্ট গেটওয়ে লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 font-black text-[10px] uppercase tracking-[0.3em] text-green-700">Redirecting to Secure Gateway...</p>
        </div>
      )}

      <main className="w-full max-w-6xl px-6 py-20 mx-auto text-center grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="mb-4 text-5xl font-black tracking-tighter text-gray-900 md:text-6xl">
            Upgrade to <span className="italic text-green-600">EcoSpark Pro</span>
          </h1>
          <p className="max-w-xl mx-auto font-bold leading-relaxed text-gray-500">
            প্রিমিয়াম আইডিয়া, এক্সক্লুসিভ গাইড এবং গ্রিন ইনভেস্টমেন্ট ব্লুপ্রিন্ট আনলক করতে আপনার প্ল্যান বেছে নিন।
          </p>
        </motion.div>

        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          
          {/* 🌿 Basic Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col p-10 transition-all bg-white border border-gray-100 shadow-xl rounded-4xl shadow-green-100/20 hover:shadow-2xl"
          >
            <h2 className="mb-4 text-sm font-black tracking-[0.2em] text-gray-400 uppercase">Free Member</h2>
            <div className="mb-8">
              <span className="text-6xl font-black text-gray-900">৳0</span>
              <span className="text-sm font-bold tracking-widest text-gray-400">/MONTH</span>
            </div>
            <ul className="mb-10 space-y-4 text-left grow">
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <span className="text-green-500">✔</span> View Public Ideas
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <span className="text-green-500">✔</span> Vote on Projects
              </li>
              <li className="flex items-center gap-3 text-sm italic font-bold text-gray-300">
                <span className="text-gray-200">✕</span> Premium Blueprints
              </li>
              <li className="flex items-center gap-3 text-sm italic font-bold text-gray-300">
                <span className="text-gray-200">✕</span> Direct Expert Chat
              </li>
            </ul>
            <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 cursor-not-allowed rounded-2xl border border-gray-100">
              Current Plan
            </button>
          </motion.div>

          {/* 💎 Pro Plan (Recommended) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative flex flex-col p-10 transition-all bg-white border-2 border-green-500 shadow-2xl rounded-4xl shadow-green-200/40 hover:scale-[1.02]"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
              Most Popular
            </div>
            <h2 className="mb-4 text-sm font-black tracking-[0.2em] text-green-600 uppercase">EcoSpark Pro</h2>
            <div className="mb-8">
              <span className="text-6xl font-black text-gray-900">৳499</span>
              <span className="text-sm font-bold tracking-widest text-gray-400">/MONTH</span>
            </div>
            <ul className="mb-10 space-y-4 text-left grow">
              <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <span className="font-black text-green-600">✔</span> All Free Features
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <span className="font-black text-green-600">✔</span> Premium Idea Blueprints
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <span className="font-black text-green-600">✔</span> Cost & Resource Analysis
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <span className="font-black text-green-600">✔</span> Expert Consultation
              </li>
            </ul>
            <button 
              onClick={() => handleSubscription("PRO_MONTHLY", 499)}
              disabled={loading}
              className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all bg-green-600 shadow-xl rounded-2xl shadow-green-200 hover:bg-green-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Please Wait..." : "Upgrade Now 🚀"}
            </button>
          </motion.div>

        </div>

        <div className="flex items-center justify-center gap-4 mt-16 opacity-50">
          <div className= "w-12 bg-gray-300 h-1px"></div>
          <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">
            Secured by SSLCommerz
          </p>
          <div className="w-12 bg-gray-300 h-1px"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}