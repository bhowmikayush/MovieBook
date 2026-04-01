 import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function AdminAddShow() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    movieId: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/api/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.movieId) return alert("❌ Select a Movie Asset first");

    try {
      setLoading(true);
      await API.post("/api/shows/add", form);
      alert("✅ Show Scheduled in Timeline");
      setForm({ movieId: "", date: "", time: "" });
    } catch (err) {
      alert("❌ Scheduling Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#080808] border border-white/5 p-10 rounded-[40px] shadow-2xl mt-12 overflow-hidden relative"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Schedule <span className="text-red-600">Timeline</span>
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
            Assign Theater Slots
          </p>
        </div>
        <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10 text-[10px] font-mono text-gray-400 uppercase">
          Available Assets: {movies.length}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* MOVIE SELECTION - GRID (UPDATED) */}
        <section>
          <label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 block">
            Select Movie Asset
          </label>

          {/* ✅ CHANGED HERE → GRID (4 per row) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6">
            {movies.map((m) => (
              <motion.div
                key={m._id}
                whileHover={{ y: -5 }}
                onClick={() => setForm({ ...form, movieId: m._id })}
                className={`group cursor-pointer transition-all duration-500 ${
                  form.movieId === m._id
                    ? "scale-105"
                    : "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                }`}
              >
                <div
                  className={`relative aspect-[2/3] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    form.movieId === m._id
                      ? "border-red-600 shadow-[0_0_25px_rgba(229,9,20,0.3)]"
                      : "border-white/10"
                  }`}
                >
                  <img
                    src={
                      m.poster?.startsWith("http")
                        ? m.poster
                        : `${import.meta.env.VITE_API_URL}/uploads/${m.poster}`
                    }
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />

                  {form.movieId === m._id && (
                    <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                      <div className="bg-red-600 text-white p-2 rounded-full shadow-lg">
                        ✓
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] font-black text-center mt-3 uppercase tracking-tighter truncate text-white">
                  {m.title}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TIME & DATE SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end bg-[#0a0a0a] p-8 rounded-3xl border border-white/5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Show Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="w-full bg-transparent border-b border-white/10 py-2 text-lg font-light text-white focus:border-red-600 outline-none transition-all appearance-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Start Time
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              className="w-full bg-transparent border-b border-white/10 py-2 text-lg font-light text-white focus:border-red-600 outline-none transition-all appearance-none"
              required
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#fff",
              color: "#000",
            }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full h-14 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-colors text-xs"
          >
            {loading ? "Processing..." : "Add to Timeline"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}