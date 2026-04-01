 import { motion } from "framer-motion";
import { RiPlayFill, RiInformationLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import heroImage from "../assets/6ee50699e89dc16f20bcdc4c540b2249.jpg";

export default function Hero() {
  const navigate = useNavigate(); // 2. Initialize navigate

  return (
    <div className="relative min-h-screen w-full flex items-start overflow-hidden bg-black">
      
      {/* 🎬 PREMIUM BACKGROUND */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
      </div>

      {/* 📝 CONTENT */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-10 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Badge Section */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-sm tracking-[0.2em] shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              New Release
            </span>
            <span className="text-gray-200 text-[10px] font-bold uppercase tracking-widest border-l border-white/20 pl-3">
              Ultra HD 4K
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase">
            Experience <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              The Magic.
            </span>
          </h1>

          <p className="text-gray-300 text-sm md:text-lg max-w-lg mb-10 leading-relaxed font-medium">
            Step into a world of cinematic excellence. From heart-pounding action 
            to soul-stirring drama, book your front-row seat.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {/* 🛠️ UPDATED BOOK NOW BUTTON */}
            <motion.button 
              onClick={() => navigate("/movies")} // 3. Add navigation
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl"
            >
              <RiPlayFill size={24} />
              Book Now
            </motion.button>
            
            <button className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all duration-300">
              <RiInformationLine size={24} />
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}