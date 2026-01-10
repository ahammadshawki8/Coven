import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, TrendingUp } from 'lucide-react';

interface LandingViewProps {
  onEnter: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onEnter }) => {
  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <motion.path
             d="M0,50 Q25,40 50,50 T100,50"
             fill="none"
             stroke="#10b981"
             strokeWidth="0.2"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
           />
           <motion.path
             d="M0,60 Q25,70 50,60 T100,60"
             fill="none"
             stroke="#0f766e"
             strokeWidth="0.2"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 4, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
           />
        </svg>
      </div>

      <motion.div 
        className="z-10 text-center px-4 max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-8">
           <motion.div
             initial={{ scale: 0, rotate: -45 }}
             animate={{ scale: 1, rotate: 0 }}
             transition={{ duration: 0.8, type: "spring" }}
             className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-900/50"
           >
             <Activity className="text-white w-8 h-8" />
           </motion.div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          From loan documents to <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            living timelines.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Coven transforms static credit agreements into intelligent, visual compliance dashboards. Enterprise-grade monitoring for the modern lender.
        </p>

        <motion.button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-semibold rounded-full text-lg hover:bg-emerald-400 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Feature Pills */}
      <motion.div 
        className="absolute bottom-12 flex gap-6 md:gap-12 text-slate-500 text-sm font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Automated Compliance</span>
        </div>
        <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Risk Forecasting</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingView;
