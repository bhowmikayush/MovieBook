 import { motion } from "framer-motion";
import { 
  RiFacebookCircleFill, 
  RiTwitterXLine, 
  RiInstagramFill, 
  RiYoutubeFill,
  RiMapPin2Line,
  RiTicket2Line,
  RiCupLine
} from "react-icons/ri";

export default function CinemaFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Experience", links: ["IMAX® Laser", "Dolby Cinema", "4DX Theater", "VIP Lounges"] },
    { title: "Booking", links: ["Ticket Pricing", "Group Bookings", "Gift Cards", "Refund Policy"] },
    { title: "Our Halls", links: ["Downtown Hub", "North Plaza", "West Side Mall", "East Gate"] },
  ];

  return (
    <footer className="bg-[#050505] text-white pt-16 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* UPPER FOOTER: BRAND & BOOKING STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16">
          
          {/* BRAND IDENTITY */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-4xl font-black tracking-tighter uppercase group cursor-default">
              MOVIE<span className="text-red-600 group-hover:text-white transition-colors">BOOK</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium italic">
              "The ultimate destination for the cinematic soul. Experience the 
              magic of the big screen with state-of-the-art projection and sound."
            </p>
            <div className="flex gap-4">
              {[RiFacebookCircleFill, RiTwitterXLine, RiInstagramFill, RiYoutubeFill].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5, scale: 1.1 }}
                  href="#" 
                  className="text-gray-500 hover:text-red-600 transition-all"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* CINEMA LINKS */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-4">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-gray-400 hover:text-white transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CINEMA LIVE DASHBOARD */}
          <div className="lg:col-span-3 bg-red-600/5 border border-red-600/20 rounded-3xl p-6 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute -right-4 -top-4 text-red-600/10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <RiTicket2Line size={120} />
            </div>

            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              Live Venue Status
            </h4>
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-3">
                <RiMapPin2Line size={18} className="text-red-600" />
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Current Location</p>
                    <p className="text-xs font-black text-white">Downtown Main Hall</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiTicket2Line size={18} className="text-red-600" />
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Availability</p>
                    <p className="text-xs font-black text-white">Limited Seats (Show 9PM)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiCupLine size={18} className="text-red-600" />
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Concessions</p>
                    <p className="text-xs font-black text-white">Open - Fresh Popcorn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM UTILITY BAR */}
        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
              © {currentYear} MOVIEBOOK CINEMAS. THEATER #001
            </p>
            <div className="flex gap-6">
                <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest hover:text-gray-400 cursor-pointer transition-colors">Safety Protocols</span>
                <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest hover:text-gray-400 cursor-pointer transition-colors">Hall Rental</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all"
            >
              Back to Surface
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all">
                ↑
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Finishing Touch: Red Neon Light at the very bottom */}
      <div className="h-1 w-full bg-red-600 shadow-[0_-5px_20px_rgba(220,38,38,0.5)]" />
    </footer>
  );
}