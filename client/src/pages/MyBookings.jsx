 import { useEffect, useState } from "react";
import API from "../services/api";
import { Toaster, toast } from "react-hot-toast";
import { 
  RiStarFill, 
  RiTicket2Line, 
  RiCalendarCheckLine, 
  RiUserSearchLine, 
  RiTimeLine,
  RiMapPinLine 
} from "react-icons/ri";



export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/api/bookings")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setLoading(false);
      });
  }, [token]);

  const handleRating = async (movieId, rating) => {
    try {
      await API.post("/api/movies/rate", { movieId, rating });

      setBookings((prev) =>
        prev.map((b) => {
          if (b.show?.movie?._id === movieId) {
            const updatedTotal = (b.show.movie.totalRating || 0) + rating;
            const updatedCount = (b.show.movie.ratingCount || 0) + 1;

            return {
              ...b,
              show: {
                ...b.show,
                movie: {
                  ...b.show.movie,
                  totalRating: updatedTotal,
                  ratingCount: updatedCount,
                },
              },
            };
          }
          return b;
        })
      );
      toast.success("Rating submitted!", {
        style: { borderRadius: "12px", background: "#1a1a1a", color: "#fff", border: "1px solid #e50914" },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Rating failed");
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
        <div className="bg-zinc-900/50 p-12 rounded-3xl border border-zinc-800 text-center backdrop-blur-xl">
          <RiUserSearchLine size={64} className="text-zinc-600 mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-2 tracking-tighter">ACCESS DENIED</h2>
          <p className="text-zinc-400 max-w-xs mx-auto mb-8">Sign in to unlock your personal cinematic history.</p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 selection:bg-red-600">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 mb-12">
         
        <div className="h-1 w-24 bg-red-600 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium tracking-widest animate-pulse uppercase text-xs">Loading Experience...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/30 rounded-[40px] border border-zinc-800/50 backdrop-blur-sm">
            <RiCalendarCheckLine size={80} className="mx-auto text-zinc-800 mb-6" />
            <h3 className="text-2xl font-bold">The screen is empty.</h3>
            <p className="text-zinc-500 mt-2 mb-8">Your future movie nights will appear here.</p>
            <button className="text-red-500 font-bold hover:underline underline-offset-8">Browse Movies →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((b) => {
              const movie = b.show?.movie;
              const avgRating = movie?.ratingCount > 0
                  ? (movie.totalRating / movie.ratingCount).toFixed(1)
                  : "N/A";

              return (
                <div
                  key={b._id}
                  className="group relative flex flex-col md:flex-row bg-[#121212] rounded-[24px] overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(229,9,20,0.15)]"
                >
                  {/* Poster Area */}
                  <div className="relative w-full md:w-56 shrink-0 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${movie?.poster}`}
                      alt={movie?.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r"></div>
                    
                    {/* Floating Rating Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded-full shadow-xl">
                      <RiStarFill className="text-white" size={14} />
                      <span className="text-xs font-black text-white">{avgRating}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight line-clamp-2 group-hover:text-red-500 transition-colors">
                          {movie?.title || "Feature Film"}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-4 mb-6">
                        <div className="flex items-center gap-3 text-zinc-400">
                          <RiCalendarCheckLine className="text-red-600" />
                          <span className="text-sm font-semibold">{b.show?.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400">
                          <RiTimeLine className="text-red-600" />
                          <span className="text-sm font-semibold">{b.show?.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400 col-span-2">
                          <RiMapPinLine className="text-red-600" />
                          <span className="text-sm font-semibold">
                            Seats No: <span className="text-white bg-zinc-800 px-2 py-0.5 rounded ml-1">{b.seats?.map((s) => s + 1).join(", ")}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div className="space-y-3">
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em]">Rate Experience</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRating(movie?._id, r)}
                            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center font-bold text-sm transition-all hover:bg-red-600 hover:border-red-600 hover:scale-110 active:scale-90"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-zinc-600 font-mono tracking-tighter mb-1">BOOKING_ID</p>
                        <span className="text-sm text-zinc-400 font-mono uppercase tracking-widest">#{b.paymentId?.slice(-8)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">Total Paid</p>
                        <p className="text-3xl font-black text-white">
                          <span className="text-red-600 text-lg mr-1">₹</span>
                          {(b.seats?.length || 0) * (movie?.price || 100)}
                        </p>
                        
                      </div>
                    </div>
                  </div>
                </div>
                

                
              );
            })}
          </div>
        )}
      </div>
    </div>

    
  );
}

 