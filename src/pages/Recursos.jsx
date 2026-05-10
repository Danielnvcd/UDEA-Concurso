import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, BookOpen, FileText } from 'lucide-react';

const Recursos = () => {
  const resources = [
    {
      title: 'Reglamento General',
      type: 'PDF',
      icon: FileText,
      size: '2.4 MB',
      desc: 'Normas oficiales, penalizaciones y criterios generales para todas las categorías del torneo.',
      link: '/assets/reglamento-general.pdf'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#070b0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

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
            Material oficial y reglamentos técnicos para la competencia.
          </motion.p>
        </div>

        {/* Featured Resource: Sigue Lineas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-2 gap-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden card-lift relative">
            {/* Image side */}
            <div className="aspect-square md:aspect-auto flex items-center justify-center p-8 relative bg-transparent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/10 to-transparent z-10 pointer-events-none" />
              <img
                src="/assets/sigue-linea.png"
                alt="Reglamento Robot Sigue Lineas"
                className="w-full h-full object-contain opacity-90 drop-shadow-2xl hover:scale-105 transition-transform duration-500 relative z-20"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<span class="text-slate-400 text-sm font-semibold z-20 relative">sigue-linea.png</span>';
                }}
              />
            </div>
            {/* Content side */}
            <div className="p-8 md:p-10 flex flex-col justify-center relative z-20 bg-[#0a0f0d]/80">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 w-fit border border-blue-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                Material Sugerido
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                Material de Apoyo: Sigue Líneas
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Accede a esta guía recomendada con información técnica, esquemas y mejores prácticas para ayudarte a construir y programar tu propio robot velocista.
              </p>
              <a
                href="https://siguelineas.danielnvcd.site/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.98] w-fit text-sm"
              >
                Visitar Página Web
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* General Rulebook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.link}
                download
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 card-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#070b0a] text-blue-400 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 mt-4 sm:mt-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">{item.size} • {item.type}</span>
                  <div className="w-full sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors gap-2">
                    <span className="sm:hidden text-sm font-bold">Descargar</span>
                    <FileDown className="w-5 h-5" />
                  </div>
                </div>
              </a>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default Recursos;
