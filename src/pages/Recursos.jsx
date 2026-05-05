import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, PlayCircle } from 'lucide-react';

const Recursos = () => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-800 tracking-tight"
          >
            Recursos de Apoyo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Material oficial, guías y reglamentos para la competencia 2026.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Main Important Resource */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-900 to-sky-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden card-lift"
          >
            {/* Watermark */}
            <div className="absolute -bottom-10 -right-4 font-black text-[12rem] leading-none text-white/5 pointer-events-none select-none">
              GUÍA
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/30 text-sm font-bold text-white uppercase tracking-wider">
                Documento Destacado
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Guía Maestra: Robot Sigue Líneas</h2>
              <p className="text-sky-50 text-lg mb-10 max-w-2xl font-medium leading-relaxed">
                El manual técnico definitivo paso a paso. Aprende a diseñar el chasis, programar los sensores y calibrar algoritmos PID.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-blue-900 font-black px-8 py-4 rounded-full shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
              >
                Descargar PDF
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
              </a>
            </div>
          </motion.div>

          {/* Other Resources */}
          {[
            { title: 'Reglamento General', type: 'PDF Document', icon: FileDown, size: '2.4 MB' },
            { title: 'Plantilla Proyecto Innovación', type: 'Word Document', icon: FileDown, size: '845 KB' },
            { title: 'Setup de Entorno C++', type: 'Video Tutorial', icon: PlayCircle, size: '12 min' },
            { title: 'Planos Cancha SumoRobot', type: 'PDF Document', icon: FileDown, size: '1.1 MB' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + (idx * 0.1) }}
                className="bg-white p-6 rounded-3xl border border-slate-200 card-lift flex items-start gap-5 cursor-pointer group relative"
              >
                {/* Tooltip file size */}
                <motion.div 
                  className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {item.size}
                </motion.div>

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="pr-12">
                  <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-blue-900 transition-colors">{item.title}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{item.type}</p>
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
