import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, PlayCircle, BookOpen, Ruler, FileText } from 'lucide-react';

const Recursos = () => {
  const resources = [
    { title: 'Reglamento General', type: 'PDF', icon: FileText, size: '2.4 MB', desc: 'Normas oficiales, penalizaciones y criterios para todas las categorias.' },
    { title: 'Plantilla Proyecto Innovacion', type: 'DOCX', icon: FileDown, size: '845 KB', desc: 'Formato oficial para la documentacion y presentacion de proyectos.' },
    { title: 'Setup de Entorno C++', type: 'Video', icon: PlayCircle, size: '12 min', desc: 'Tutorial paso a paso para configurar el IDE y compilador requerido.' },
    { title: 'Planos Cancha SumoRobot', type: 'PDF', icon: Ruler, size: '1.1 MB', desc: 'Dimensiones oficiales del dohyo, materiales y especificaciones tecnicas.' },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#070b0a] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Documentos</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Recursos de Apoyo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Material oficial, guias y reglamentos para la competencia 2026.
          </motion.p>
        </div>

        {/* Featured Resource */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-2 gap-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden card-lift relative">
            {/* Image side */}
            <div className="aspect-[4/3] md:aspect-auto img-placeholder relative">
              <div className="absolute inset-0 bg-[#070b0a]/30 mix-blend-multiply z-10 pointer-events-none" />
              <img
                src="/assets/guia-robot.jpg"
                alt="Guia Robot Sigue Lineas"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<span class="text-white/40 text-sm font-semibold z-20 relative">guia-robot.jpg</span>';
                }}
              />
            </div>
            {/* Content side */}
            <div className="p-8 md:p-10 flex flex-col justify-center relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                <BookOpen className="w-3.5 h-3.5" />
                Documento Destacado
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                Guia Maestra: Robot Sigue Lineas
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                El manual tecnico definitivo paso a paso. Aprende a disenar el chasis, programar sensores infrarrojos y calibrar algoritmos PID para maxima precision.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.98] w-fit text-sm"
              >
                Descargar PDF
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Resource Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {resources.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 card-lift flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/5 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-white/10 px-2 py-0.5 rounded shrink-0">{item.size}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2">{item.desc}</p>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.type}</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recursos;
