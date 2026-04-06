import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // টোকেন চেক
        const storedToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
        setToken(storedToken);

        // ইউজার ডাটা চেক
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user?.role || "USER");

          // প্রো স্ট্যাটাস চেক
          if (user && (user.role === "PRO" || user.role === "ADMIN" || user.isPaid)) {
            setIsPro(true);
          }
        }
      } catch (error) {
        console.error("User data parsing failed:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  return (
    <nav className="sticky top-0 z-50 text-white bg-green-600 border-b shadow-lg border-green-500/50 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform group active:scale-95">
          <span className="text-2xl">🌱</span>
          <span className="text-xl italic font-black uppercase tracking-tight">EcoSpark Hub</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="items-center hidden gap-6 text-[10px] font-black uppercase tracking-[0.2em] md:flex">
            <Link href="/" className="transition-colors hover:text-green-200">Home</Link>

            {token && (
              <>
                {/* Create Idea Button */}
                <Link 
                  href="/ideas/create" 
                  className="px-4 py-2 transition-all border-2 border-white rounded-xl hover:bg-white hover:text-green-600"
                >
                  Create Idea
                </Link>

                {/* ✅ Admin Dashboard Button - শুধুমাত্র অ্যাডমিনদের জন্য */}
                {userRole === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 transition-all bg-white text-green-700 rounded-xl hover:bg-green-50 shadow-md font-black"
                  >
                    Admin Panel 🛠️
                  </Link>
                )}

                {/* ডাইনামিক ড্যাশবোর্ড লিঙ্ক (মেম্বারদের জন্য) */}
                {userRole !== "ADMIN" && (
                   <Link 
                   href="/dashboard/member" 
                   className="transition-colors hover:text-green-200"
                 >
                   Dashboard
                 </Link>
                )}
              </>
            )}
          </div>

          {/* Pro Badge */}
          {token && !isPro && (
            <Link href="/subscribe" className="bg-amber-400 text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-amber-500 transition-all shadow-md">
              Get Pro 💎
            </Link>
          )}

          {/* Auth Button */}
          <div className="flex items-center gap-3 pl-6 border-l border-green-500/50">
            {!token ? (
              <Link 
                href="/auth/login" 
                className="px-6 py-2.5 text-[10px] font-black uppercase text-green-700 bg-white rounded-xl hover:bg-green-50 transition-all"
              >
                Login
              </Link>
            ) : (
              <button 
                onClick={handleLogout} 
                className="px-5 py-2.5 text-[10px] font-black uppercase text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all shadow-sm"
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