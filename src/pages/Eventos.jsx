import { motion } from 'framer-motion';
import { Clock, Flag, Coffee, Award, Mic, Swords } from 'lucide-react';

const schedule = [
  { time: '08:00', title: 'Registro y Recepcion', desc: 'Confirmacion de equipos, entrega de materiales y asignacion de areas.', icon: Clock },
  { time: '09:00', title: 'Ceremonia de Inauguracion', desc: 'Palabras de bienvenida de los organizadores y presentacion de jueces.', icon: Mic },
  { time: '10:00', title: 'Inicio de Competencias', desc: 'Arrancan simultaneamente todas las categorias en ambas sedes.', icon: Flag },
  { time: '14:00', title: 'Receso y Comida', desc: 'Tiempo libre. Area de exhibiciones y demos abiertas al publico.', icon: Coffee },
  { time: '15:30', title: 'Fase Final', desc: 'Rondas eliminatorias, combates por el campeonato y pruebas contrarreloj.', icon: Swords },
  { time: '18:00', title: 'Premiacion y Clausura', desc: 'Entrega de trofeos, reconocimientos especiales y cierre oficial.', icon: Award, isFinal: true },
];

const Eventos = () => {
  return (
    <div className="pt-28 pb-24 bg-[#070b0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Agenda</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cronograma del Dia
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            20 de junio de 2026. Un dia completo de competencias, aprendizaje y celebracion.
          </motion.p>
        </div>

        {/* Event Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 aspect-[21/9] rounded-2xl overflow-hidden img-placeholder border border-white/10 relative"
        >
          <div className="absolute inset-0 bg-[#070b0a]/40 mix-blend-multiply z-10 pointer-events-none" />
          <img
            src="/assets/evento-banner.jpg"
            alt="Panoramica del evento TechCon UDEA"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML += '<span class="text-slate-400 text-sm font-semibold">evento-banner.jpg</span>';
            }}
          />
        </motion.div>

        {/* Timeline */}
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

          <div className="space-y-0">
            {schedule.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
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
        </div>
      </div>
    </div>
  );
};

export default Eventos;
