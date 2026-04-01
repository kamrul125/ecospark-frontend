import { useState, useEffect } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ইউজারের কারেন্ট ডাটা ফেচ করা
    API.get("/auth/me")
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch("/auth/update-profile", { name, email });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch("/auth/update-password", { oldPassword, newPassword });
      alert("🔐 Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Failed to update password. Check your old password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="w-full max-w-4xl px-6 py-16 mx-auto grow">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            Account <span className="text-green-600">Settings</span>
          </h1>
          <p className="mt-2 italic font-medium text-gray-500">আপনার ব্যক্তিগত তথ্য এবং নিরাপত্তা ম্যানেজ করুন।</p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          
          {/* 👤 Profile Information Section */}
          <section className="p-10 bg-white border border-gray-100 shadow-xl rounded-4xl shadow-green-100/30 h-fit">
            <h2 className="flex items-center gap-2 mb-8 text-xl font-black text-gray-900">
              <span className="text-2xl">👤</span> Personal Info
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full p-4 font-bold transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full p-4 font-bold transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                {loading ? "Updating..." : "Save Profile"}
              </button>
            </form>
          </section>

          {/* 🔐 Password Security Section */}
          <section className="p-10 bg-white border border-gray-100 shadow-xl rounded-4xl shadow-gray-200/30 h-fit">
            <h2 className="flex items-center gap-2 mb-8 text-xl font-black text-gray-900">
              <span className="text-2xl">🔐</span> Security
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 font-bold transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 font-bold transition-all border border-gray-100 outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95"
              >
                {loading ? "Processing..." : "Update Password"}
              </button>
            </form>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}