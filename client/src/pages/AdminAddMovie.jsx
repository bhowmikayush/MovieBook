 import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function AdminAddMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    totalSeats: "",
    releaseDate: "",
  });

  const [files, setFiles] = useState({ poster: null, backdrop: null });
  const [previews, setPreviews] = useState({ poster: null, backdrop: null });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      setPreviews((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !files.poster) return alert("Missing Movie Assets");

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      data.append("poster", files.poster);
      data.append("backdrop", files.backdrop);

      await API.post("/api/movies/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("🎬 Movie Premiered Successfully!");
    } catch (err) {
      alert("Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      
      {/* 🔥 FIX: Calendar icon visibility */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1) brightness(2);
            cursor: pointer;
          }
        `}
      </style>

      {/* 1. TOP NAVIGATION BAR */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black italic shadow-[0_0_20px_rgba(229,9,14,0.4)]">
            C
          </div>
          <span className="text-xs font-black tracking-[0.5em] uppercase text-gray-400">
            Project / Studio / Add
          </span>
        </div>
        <div className="text-[10px] font-mono text-red-600 animate-pulse uppercase tracking-widest">
          System: Live Deployment Mode
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100-5rem)]">
        
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-[60%] p-12 overflow-y-auto scrollbar-hide border-r border-white/5"
        >
          <header className="mb-12">
            <h1 className="text-6xl font-black italic tracking-tighter mb-2">
              CREATE <span className="text-red-600">PREMIERE</span>
            </h1>
            <p className="text-gray-500 uppercase text-[10px] tracking-[0.3em]">
              Configure theater assets and distribution
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Title */}
            <div className="group relative">
              <label className="text-[10px] font-black text-red-600 uppercase mb-2 block tracking-widest">
                Movie Title
              </label>
              <input
                type="text"
                placeholder="TYPE MOVIE TITLE..."
                className="w-full bg-transparent border-b-2 border-white/10 py-4 text-4xl font-light focus:border-red-600 outline-none transition-all placeholder:text-white/5"
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-focus-within:w-full transition-all duration-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              
              {/* ✅ UPDATED DATE INPUT */}
              <div className="relative">
                <PremiumInput
                  label="Release Date"
                  type="date"
                  onChange={(v) =>
                    setForm({ ...form, releaseDate: v })
                  }
                />
                <span className="absolute right-3 top-9 text-red-600 text-xl pointer-events-none">
                  📅
                </span>
              </div>

              <PremiumInput
                label="Ticket Price ($)"
                type="number"
                placeholder="0.00"
                onChange={(v) =>
                  setForm({ ...form, price: v })
                }
              />
            </div>

            <PremiumInput
              label="Total Seats Capacity"
              type="number"
              placeholder="e.g. 250"
              onChange={(v) =>
                setForm({ ...form, totalSeats: v })
              }
            />

            <div>
              <label className="text-[10px] font-black text-red-600 uppercase mb-2 block tracking-widest">
                Synopsis
              </label>
              <textarea
                className="w-full bg-[#111] border border-white/5 p-6 rounded-2xl h-40 focus:border-red-600 outline-none text-gray-300 font-light leading-relaxed"
                placeholder="Enter the cinematic narrative..."
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-600 text-white py-6 rounded-full font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(229,9,20,0.2)]"
            >
              {loading ? "PROVISIONING..." : "PUBLISH TO THEATERS"}
            </motion.button>
          </form>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="lg:w-[40%] bg-[#080808] p-12 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900 via-transparent to-transparent"></div>

          <div className="relative z-10 w-full max-w-sm space-y-8">
            <p className="text-[10px] font-black text-center text-gray-500 tracking-[0.4em] uppercase">
              Live Asset Preview
            </p>

            {/* Poster */}
            <div className="aspect-[2/3] w-full bg-[#111] rounded-[30px] border-2 border-dashed border-white/10 relative overflow-hidden group hover:border-red-600 transition-all cursor-pointer">
              <AnimatePresence>
                {previews.poster ? (
                  <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={previews.poster}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <span className="text-4xl text-white/10 group-hover:text-red-600 transition-colors">
                      +
                    </span>
                    <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest group-hover:text-red-600">
                      Upload Poster
                    </span>
                  </div>
                )}
              </AnimatePresence>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, "poster")}
              />
            </div>

            {/* Backdrop */}
            <div className="aspect-video w-full bg-[#111] rounded-[20px] border border-white/5 relative overflow-hidden group hover:border-red-600 transition-all cursor-pointer">
              {previews.backdrop ? (
                <img
                  src={previews.backdrop}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">
                    Backdrop Asset
                  </span>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, "backdrop")}
              />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold uppercase tracking-widest truncate">
                {form.title || "MOVIE TITLE"}
              </h3>
              <p className="text-red-600 font-mono text-xs mt-1">
                AVAILABLE SEATS: {form.totalSeats || "---"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Link to="/admin/manage-movies">
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#dc2626",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
          >
            GO TO MANAGE MOVIES
          </button>
        </Link>
      </div>
    </div>
  );
}

// INPUT COMPONENT
function PremiumInput({ label, type, placeholder, onChange }) {
  return (
    <div className="group relative w-full">
      <label className="text-[10px] font-black text-red-600 uppercase mb-2 block tracking-widest">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-white/10 py-2 text-xl font-light focus:border-red-600 outline-none transition-all placeholder:text-white/5"
      />
    </div>
  );
}