 import { useState } from "react";
import { Play } from "lucide-react"; 
import { trailers } from "../assets/assets";

export default function TrailerSection() {

  const [activeVideo, setActiveVideo] = useState(trailers[0]);

  return (
    <section className="bg-black pt-0 pb-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">
              Multimedia Experience
            </span>
            <h2 className="text-white text-4xl md:text-5xl font-black mt-1 tracking-tighter">
              LATEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">TRAILERS</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-xs md:text-sm md:text-right leading-relaxed">
            Dive into the cinematic world of our latest production. Switch between exclusive cuts and behind-the-scenes teasers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN PLAYER */}
          <div className="lg:col-span-8 group relative bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl shadow-red-900/10 border border-white/5">
            <div className="aspect-video w-full">
              <iframe
                key={activeVideo.id}
                width="100%"
                height="100%"
                src={`${activeVideo.videoUrl}?autoplay=1&mute=1`} // ✅ from assets
                title={activeVideo.title}
                frameBorder="0"
                allowFullScreen
                className="transition-opacity duration-500"
              ></iframe>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
              <h3 className="text-white text-xl font-black uppercase tracking-tight">
                {activeVideo.title}
              </h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                {activeVideo.subtitle}
              </p>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto lg:max-h-[450px] pr-2 custom-scrollbar">
            {trailers.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveVideo(item)}
                className={`group flex items-center gap-4 p-2 rounded-xl transition-all duration-300 border ${
                  activeVideo.id === item.id 
                  ? "bg-red-600/10 border-red-600/40" 
                  : "bg-white/[0.03] border-transparent hover:bg-white/10"
                }`}
              >
                <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img 
                    src={item.thumb} // ✅ from assets
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center transition-all ${activeVideo.id === item.id ? "bg-red-600/20" : "bg-black/40 group-hover:bg-black/10"}`}>
                    <Play className={`w-5 h-5 text-white fill-white transition-transform group-hover:scale-110 ${activeVideo.id === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                  </div>
                </div>

                <div className="text-left overflow-hidden">
                  <h4 className={`font-black text-xs uppercase tracking-tight truncate transition-colors ${activeVideo.id === item.id ? "text-red-500" : "text-white group-hover:text-red-400"}`}>
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}