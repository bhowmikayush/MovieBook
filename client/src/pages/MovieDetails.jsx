//  import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import API from "../services/api";
// import { motion, AnimatePresence } from "framer-motion";
// import Footer from "../components/Footer";

// export default function MovieDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [movie, setMovie] = useState({});
//   const [shows, setShows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = String(user?.id || user?._id || user?.uid);

//   // 🔝 Always scroll to top
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   // Fetch movie + shows
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [movieRes, showsRes] = await Promise.all([
//           axios.get(`https://moviebook-564h.onrender.com//api/movies/${id}`),
//           axios.get(`http://localhost:5000/api/shows/movie/${id}`)
//         ]);
//         setMovie(movieRes.data);
//         setShows(showsRes.data);
//       } catch (err) {
//         console.error("API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const avgRating =
//     movie.ratingCount > 0
//       ? (movie.totalRating / movie.ratingCount).toFixed(1)
//       : "0.0";

//   // ❤️ Favorite check
//   const isFav = movie.favorites?.some(
//     (favId) => String(favId) === userId
//   );

//   // ❤️ Toggle favorite
//   const handleFavorite = async () => {
//     try {
//       const res = await API.post("/api/movies/favorite", {
//         movieId: movie._id,
//       });

//       setMovie((prev) => ({
//         ...prev,
//         favorites: res.data.favorites,
//       }));
//     } catch (err) {
//       console.log("Favorite update failed:", err);
//     }
//   };

//   // ⚡ Smooth loading UI
//   if (loading)
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-[#050505] gap-6">
//         <div className="w-12 h-12 border-4 border-red-600/40 border-t-red-600 rounded-full animate-spin"></div>
//         <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">
//           Loading Experience...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#050505] text-white">

//       {/* 🎬 HERO */}
//       <section className="relative h-screen w-full overflow-hidden">

//         {/* Background Image (Fixed Blur) */}
//         <motion.img
//           initial={{ scale: 1.05 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 2 }}
         
//           src={`${import.meta.env.VITE_API_URL}/uploads/${movie.backdrop}`}
//           alt="backdrop"
//           onError={(e) =>
//             (e.target.src =
//               "https://via.placeholder.com/1200x800?text=No+Image")
//           }
//           className="absolute inset-0 w-full h-full object-cover 
//           opacity-50 blur-[4px] brightness-[0.7]"
//         />

//         {/* Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
//         <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />

//         {/* Content */}
//         <div className="absolute inset-0 flex items-end px-6 pb-20 pt-[25vh] lg:px-24 z-10">
//           <div className="flex flex-col md:flex-row gap-12 items-end w-full">

//             {/* Poster */}
//             <motion.div
//               initial={{ y: 80, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="hidden lg:block"
//             >
//               <img
//                 src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
//                 alt="poster"
//                 onError={(e) =>
//                   (e.target.src =
//                     "https://via.placeholder.com/300x450?text=No+Image")
//                 }
//                 className="w-72 rounded-[2rem] shadow-2xl border border-white/10"
//               />
//             </motion.div>

//             {/* Info */}
//             <motion.div
//               initial={{ x: -40, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               className="flex-1 space-y-6 text-center md:text-left"
//             >
//               {/* Rating */}
//               <div className="flex items-center justify-center md:justify-start gap-4">
//                 <div className="bg-yellow-500 text-black px-4 py-1 rounded-xl font-bold flex items-center gap-2 shadow">
//                   ★ {avgRating}
//                 </div>
//                 <span className="text-gray-400 text-xs uppercase tracking-widest">
//                   {movie.ratingCount || 0} Ratings
//                 </span>
//               </div>

//               {/* Title */}
//               <h1 className="text-5xl md:text-7xl font-black uppercase italic">
//                 {movie.title}
//               </h1>

//               {/* Meta */}
//               <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300 text-xs uppercase font-bold tracking-widest">
//                 <span>📅 {movie.releaseDate?.split("T")[0]}</span>
//                 <span className="text-green-400 text-lg">₹{movie.price}</span>
//               </div>

//               {/* Description */}
//               <p className="max-w-2xl text-gray-400 text-sm leading-relaxed">
//                 {movie.description}
//               </p>

//               {/* Actions */}
//               <div className="flex gap-5 justify-center md:justify-start pt-4">
//                 <button
//                   onClick={() =>
//                     document
//                       .getElementById("showtimes")
//                       .scrollIntoView({ behavior: "smooth" })
//                   }
//                   className="bg-red-600 px-10 py-4 rounded-xl font-bold hover:bg-red-700 transition"
//                 >
//                   Book Tickets
//                 </button>

//                 {/* ❤️ Favorite */}
//                 <button
//                   onClick={handleFavorite}
//                   className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
//                 >
//                   <span className="text-2xl">
//                     {isFav ? "❤️" : "🤍"}
//                   </span>
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* 🎟 SHOWS */}
//       <section id="showtimes" className="px-6 lg:px-24 py-16"> {/* Reduced padding */}

//         <div className="mb-12">
//           <h2 className="text-4xl font-black uppercase tracking-tight">
//             Available Shows
//           </h2>
//           <div className="w-24 h-1 bg-red-600 mt-3 rounded"></div>
//         </div>

//         {shows.length === 0 ? (
//           <p className="text-gray-500">No shows available</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <AnimatePresence>
//               {shows.map((show, index) => (
//                 <motion.button
//                   key={show._id}
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.08 }}
//                   whileHover={{ y: -10, scale: 1.03 }}
//                   onClick={() => navigate(`/seats/${show._id}`)}
//                   className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] 
//                   border border-white/10 p-8 rounded-3xl text-left 
//                   hover:border-red-500/50 transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Glow */}
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-red-600/10 blur-2xl"></div>

