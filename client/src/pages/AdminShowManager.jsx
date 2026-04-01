 import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function AdminShowManager() {
  const [shows, setShows] = useState([]);
  const [editingShow, setEditingShow] = useState(null);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await API.get("/api/shows");
      setShows(res.data);
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Terminate this timeline session?")) return;
    try {
      await API.delete(`/api/shows/${id}`);
      setShows(shows.filter((s) => s._id !== id));
    } catch (err) {
      alert("Termination Failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingShow) return;
    const seats = editingShow.seats?.length ? editingShow.seats : Array(50).fill(false);
    try {
      await API.put(`/api/shows/${editingShow._id}`, {
        date: editingShow.date,
        time: editingShow.time,
        seats,
      });
      setEditingShow(null);
      fetchShows();
    } catch (err) {
      alert("Update Failed");
    }
  };

  return (
    // pb-32 ensures content clears the bottom navbar
    <div className="min-h-screen bg-black text-white px-40 pt-10 pb-152">
      
      {/* HEADER SECTION */}
    {/* ================= HEADER SECTION ================= */}
<div className="max-w-5xl mx-auto mt-32 mb-16 px-4">
  <div className="flex flex-col gap-2">
    <h1 className="text-5xl font-black italic tracking-tighter uppercase">
      System <span className="text-red-600 underline decoration-red-600/30">Control</span>
    </h1>
    <p className="text-[12px] text-gray-500 font-mono tracking-[0.4em] uppercase">
      Active Deployments: {shows.length}
    </p>
    <p className="text-[10px] text-gray-400 mt-1">
      Manage shows, seats, and schedules in real-time.
    </p>
  </div>
</div>

      {/* SHOW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        <AnimatePresence>
          {shows.map((show) => (
            <motion.div
              key={show._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group bg-[#0A0A0A] border border-white/5 rounded-[32px] p-6 overflow-hidden hover:border-red-600/40 transition-all duration-500"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/5 blur-[80px] group-hover:bg-red-600/10 transition-all"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">Production</span>
                    <h2 className="text-xl font-bold tracking-tighter uppercase leading-tight">
                      {show.movie?.title || "Unknown"}
                    </h2>
                  </div>
                  <div className="bg-white/5 p-2 rounded-2xl border border-white/10 font-mono text-[10px] text-gray-400">
                    {show.time}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Date</span>
                      <span className="text-[11px] text-gray-300 font-medium">
                        {show.date ? new Date(show.date).toLocaleDateString() : 'N/A'}
                      </span>
                   </div>
                   
                   <div>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] text-gray-500 font-bold uppercase">Occupancy</span>
                         <span className="text-[10px] font-mono text-red-500">
                            {Math.round((show.seats.filter(s => s).length / show.seats.length) * 100)}%
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(show.seats.filter(s => s).length / show.seats.length) * 100}%` }}
                          className="h-full bg-gradient-to-r from-red-800 to-red-600"
                        />
                      </div>
                   </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingShow(show)}
                    className="flex-1 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all"
                  >
                    Modify
                  </button>
                  <button 
                    onClick={() => handleDelete(show._id)}
                    className="px-4 py-3 bg-white/5 text-gray-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-950 hover:text-red-500 transition-all"
                  >
                   Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EDIT OVERLAY */}
      <AnimatePresence>
        {editingShow && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingShow(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#0F0F0F] w-full max-w-xl rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/10 p-8 sm:p-10 overflow-hidden"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8 sm:hidden" />
              
              <header className="mb-8">
                <h3 className="text-2xl font-black italic uppercase text-white">Override <span className="text-red-600">Parameters</span></h3>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-mono">ID: {editingShow._id}</p>
              </header>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase">Sync Date</label>
                    <input
                      type="date"
                      value={editingShow.date ? editingShow.date.split("T")[0] : ""}
                      onChange={(e) => setEditingShow({ ...editingShow, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-500 uppercase">Jump Time</label>
                    <input
                      type="time"
                      value={editingShow.time || ""}
                      onChange={(e) => setEditingShow({ ...editingShow, time: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-600 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black text-gray-500 uppercase">Seat Matrix</label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /><span className="text-[8px] text-gray-500 font-bold uppercase">Taken</span></div>
                      <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><span className="text-[8px] text-gray-500 font-bold uppercase">Open</span></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-10 gap-1.5 p-4 bg-black rounded-3xl border border-white/5 max-h-40 overflow-y-auto scrollbar-hide">
                    {editingShow.seats?.map((seat, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          const newSeats = [...editingShow.seats];
                          newSeats[index] = !newSeats[index];
                          setEditingShow({...editingShow, seats: newSeats});
                        }}
                        className={`aspect-square rounded-[4px] cursor-pointer transition-all duration-200 ${
                          seat ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]" : "bg-white/10 hover:bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                    Apply Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingShow(null)}
                    className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all"
                  >
                    Exit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}