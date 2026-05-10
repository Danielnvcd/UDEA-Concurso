import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { agendaDays } from '../data/agenda';

const Eventos = () => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = agendaDays[activeDayIdx];

  return (
    <div className="pt-28 pb-24 bg-[#070b0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Agenda</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cronograma del Evento
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Un evento de múltiples fases. Acompaña a los equipos en su camino hacia la victoria.
          </motion.p>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-12 relative z-10">
          <div className="bg-white/5 p-1 flex-wrap sm:flex-nowrap rounded-xl flex border border-white/10 max-w-fit shadow-lg backdrop-blur-md">
            {agendaDays.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeDayIdx === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {day.tabName}
              </button>
            ))}
          </div>
        </div>



        {/* Timeline Content */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-10 top-0 bottom-0 w-px bg-white/10">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-b from-sky-500 to-blue-900 origin-top"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDayIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10 pl-24 md:pl-32">
                <h2 className="text-2xl font-bold text-white mb-2">{activeDay.date}</h2>
                <p className="text-slate-400 font-medium">{activeDay.description}</p>
              </div>

              <div className="space-y-0">
                {activeDay.schedule.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={`${activeDayIdx}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="relative flex items-start gap-6 pb-12 last:pb-0"
                    >
                      {/* Dot */}
                      <div className="relative z-10 shrink-0">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border backdrop-blur-md ${
                          item.isFinal
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}>
                          <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pt-2 flex-1 min-w-0">
                        <span className={`text-xs font-bold tracking-widest mb-1 block ${
                          item.isFinal ? 'text-blue-400' : 'text-slate-500'
                        }`}>
                          {item.time} HRS
                        </span>
                        <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
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