//                   {/* Icon */}
//                   <div className="w-12 h-12 bg-red-600/20 text-red-500 flex items-center justify-center rounded-xl mb-6 text-xl shadow">
//                     🎟️
//                   </div>

//                   {/* Date */}
//                   <h3 className="text-2xl font-black group-hover:text-red-500 transition">
//                     {show.date}
//                   </h3>

//                   {/* Time */}
//                   <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
//                     🕒 {show.time}
//                   </p>

//                   {/* Bottom */}
//                   <div className="mt-8 flex justify-between items-center text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition">
//                     <span>Select Seats</span>
//                     <span className="text-lg group-hover:translate-x-2 transition">→</span>
//                   </div>
//                 </motion.button>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = String(user?.id || user?._id || user?.uid);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Scroll to top when movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch movie and shows ONCE
 useEffect(() => {
  const fetchData = async () => {
    try {
      const [movieRes, showsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/movies/${id}`),
        axios.get(`${BASE_URL}/api/shows/movie/${id}`)
      ]);

      setMovie(movieRes.data);
      setShows(showsRes.data || []);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id, BASE_URL]);

  // Show loader
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] gap-6">
        <div className="w-12 h-12 border-4 border-red-600/40 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">
          Loading Experience...
        </p>
      </div>
    );

  if (!movie) return <p className="text-white p-6">Movie not found</p>;

  // Calculate average rating
  const avgRating =
    movie.ratingCount > 0
      ? (movie.totalRating / movie.ratingCount).toFixed(1)
      : "0.0";

  const isFav = movie.favorites?.some((favId) => String(favId) === userId);

  // Construct image URLs safely
  const posterURL = movie.poster
    ? `${BASE_URL}/uploads/${movie.poster}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const backdropURL = movie.backdrop
    ? `${BASE_URL}/uploads/${movie.backdrop}`
    : "https://via.placeholder.com/1200x800?text=No+Image";

  const handleFavorite = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/movies/favorite`, {
        movieId: movie._id,
      });
      setMovie((prev) => ({ ...prev, favorites: res.data.favorites }));
    } catch (err) {
      console.error("Favorite update failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src={backdropURL}
          alt="backdrop"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/1200x800?text=No+Image")
          }
          className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[4px] brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end px-6 pb-20 pt-[25vh] lg:px-24 z-10">
          <div className="flex flex-col md:flex-row gap-12 items-end w-full">
            {/* POSTER */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="hidden lg:block"
            >
              <img
                src={posterURL}
                alt="poster"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/300x450?text=No+Image")
                }
                className="w-72 rounded-[2rem] shadow-2xl border border-white/10"
              />
            </motion.div>

            {/* INFO */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-1 space-y-6 text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="bg-yellow-500 text-black px-4 py-1 rounded-xl font-bold flex items-center gap-2 shadow">
                  ★ {avgRating}
                </div>
                <span className="text-gray-400 text-xs uppercase tracking-widest">
                  {movie.ratingCount || 0} Ratings
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase italic">
                {movie.title}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300 text-xs uppercase font-bold tracking-widest">
                <span>📅 {movie.releaseDate?.split("T")[0]}</span>
                <span className="text-green-400 text-lg">₹{movie.price}</span>
              </div>

              <p className="max-w-2xl text-gray-400 text-sm leading-relaxed">
                {movie.description}
              </p>

              <div className="flex gap-5 justify-center md:justify-start pt-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("showtimes")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-red-600 px-10 py-4 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Book Tickets
                </button>

                <button
                  onClick={handleFavorite}
                  className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  <span className="text-2xl">{isFav ? "❤️" : "🤍"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHOWS SECTION */}
      <section id="showtimes" className="px-6 lg:px-24 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Available Shows
          </h2>
          <div className="w-24 h-1 bg-red-600 mt-3 rounded"></div>
        </div>

        {shows.length === 0 ? (
          <p className="text-gray-500">No shows available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {shows.map((show, index) => (
                <motion.button
                  key={show._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  onClick={() => navigate(`/seats/${show._id}`)}
                  className="group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] 
                  border border-white/10 p-8 rounded-3xl text-left 
                  hover:border-red-500/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-red-600/10 blur-2xl"></div>
                  <div className="w-12 h-12 bg-red-600/20 text-red-500 flex items-center justify-center rounded-xl mb-6 text-xl shadow">
                    🎟️
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-red-500 transition">
                    {show.date}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                    🕒 {show.time}
                  </p>
                  <div className="mt-8 flex justify-between items-center text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition">
                    <span>Select Seats</span>
                    <span className="text-lg group-hover:translate-x-2 transition">→</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}  