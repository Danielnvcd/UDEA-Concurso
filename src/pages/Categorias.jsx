import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code2, Crown, Bot, Route, ChevronDown, Clock, Users, Target } from 'lucide-react';

import { categories } from '../data/categorias';

const Categorias = () => {
  return (
    <div className="pt-28 pb-24 bg-[#070b0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Competencias</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Disciplinas Tecnicas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cinco categorias disenadas para evaluar habilidades practicas y conocimiento tecnico a nivel profesional.
          </motion.p>
        </div>

        {/* Category Cards Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] max-w-md group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-60 rounded-2xl overflow-hidden mb-6 ring-1 ring-white/10 shadow-sm bg-white/5 backdrop-blur-sm">
                  {/* Gradient for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a]/80 via-[#070b0a]/10 to-transparent z-10 pointer-events-none" />
                  
                  {/* Hover overlay mix-blend */}
                  <div className="absolute inset-0 bg-[#070b0a]/20 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                  
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md p-2.5 rounded-xl shadow-sm border border-white/10">
                    <Icon className={`w-5 h-5 ${cat.textColor}`} strokeWidth={2.5} />
                  </div>
                  
                  {/* Floating Badges */}
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Users className="w-3.5 h-3.5" strokeWidth={2.5} /> {cat.details.teams}
                    </span>
                    <span className="px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> {cat.details.duration}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 px-1 sm:px-2">
                  <div className="mb-4">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-sm font-bold text-blue-400 tracking-wide uppercase">
                      {cat.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-400 leading-relaxed text-sm mb-8 flex-1">
                    {cat.description}
                  </p>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">
                      Criterios de Evaluación
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                      {cat.details.criteria.map((c) => (
                        <div key={c} className="flex items-start gap-2.5">
                          <Target className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-sm text-slate-300 font-medium leading-tight">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Categorias;
