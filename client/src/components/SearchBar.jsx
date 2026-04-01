 import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiSearchLine, RiCloseLine } from "react-icons/ri"; // npm install react-icons

export default function SearchBar({ movies }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showBox, setShowBox] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setShowBox(false);
      return;
    }

    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
    setShowBox(true);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto px-4 group">
      
      {/*  INPUT CONTAINER */}
      <div className="relative flex items-center">
        <RiSearchLine className="absolute left-4 text-gray-500 group-focus-within:text-red-600 transition-colors text-xl" />
        
        <input
          type="text"
          placeholder="Search movies, genres, actors..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setShowBox(true)}
          className="w-full bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-12 py-4 
                     text-white text-sm tracking-wide shadow-2xl focus:outline-none focus:border-red-600/50 
                     focus:ring-4 focus:ring-red-600/10 transition-all duration-300
                     placeholder:text-gray-600 caret-red-600"
        />

        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); setShowBox(false); }}
            className="absolute right-4 text-gray-500 hover:text-white transition-colors"
          >
            <RiCloseLine size={22} />
          </button>
        )}
      </div>

      {/* 🔥 DROPDOWN / RESULTS */}
      {showBox && (
        <div className="absolute w-[calc(100%-2rem)] mt-3 bg-[#0a0a0a] border border-white/10 
                        shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-2xl overflow-hidden z-[100]
                        animate-in fade-in slide-in-from-top-2 duration-200">
          
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5 bg-white/[0.02]">
                Suggestions
              </div>
              
              {results.map((movie) => (
                <div
                  key={movie._id}
                  onClick={() => {
                    navigate(`/movie/${movie._id}`);
                    setShowBox(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-white/5 cursor-pointer transition-all group/item"
                >
                  <div className="relative shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-lg border border-white/10 group-hover/item:border-red-600/50 transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors">
                      {movie.title}
                    </span>
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                      {movie.genre || "Action • Drama"}
                    </span>
                  </div>

                  <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <RiSearchLine className="text-red-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /*  NO RESULT */
            <div className="p-10 text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mb-2">
                <RiSearchLine className="text-red-600 text-xl" />
              </div>
              <p className="text-gray-300 text-sm font-semibold">No movies found</p>
              <p className="text-gray-600 text-xs uppercase tracking-tighter">Try checking your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}