 import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 
import API from "../services/api";
import AdminAddMovie from "./AdminAddMovie";
import AdminAddShow from "./AdminAddShow";

export default function AdminDashboard() {
  const navigate = useNavigate(); // 
  const [stats, setStats] = useState({ users: 0, movies: 0, shows: 0 });
  const [activeTab, setActiveTab] = useState("overview"); // overview, movies, shows

  useEffect(() => {
    API.get("/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-red-600 pt-28 pb-20 px-6 lg:px-12">
      {/* 1. DASHBOARD HEADER */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black italic tracking-tighter"
          >
            COMMAND <span className="text-red-600">CENTER</span>
          </motion.h1>
          <p className="text-gray-500 uppercase text-[10px] tracking-[0.4em] mt-2 font-bold">
            Real-time Theater Analytics & Management
          </p>
        </div>

        {/* TAB SWITCHER + MANAGE USERS BUTTON */}
        <div className="flex items-center">
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
            <TabButton 
              active={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")} 
              label="Overview" 
            />
            <TabButton 
              active={activeTab === "movies"} 
              onClick={() => setActiveTab("movies")} 
              label="Manage Movies" 
            />
            <TabButton 
              active={activeTab === "shows"} 
              onClick={() => setActiveTab("shows")} 
              label="Live Shows" 
            />
          </div>

          {/*  Manage Users Button */}
          <button
            onClick={() => navigate("/admin/manage-users")}
            className="ml-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold uppercase tracking-wide transition-all duration-300"
          >
            Manage Users
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* 2. STATS GRID (Only visible in Overview) */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <StatCard label="Network Users" value={stats.users} icon="👤" color="from-blue-600/20" />
              <StatCard label="Library Assets" value={stats.movies} icon="🎬" color="from-red-600/20" />
              <StatCard label="Active Timelines" value={stats.shows} icon="🎟️" color="from-purple-600/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. DYNAMIC CONTENT AREA */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "movies" && (
              <motion.section
                key="movie-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <AdminAddMovie />
              </motion.section>
            )}

            {activeTab === "shows" && (
              <motion.section
                key="show-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <AdminAddShow />

                {/*  Button to go to AdminShowManager */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate("/admin/show-manager")}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold uppercase tracking-wide transition-all duration-300"
                  >
                    Go to Show Manager
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
          
          {/* Default view when in Overview */}
          {activeTab === "overview" && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">
                Select a module above to begin deployment
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// UI COMPONENT: TAB BUTTON
function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
        active 
          ? "bg-red-600 text-white shadow-[0_10px_20px_rgba(229,9,20,0.3)]" 
          : "text-gray-500 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

// UI COMPONENT: STAT CARD
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`relative overflow-hidden bg-glass p-10 rounded-[35px] border border-white/5 group hover:border-red-600/50 transition-all duration-700`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full -mr-16 -mt-16 blur-2xl`}></div>
      
      <div className="relative z-10">
        <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-5xl font-light tracking-tighter">
          {value.toLocaleString()}
        </h3>
      </div>
      
      {/* Decorative pulse dot */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
        <span className="text-[8px] font-mono text-gray-700 tracking-tighter">LIVE_FEED</span>
      </div>
    </div>
  );
}