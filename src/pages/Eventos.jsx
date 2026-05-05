import { motion } from 'framer-motion';
import { CalendarRange, MapPinned, HelpCircle } from 'lucide-react';

const schedule = [
  { time: '08:00 AM', title: 'Registro y Recepción', desc: 'Confirmación de equipos y asignación de lugares.', color: '#06b6d4' },
  { time: '09:00 AM', title: 'Ceremonia de Inauguración', desc: 'Palabras de bienvenida por parte de los organizadores.', color: '#3b82f6' },
  { time: '10:00 AM', title: 'Inicio de Competencias', desc: 'Arrancan simultáneamente todas las categorías.', color: '#3b82f6' },
  { time: '02:00 PM', title: 'Receso / Comida', desc: 'Tiempo libre para los participantes.', color: '#8b5cf6' },
  { time: '03:30 PM', title: 'Fase Final', desc: 'Rondas eliminatorias finales y combates por el campeonato.', color: '#8b5cf6' },
  { time: '06:00 PM', title: 'Premiación y Clausura', desc: 'Entrega de reconocimientos y cierre del evento.', color: '#f59e0b', isFinal: true },
];

const Eventos = () => {
  return (
    <div className="pt-32 pb-24 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="text-4xl md:text-5xl font-black mb-6 text-white uppercase tracking-tight"
          >
            Detalles del Evento
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto font-medium"
          >
            Prepárate para la jornada tecnológica más importante del año.
          </motion.p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-24 max-w-5xl mx-auto">
          {[
            { icon: CalendarRange, title: 'Fecha', info: 'Próximamente 2026', accent: '#3b82f6' },
            { icon: MapPinned, title: 'Ubicación', info: 'CAPU y 11 Sur', accent: '#06b6d4' },
            { icon: HelpCircle, title: 'Modalidad', info: 'Presencial', accent: '#8b5cf6' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-glass p-6 rounded-3xl flex items-center gap-5 border-white/5"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative"
                  style={{ backgroundColor: item.accent + '15' }}
                >
                  <div className="absolute inset-0 blur-md opacity-40 rounded-2xl" style={{ backgroundColor: item.accent }}></div>
                  <Icon className="w-6 h-6 relative z-10" style={{ color: item.accent }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-1">{item.title}</h4>
                  <p className="text-xl font-black text-white">{item.info}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative pl-4 md:pl-0">
          <h3 className="text-3xl font-black text-white mb-16 md:text-center tracking-tight">Cronograma de Actividades</h3>
          
          <div className="relative">
            {/* Timeline Line gradient */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-violet rounded-full opacity-30 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {schedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex items-center justify-between md:justify-normal w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Empty space for desktop alternating layout */}
                  <div className="hidden md:block md:w-5/12"></div>

                  {/* Center Dot */}
                  <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                    <div 
                      className="w-4 h-4 rounded-full border-4 border-primary z-10"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 15px ${item.color}` }}
                    ></div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full ml-16 md:ml-0 md:w-5/12">
                    <div 
                      className={`card-glass p-6 rounded-3xl relative transition-all hover:-translate-y-1 ${item.isFinal ? 'border-accent-gold/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-accent-cyan/10'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                          style={{ backgroundColor: item.color + '15', color: item.color, border: `1px solid ${item.color}30` }}
                        >
                          {item.time}
                        </span>
                        {item.isFinal && (
                          <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-[10px] font-bold uppercase rounded-md border border-accent-gold/30">
                            Cierre
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                      <p className="text-text-muted font-medium">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Eventos;
