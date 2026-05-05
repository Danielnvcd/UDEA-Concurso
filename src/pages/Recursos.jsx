import { motion } from 'framer-motion';
import { Library, FileDown, ArrowUpRight, PlayCircle } from 'lucide-react';

const Recursos = () => {
  return (
    <div className="pt-32 pb-24 bg-primary grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="text-5xl font-black mb-4 text-gradient uppercase tracking-tight"
          >
            Recursos y Guías
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto font-medium"
          >
            Material oficial de apoyo técnico, guías de construcción y reglamentos vigentes para la competencia 2026.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Main Important Resource */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="col-span-1 md:col-span-2 bg-layer border border-accent-cyan/30 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group glow-cyan"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 z-0"></div>
            <div className="absolute inset-0 grid-bg opacity-50 z-0"></div>
            
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none z-0 transform group-hover:scale-110 transition-transform duration-700">
              <Library className="w-80 h-80 -mt-10 -mr-10 text-accent-cyan" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/20 backdrop-blur-md mb-6 border border-accent-cyan/40 text-sm font-bold text-accent-cyan uppercase tracking-wider">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan"></span>
                </span>
                Documentación Destacada
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Guía Maestra: Robot Sigue Líneas</h2>
              <p className="text-text-main text-lg mb-10 max-w-2xl font-medium leading-relaxed">
                El manual técnico definitivo paso a paso. Aprende a diseñar el chasis, soldar los sensores infrarrojos, implementar algoritmos PID y compilar el código.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-primary font-black px-8 py-4 rounded-full shadow-lg hover:bg-slate-200 transition-all hover:scale-105 active:scale-95"
              >
                Acceder a la Guía
                <ArrowUpRight className="w-6 h-6 stroke-[3]" />
              </a>
            </div>
          </motion.div>

          {/* Other Resources */}
          {[
            { title: 'Reglamento General', type: 'PDF Document', icon: FileDown, accent: '#f43f5e' },
            { title: 'Plantilla Proyecto Innovación', type: 'Word Document', icon: FileDown, accent: '#3b82f6' },
            { title: 'Setup de Entorno C++', type: 'Video Tutorial', icon: PlayCircle, accent: '#8b5cf6' },
            { title: 'Planos Cancha SumoRobot', type: 'PDF Document', icon: FileDown, accent: '#10b981' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + (idx * 0.1) }}
                className="card-glass p-6 rounded-3xl flex items-start gap-5 cursor-pointer group transition-all hover:-translate-y-1"
                style={{ '--hover-border': item.accent }}
              >
                {/* Custom Hover Border logic via style and group-hover:border-[var(--hover-border)] requires tailwind arbitrary values, instead we use a trick */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2"
                  style={{ borderColor: item.accent + '80' }}
                ></div>

                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative transition-transform group-hover:scale-110"
                  style={{ backgroundColor: item.accent + '15' }}
                >
                  <div className="absolute inset-0 blur-md opacity-40 rounded-2xl" style={{ backgroundColor: item.accent }}></div>
                  <Icon className="w-7 h-7 relative z-10" style={{ color: item.accent }} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-1 transition-colors">{item.title}</h3>
                  <p className="text-sm font-bold uppercase tracking-wider" style={{ color: item.accent }}>{item.type}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Recursos;
