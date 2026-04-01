 import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [movies, setMovies] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = String(user?.id || user?._id || user?.uid);

  useEffect(() => {
    if (!userId) {
      setShowPopup(true);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await API.get("/api/movies");
        const favMovies = res.data.filter((movie) =>
          movie.favorites?.map(String).includes(userId)
        );
        setMovies(favMovies);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] p-4 md:p-10 font-mono">
      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,118,0.02))] z-50 bg-[length:100%_2px,3px_100%]"></div>

      {/* Header with Glitch Effect */}
      <header className="relative mb-16 border-b border-red-900/30 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-red-600 text-xs tracking-[0.3em] mb-10 font-bold">USER_DATABASE / FAVORITES</p>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              The <span className="text-red-600">Red</span> List
            </h1>
          </div>
          <div className="hidden md:block text-right text-[10px] text-gray-600">
            <p>ENCRYPTION: AES-256</p>
            <p>STATUS: VERIFIED_ACCESS</p>
          </div>
        </div>
      </header>

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-[100]">
          <div className="border-2 border-red-600 p-8 bg-black max-w-sm w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-red-600 mb-2 uppercase tracking-widest">Access Denied</h2>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm">Authentication required to view restricted cinematic data.</p>
            <button 
              onClick={() => navigate("/login")}
              className="w-full bg-red-600 text-black font-black py-3 hover:bg-white transition-colors uppercase text-sm mb-3"
            >
              Initialize Login
            </button>
            <button onClick={() => navigate("/")} className="w-full text-gray-500 text-xs uppercase hover:text-white transition-colors">Return to Terminal</button>
          </div>
        </div>
      )}

      {/* Favorites List */}
      <div className="space-y-6 max-w-5xl mx-auto">
        {movies.length === 0 ? (
          <div className="border border-dashed border-gray-800 p-20 text-center">
            <p className="text-gray-600 uppercase tracking-widest animate-pulse">No records found in local storage</p>
          </div>
        ) : (
          movies.map((movie, index) => (
            <div
              key={movie._id}
              onClick={() => navigate(`/movie/${movie._id}`)}
              className="group relative flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-black to-[#0a0a0a] border-l-4 border-transparent hover:border-red-600 p-4 transition-all duration-300 cursor-pointer hover:bg-[#0f0f0f]"
            >
              {/* Index Number */}
              <span className="absolute -left-10 hidden lg:block text-gray-800 font-black text-4xl group-hover:text-red-900/30 transition-colors">
                0{index + 1}
              </span>

              {/* Poster Container */}
              <div className="relative w-full md:w-32 h-44 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden border border-gray-900 group-hover:border-red-600/50">
                <img
                   src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h2>
                  <span className="hidden md:block h-px flex-grow bg-gray-900 group-hover:bg-red-900/20"></span>
                  <div className="text-red-600 font-bold text-lg">
                    {movie.ratingCount > 0 ? (movie.totalRating / movie.ratingCount).toFixed(1) : "0.0"}
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs uppercase tracking-widest line-clamp-2 md:max-w-md">
                  Directory: /root/movies/{movie.title.replace(/\s+/g, '_').toLowerCase()}
                </p>
              </div>

              {/* Action Side */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 uppercase">Status</p>
                  <p className="text-xs text-red-600 font-bold uppercase">Archived</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-red-600 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-black transition-all">
                  →
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Decoration */}
      <footer className="mt-20 opacity-20 text-[10px] flex justify-between uppercase tracking-[0.5em]">
        <span>System_V.03</span>
        <span>Grid_Active</span>
        <span>2026_Terminal</span>
      </footer>
    </div>
  );
}