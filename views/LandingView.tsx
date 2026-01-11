import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Lock, Zap, ChevronRight, Activity } from 'lucide-react';

interface LandingViewProps {
  onEnter: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnter }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Motion values for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth springs for softer movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transformations based on mouse position
  const moveBackgroundX = useTransform(springX, [-1, 1], ['-2%', '2%']);
  const moveBackgroundY = useTransform(springY, [-1, 1], ['-2%', '2%']);
  const rotateCoreX = useTransform(springY, [-1, 1], [10, -10]);
  const rotateCoreY = useTransform(springX, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize -1 to 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x: clientX, y: clientY });
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#050a14] overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-emerald-500/30 cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* --- Ambient Background Layers --- */}
      
      {/* 1. Grid Floor with Perspective */}
      <div className="absolute inset-0 perspective-[1000px] overflow-hidden pointer-events-none">
        <motion.div 
           style={{ x: moveBackgroundX, y: moveBackgroundY, rotateX: 60 }}
           className="absolute -bottom-[50%] -left-[50%] w-[200%] h-[200%] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"
        />
      </div>

      {/* 2. Glow Orbs */}
      <motion.div 
        style={{ x: useTransform(springX, [-1, 1], [-50, 50]), y: useTransform(springY, [-1, 1], [-50, 50]) }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
      />
      <motion.div 
        style={{ x: useTransform(springX, [-1, 1], [50, -50]), y: useTransform(springY, [-1, 1], [50, -50]) }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
      />

      {/* 3. Noise Texture for Film Grain Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>


      {/* --- HUD / Technical Overlay Elements --- */}
      <div className="absolute top-8 left-8 hidden md:block opacity-40">
        <div className="flex gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-emerald-500 font-mono tracking-widest">SYSTEM_ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          LAT: {34.0522 + mouseY.get() * 0.1}<br/>
          LNG: {-118.2437 + mouseX.get() * 0.1}
        </div>
      </div>

      <div className="absolute top-8 right-8 hidden md:block opacity-40 text-right">
        <div className="text-xs text-slate-500 font-mono tracking-widest mb-1">SECURE_CONNECTION</div>
        <div className="flex justify-end gap-1">
          {[1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-emerald-500/50"></div>)}
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute inset-0 p-6 pointer-events-none z-20 hidden md:block">
        <div className="w-full h-full border border-slate-800/50 relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30"></div>
        </div>
      </div>


      {/* --- Main Content --- */}
      <div className="z-10 relative flex flex-col items-center text-center max-w-5xl px-6">
        
        {/* Central Core Graphic */}
        <motion.div 
          className="mb-12 relative w-64 h-64 flex items-center justify-center perspective-[800px]"
          style={{ rotateX: rotateCoreX, rotateY: rotateCoreY }}
        >
           {/* Rings */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border border-slate-700/30 border-dashed"
           />
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute inset-4 rounded-full border border-slate-700/20"
           />
           <motion.div 
             animate={{ rotate: 180 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute inset-12 rounded-full border-2 border-emerald-500/10 border-t-emerald-500/50"
           />
           
           {/* Core */}
           <div className="absolute w-24 h-24 bg-gradient-to-br from-emerald-900/80 to-slate-900 rounded-full backdrop-blur-md border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] flex items-center justify-center">
              <Activity className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
           </div>

           {/* Satellites */}
           <motion.div 
             className="absolute w-full h-full"
             animate={{ rotate: 360 }}
             transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-slate-200 rounded-full shadow-[0_0_10px_white]"></div>
           </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400/80 text-xs font-medium tracking-wide uppercase mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Covenant Intelligence Protocol v2.4
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-600">
              Structure
            </span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              The Unknown.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Turn static credit agreements into living, breathing data structures. 
            Real-time compliance monitoring for the modern institution.
          </p>

          <motion.div 
            className="pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={onEnter}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-950 font-bold rounded-none clip-path-slant transition-all hover:bg-emerald-400"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                INITIALIZE DASHBOARD
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Footer / Ticker --- */}
      <div className="absolute bottom-0 w-full border-t border-slate-900 bg-[#050a14]/80 backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex whitespace-nowrap opacity-50">
           <motion.div 
             animate={{ x: [0, -1000] }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="flex gap-12 text-xs font-mono text-slate-500"
           >
             {[...Array(10)].map((_, i) => (
               <React.Fragment key={i}>
                 <span className="flex items-center gap-2">
                   <Lock className="w-3 h-3 text-emerald-500/50" /> 
                   ENCRYPTION_LEVEL: AES-256
                 </span>
                 <span className="flex items-center gap-2">
                   <Globe className="w-3 h-3 text-blue-500/50" /> 
                   GLOBAL_NODES: ACTIVE
                 </span>
                 <span className="flex items-center gap-2">
                   <Zap className="w-3 h-3 text-amber-500/50" /> 
                   LATENCY: 12ms
                 </span>
                 <span className="text-emerald-500/30">
                   HASH: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}...
                 </span>
               </React.Fragment>
             ))}
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
