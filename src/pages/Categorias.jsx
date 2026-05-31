import { motion } from 'framer-motion';
import { Clock, Users, Target } from 'lucide-react';

import { categories } from '../data/categorias';

const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const Categorias = () => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 bg-black min-h-screen text-white relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Glow sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(80,110,200,0.12) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-20 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
          >
            Competencias
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={serif}
          >
            Disciplinas <em style={{ ...serif, fontStyle: 'italic' }}>técnicas</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed"
          >
            Cinco categorías diseñadas para evaluar habilidades prácticas y conocimiento técnico a nivel profesional.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.article
                key={cat.id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="liquid-glass rounded-2xl overflow-hidden group flex flex-col w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-[400px]"
              >
                {/* Imagen */}
                <div className="relative h-56 overflow-hidden bg-white/[0.02]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full glass-pill flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <span className="glass-pill text-white text-[10px] font-medium px-3 py-1.5 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                      <Users className="w-3 h-3" strokeWidth={2} /> {cat.details.teams}
                    </span>
                    <span className="glass-pill text-white text-[10px] font-medium px-3 py-1.5 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                      <Clock className="w-3 h-3" strokeWidth={2} /> {cat.details.duration}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  <p className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-3">
                    {cat.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight" style={serif}>
                    {cat.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-6 flex-1">
                    {cat.description}
                  </p>

                  <div className="pt-6 border-t border-white/[0.08]">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-4">
                      Criterios de evaluación
                    </p>
                    <ul className="space-y-2.5">
                      {cat.details.criteria.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-white/75">
                          <Target className="w-3.5 h-3.5 mt-0.5 text-white/50 shrink-0" strokeWidth={2} />
                          <span className="leading-snug">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Categorias;
