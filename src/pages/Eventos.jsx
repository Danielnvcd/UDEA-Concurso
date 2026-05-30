import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { agendaDays } from '../data/agenda';

const serif = { fontFamily: "'Instrument Serif', serif" };

const Eventos = () => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = agendaDays[activeDayIdx];

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 bg-black min-h-screen text-white relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
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

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
          >
            Agenda
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={serif}
          >
            Cronograma del <em style={{ ...serif, fontStyle: 'italic' }}>evento</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed"
          >
            Un evento de múltiples fases. Acompaña a los equipos en su camino hacia la victoria.
          </motion.p>
        </div>

        {/* Tabs - scroll horizontal en mobile */}
        <div className="flex justify-center mb-10 sm:mb-14 -mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="liquid-glass rounded-2xl p-1.5 inline-flex gap-1 shrink-0">
            {agendaDays.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2 whitespace-nowrap min-h-[40px] ${
                  activeDayIdx === idx
                    ? 'bg-white/15 text-white'
                    : 'text-white/65 active:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
                {day.tabName}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 sm:left-8 md:left-10 top-0 bottom-0 w-px bg-white/[0.08]">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-b from-white/40 to-white/0 origin-top"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDayIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 sm:mb-10 pl-20 sm:pl-24 md:pl-32">
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-2" style={serif}>
                  {activeDay.date}
                </h2>
                <p className="text-white/55 text-sm md:text-base">{activeDay.description}</p>
              </div>

              <div className="space-y-0">
                {activeDay.schedule.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={`${activeDayIdx}-${idx}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      className="relative flex items-start gap-4 sm:gap-6 pb-10 sm:pb-12 last:pb-0"
                    >
                      <div className="relative z-10 shrink-0">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                          item.isFinal ? 'liquid-glass' : 'glass-pill'
                        }`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.isFinal ? 'text-white' : 'text-white/55'}`} strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="pt-1.5 sm:pt-3 flex-1 min-w-0">
                        <span className={`text-[10px] font-medium tracking-[0.2em] uppercase block mb-1.5 ${
                          item.isFinal ? 'text-white/80' : 'text-white/45'
                        }`}>
                          {item.time} HRS
                        </span>
                        <h4 className="text-lg md:text-xl font-medium text-white mb-1.5 leading-tight" style={serif}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
