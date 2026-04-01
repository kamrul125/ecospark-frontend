import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false); // প্রো স্ট্যাটাস চেক করার জন্য

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // যদি আপনার টোকেন বা ইউজার ডাটাতে 'role' বা 'isPaid' থাকে, তবে এখানে চেক করতে পারেন
    // আপাতত ডামি লজিক হিসেবে রাখা হলো
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "PRO") {
      setIsPro(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ইউজার ডাটাও রিমুভ করুন
    window.location.href = "/auth/login";
  };

  return (
    <nav className="sticky top-0 z-50 text-white bg-green-600 border-b shadow-lg border-green-500/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
        {/* 🌿 Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform group active:scale-95">
          <span className="text-2xl transition-transform group-hover:rotate-12">🌱</span>
          <span className="text-xl italic font-black tracking-tight uppercase group-hover:text-green-100">
            EcoSpark Hub
          </span>
        </Link>

        {/* 🔗 Nav Links & Auth */}
        <div className="flex items-center gap-6">
          <div className="items-center hidden gap-6 text-[10px] font-black uppercase tracking-[0.2em] md:flex">
            <Link href="/" className="transition-colors hover:text-green-200">
              Home
            </Link>

            {token && (
              <>
                <Link href="/ideas/create" className="transition-colors hover:text-green-200">
                  Create Idea
                </Link>
                <Link href="/dashboard/member" className="transition-colors hover:text-green-200">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* 💎 PRO/Subscription Button (লগইন করা থাকলে এবং প্রো না হলে দেখাবে) */}
          {token && !isPro && (
            <Link 
              href="/subscribe" 
              className="bg-amber-400 text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-amber-500 shadow-lg shadow-amber-900/20 transition-all active:scale-95 animate-pulse hover:animate-none"
            >
              Get Pro 💎
            </Link>
          )}

          {/* 🔐 Auth Section */}
          <div className="flex items-center gap-3 pl-6 border-l border-green-500/50">
            {!token ? (
              <>
                <Link 
                  href="/auth/login" 
                  className="px-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:text-green-200"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-green-700 transition-all bg-white shadow-md rounded-xl hover:bg-green-50 active:scale-90"
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all bg-red-500 shadow-md hover:bg-red-600 rounded-xl active:scale-90"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}