 import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiHeartFill, RiHeartLine, RiStarFill, RiPlayFill } from "react-icons/ri";

export default function FeatureSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;  

  // ✅ FETCH MOVIES
  useEffect(() => {
    API.get("/api/movies")
      .then((res) => {
        setMovies(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // ✅ ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ✅ HANDLE FAVORITE
  const handleFavorite = async (e, movieId) => {
    e.stopPropagation();
    if (!user) return navigate("/login");

    const movie = movies.find((m) => m._id === movieId);
    const isCurrentlyFav = movie?.favorites?.includes(userId);

    // ✅ Optimistic UI update
    setMovies((prev) =>
      prev.map((m) =>
        m._id === movieId
          ? {
              ...m,
              favorites: isCurrentlyFav
                ? m.favorites.filter((id) => id !== userId)
                : [...(m.favorites || []), userId],
            }
          : m
      )
    );

    try {
      await API.post("/api/movies/favorite", { movieId });
    } catch (err) {
      
      setMovies((prev) =>
        prev.map((m) => (m._id === movieId ? movie : m))
      );
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-10 bg-black">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-1"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-2">
            Premium Selection
          </span>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
            Featured <span className="text-gray-600">Cinema</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md font-medium">
            Handpicked blockbusters and indie gems curated by our top critics.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/movies")}
          className="text-white text-[11px] font-black uppercase tracking-widest border-b-2 border-red-600 pb-1 w-fit hover:text-red-500 transition-colors"
        >
          View All Library
        </motion.button>
      </div>

      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[320px] bg-gray-800 animate-pulse rounded-2xl"
            ></div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {movies.map((movie) => {
            const isFav = movie.favorites?.includes(userId);

            const avgRating =
              movie.ratingCount > 0
                ? (movie.totalRating / movie.ratingCount).toFixed(1)
                : "0.0";

            return (
              <motion.div
                key={movie._id}
                variants={cardVariants}
                whileHover={{ y: -12 }}
                className="relative group"
              >
                {/* IMAGE */}
                <div
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer shadow-lg"
                >
                  <motion.img
                     

                    src={`${API_URL}/uploads/${movie.poster}`}
                    alt={movie.title}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* PLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-red-600 p-4 rounded-full">
                      <RiPlayFill className="text-white ml-1" size={30} />
                    </div>
                  </div>

                  
                  <button
                    onClick={(e) => handleFavorite(e, movie._id)}
                    className={`absolute top-4 right-4 p-3 rounded-xl z-30 transition ${
                      isFav
                        ? "bg-red-600 text-white"
                        : "bg-black/50 text-white"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isFav ? "liked" : "unliked"}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        {isFav ? (
                          <RiHeartFill size={18} />
                        ) : (
                          <RiHeartLine size={18} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>

                   
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 px-3 py-1 rounded-lg">
                    <RiStarFill className="text-yellow-500" size={14} />
                    <span className="text-xs font-bold text-white">
                      {avgRating}
                    </span>
                  </div>
                </div>

             
                <div
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="mt-5 px-1 cursor-pointer"
                >
                  <h3 className="text-xl font-black text-white uppercase truncate group-hover:text-red-500">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase border px-2 py-0.5 rounded">
                      {movie.genre}
                    </span>
                    <span className="text-[10px] font-black text-red-600 uppercase">
                      4K Ultra HD
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

 