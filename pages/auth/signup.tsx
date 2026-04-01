import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../utils/api';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ব্যাকএন্ডে রেজিস্ট্রেশন রিকোয়েস্ট
      const res = await API.post('/auth/register', { name, email, password });
      
      // পোস্টম্যান রেসপন্স অনুযায়ী সাকসেস চেক
      if (res.data.status === "success") {
        alert("Registration Successful! Now please login.");
        router.push('/auth/login');
      }
    } catch (err: any) {
      // এরর মেসেজটি সঠিকভাবে দেখানো
      const errorMessage = err.response?.data?.message || "সাইনআপ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      alert(errorMessage);
      console.error("Signup Error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20 grow">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-12 bg-white border border-gray-100 shadow-2xl rounded-4xl shadow-green-100/30"
        >
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-4xl font-black tracking-tighter text-gray-900">
              Join <span className="italic text-green-600">EcoSpark</span>
            </h2>
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <input type="text" required placeholder="Full Name" className="w-full p-5 text-sm font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white" onChange={(e) => setName(e.target.value)} />
            <input type="email" required placeholder="Email Address" className="w-full p-5 text-sm font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="w-full p-5 text-sm font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white" onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" disabled={loading} className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-green-600 shadow-xl rounded-2xl hover:bg-green-700 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
              {loading ? "Creating Account..." : "Sign Up Now 🌿"}
            </button>
          </form>

          <div className="pt-8 mt-10 text-center border-t border-gray-50">
            <p className="text-sm font-bold text-gray-400">
              Already have an account? <Link href="/auth/login" className="text-green-600 hover:underline underline-offset-4">Login Here</Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}