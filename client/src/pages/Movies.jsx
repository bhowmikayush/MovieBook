 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import Footer from "../components/Footer";

// ❤️ Favorite Button
const FavoriteButton = ({ isFav, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.7 }}
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
    className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-black/80"
  >
    <motion.span
      animate={{
        scale: isFav ? [1, 1.3, 1] : 1,
        color: isFav ? "#ff0000" : "#ffffff",
      }}
      transition={{ duration: 0.3 }}
      className="text-xl flex items-center justify-center"
    >
      {isFav ? "❤️" : "🤍"}
    </motion.span>
  </motion.button>
);

// Skeleton Loader
const MovieSkeleton = () => (
  <div className="bg-neutral-900 rounded-2xl h-[520px] animate-pulse border border-neutral-800">
    <div className="h-2/3 bg-neutral-800 rounded-t-2xl" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-neutral-800 rounded w-3/4" />
      <div className="h-4 bg-neutral-800 rounded w-1/2" />
      <div className="h-10 bg-neutral-800 rounded-xl mt-4" />
    </div>
  </div>
);

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = String(user?.id || user?._id || user?.uid);

  // 🔝 Always scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/movies");
        setMovies(res.data);

        const showPromises = res.data.map((movie) =>
          API.get(`/api/shows/movie/${movie._id}`)
        );

        const showResults = await Promise.allSettled(showPromises);

        const showsMap = {};
        showResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            showsMap[res.data[index]._id] = result.value.data;
          }
        });

        setShows(showsMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ❤️ Favorite Toggle Fix
  const handleFavorite = async (e, movieId) => {
    e.stopPropagation();
    try {
      const res = await API.post("/api/movies/favorite", { movieId });

      setMovies((prev) =>
        prev.map((m) =>
          m._id === movieId
            ? { ...m, favorites: res.data.favorites }
            : m
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 lg:px-10 pt-28">
      {/* 🎬 Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
          All <span className="text-red-600">Movies</span>
        </h1>
        <div className="h-1.5 w-32 bg-red-600 mt-4 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
      </motion.div>

      {/* 🎞 Movies Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {loading
            ? [...Array(8)].map((_, i) => <MovieSkeleton key={i} />)
            : movies.map((movie) => {
                const movieShows = shows[movie._id] || [];

                // ✅ Correct Favorite Check
                const isFav = movie.favorites?.some(
                  (id) => String(id) === userId
                );

                const avgRating =
                  movie.ratingCount > 0
                    ? (movie.totalRating / movie.ratingCount).toFixed(1)
                    : "N/A";

                return (
                  <motion.div
                    key={movie._id}
                    variants={cardVariants}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    className="group relative bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-2xl cursor-pointer overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-[400px] flex items-center justify-center bg-black">
                      <FavoriteButton
                        isFav={isFav}
                        onClick={(e) => handleFavorite(e, movie._id)}
                      />

                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
                        alt={movie.title}
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/300x400?text=No+Image")
                        }
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ {avgRating}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <h2 className="text-xl font-black truncate group-hover:text-red-500">
                          {movie.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          {movie.releaseDate?.split("T")[0]}
                        </p>
                      </div>

                      <div className="flex justify-between mt-4">
                        <span className="text-red-500 font-bold">
                          ₹{movie.price}
                        </span>
                        <span className="text-xs">
                          {movie.totalSeats} Seats
                        </span>
                      </div>

                      {/* Shows */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {movieShows.length > 0 ? (
                          movieShows.slice(0, 2).map((s) => (
                            <span
                              key={s._id}
                              className="bg-gray-800 px-2 py-1 text-xs rounded"
                            >
                              {s.time}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No shows
                          </span>
                        )}
                      </div>

                      {/* Button */}
                      <button className="mt-4 bg-white text-black py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition">
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
        </AnimatePresence>

        
      </motion.div>
          <Footer />   
    </div>

              
  );
}