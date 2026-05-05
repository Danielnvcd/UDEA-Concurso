import { motion } from 'framer-motion';

const schedule = [
  { time: '08:00 AM', title: 'Registro y Recepción', desc: 'Confirmación de equipos y asignación de lugares.' },
  { time: '09:00 AM', title: 'Ceremonia de Inauguración', desc: 'Palabras de bienvenida por parte de los organizadores.' },
  { time: '10:00 AM', title: 'Inicio de Competencias', desc: 'Arrancan simultáneamente todas las categorías.' },
  { time: '02:00 PM', title: 'Receso / Comida', desc: 'Tiempo libre para los participantes.' },
  { time: '03:30 PM', title: 'Fase Final', desc: 'Rondas eliminatorias finales y combates por el campeonato.' },
  { time: '06:00 PM', title: 'Premiación y Clausura', desc: 'Entrega de reconocimientos y cierre del evento.', isFinal: true },
];

const Eventos = () => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6 text-slate-800 tracking-tight"
          >
            Cronograma de Actividades
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Conoce el orden del día y planifica tu estrategia.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative pl-4 md:pl-0">
          
          {/* Animated fill line */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-0.5 bg-slate-100 transform md:-translate-x-1/2">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full bg-sky-500 origin-top"
            />
          </div>
          
          <div className="space-y-12">
            {schedule.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex items-center justify-between md:justify-normal w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Empty space for desktop alternating layout */}
                <div className="hidden md:block md:w-5/12"></div>

                {/* Center Dot Animated */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileInView={{ scale: [1, 1.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                    className="w-4 h-4 rounded-full border-4 border-sky-500 bg-white"
                  />
                </div>

                {/* Content Card */}
                <div className="w-full ml-12 md:ml-0 md:w-5/12">
                  <div 
                    className={`p-6 rounded-3xl relative transition-all card-lift border border-slate-100 ${
                      item.isFinal ? 'bg-sky-50 border-l-4 border-l-sky-500 shadow-sm' : 'bg-white hover:border-sky-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold tracking-wider ${item.isFinal ? 'text-sky-600' : 'text-slate-500'}`}>
                        {item.time}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Eventos;
