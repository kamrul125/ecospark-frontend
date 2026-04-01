import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [allIdeas, setAllIdeas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ideaRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/ideas")
        ]);
        setUsers(userRes.data);
        setAllIdeas(ideaRes.data);
      } catch (err) {
        console.log("Admin Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />

      <main className="w-full px-6 py-12 mx-auto grow max-w-7xl">
        {/* 🛠️ Admin Header with Updated Shorthand */}
        <div className="relative p-10 mb-12 overflow-hidden text-white shadow-2xl bg-linear-to-r from-gray-900 to-gray-800 rounded-4xl">
          <div className="relative z-10">
            <h1 className="mb-2 text-4xl font-black tracking-tighter">
              Admin <span className="text-green-400">Control Panel</span>
            </h1>
            <p className="italic font-medium text-gray-400">পুরো প্ল্যাটফর্মের ইউজার এবং কন্টেন্ট এখান থেকে ম্যানেজ করুন।</p>
          </div>
          {/* ✅ Updated: right-[-20px] -> -right-5, top-[-20px] -> -top-5 */}
          <div className="absolute -right-5 -top-5 text-[150px] opacity-10 pointer-events-none select-none">
            ⚙️
          </div>
        </div>

        {/* 📑 Navigation Tabs */}
        <div className="flex gap-4 p-2 mb-8 bg-white border border-gray-100 shadow-sm rounded-3xl w-fit">
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === "users" ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Manage Users
          </button>
          <button 
            onClick={() => setActiveTab("ideas")}
            className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === "ideas" ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            Manage Ideas
          </button>
        </div>

        {/* 📊 Data Table Container */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-4xl">
          {loading ? (
            <div className="p-24 text-center">
               <div className="w-10 h-10 mx-auto mb-4 border-t-2 border-green-600 rounded-full animate-spin"></div>
               <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Fetching Secure Data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                  {activeTab === "users" ? (
                    <tr>
                      <th className="px-10 py-6">User Identity</th>
                      <th className="px-10 py-6">Credentials</th>
                      <th className="px-10 py-6 text-center">Role</th>
                      <th className="px-10 py-6 text-right">Administrative Actions</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-10 py-6">Idea Title</th>
                      <th className="px-10 py-6">Contributor</th>
                      <th className="px-10 py-6 text-center">Impact/Votes</th>
                      <th className="px-10 py-6 text-right">Moderation</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeTab === "users" ? (
                    users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-gray-50/50 group">
                        <td className="px-10 py-6 font-bold text-gray-900">{user.name}</td>
                        <td className="px-10 py-6 text-sm font-medium text-gray-400">{user.email}</td>
                        <td className="px-10 py-6 text-center">
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Restrict Access</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    allIdeas.map((idea) => (
                      <tr key={idea.id} className="transition-colors hover:bg-gray-50/50 group">
                        <td className="max-w-xs px-10 py-6 font-bold text-gray-900 truncate">{idea.title}</td>
                        <td className="px-10 py-6 text-sm font-medium text-gray-400">{idea?.author?.name || "Member"}</td>
                        <td className="px-10 py-6 text-lg font-black text-center text-green-600">{idea.voteCount || 0}</td>
                        <td className="px-10 py-6 space-x-6 text-right">
                          <button className="text-[10px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest transition-colors">Feature</button>
                          <button className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">Archive</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}