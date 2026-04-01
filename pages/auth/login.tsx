import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../utils/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      
      // পোস্টম্যান রেসপন্স অনুযায়ী: res.data.data.token
      if (res.data.status === "success" && res.data.data) {
        const { token, user } = res.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // রোল অনুযায়ী রিডাইরেক্ট
        if (user.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/member');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20 grow">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-12 bg-white border border-gray-100 shadow-2xl rounded-4xl shadow-green-100/30">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-4xl font-black tracking-tighter text-gray-900">Welcome <span className="italic text-green-600">Back</span></h2>
            <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">লগইন করে আপনার গ্রিন জার্নি শুরু করুন</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <input type="email" required placeholder="Email Address" className="w-full p-5 text-sm font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="w-full p-5 text-sm font-bold text-gray-800 border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:bg-white" onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" disabled={loading} className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-green-600 shadow-xl rounded-2xl hover:bg-green-700 active:scale-95 disabled:opacity-50 flex justify-center items-center">
              {loading ? "Authenticating..." : "Login Now 🚀"}
            </button>
          </form>

          <div className="pt-8 mt-10 text-center border-t border-gray-50">
            <p className="text-sm font-bold text-gray-400">
              Don't have an account? <Link href="/auth/signup" className="font-black text-green-600 hover:underline underline-offset-4">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}