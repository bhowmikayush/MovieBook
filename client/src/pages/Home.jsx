 import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // npm install framer-motion

import Hero from "../components/Hero";
import FeatureSection from "../components/FeaturedMovies";
import TrailerSection from "../components/TrailerSection";
import SearchBar from "../components/SearchBar"; // Using the premium searchbar we built
import Footer from "../components/Footer";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount or refresh
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch movies
    API.get("/api/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Sync the query state if you handle it inside the SearchBar component
  const handleSearchUpdate = (results, text) => {
    setFiltered(results);
    setQuery(text);
  };

  return (
    <motion.div
      className="bg-black min-h-screen text-white overflow-x-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 🔍 SEARCH SECTION - Positioned over the Hero or below Navbar */}
      <div className="pt-24 pb-8 sticky top-0 z-[60] bg-gradient-to-b from-black via-black/80 to-transparent">
        <SearchBar movies={movies} onSearchUpdate={handleSearchUpdate} />
      </div>

      {/* 🎬 SEARCH RESULTS MODAL/OVERLAY */}
      <AnimatePresence>
        {query && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[55] bg-black/95 pt-40 px-6 md:px-12 overflow-y-auto backdrop-blur-xl"
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase tracking-widest">
                  Search Results <span className="text-red-600">.</span>
                </h2>
                <p className="text-gray-500 text-sm">{filtered.length} movies found</p>
              </div>

              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <span className="text-6xl block mb-4">🕵️‍♂️</span>
                  <p className="text-gray-400 text-lg">We couldn't find any movies matching "{query}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
                  {filtered.map((movie) => (
                    <motion.div
                      layout
                      key={movie._id}
                      onClick={() => navigate(`/movie/${movie._id}`)}
                      whileHover={{ y: -10 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 group-hover:border-red-600/50 transition-colors">
                        <img
                          
                          src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 right-3">
                           <p className="text-sm font-bold truncate leading-tight">{movie.title}</p>
                           <p className="text-[10px] text-red-500 font-black uppercase mt-1">View Details</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎬 NORMAL HOME CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      <section className="relative z-10 -mt-20">
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
         >
           <FeatureSection />
         </motion.div>
      </section>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="py-20"
      >
        <TrailerSection />
      </motion.div>

      <Footer />
    </motion.div>
  );
}