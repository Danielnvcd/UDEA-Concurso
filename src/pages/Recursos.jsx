import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, BookOpen, FileText } from 'lucide-react';

const Recursos = () => {
  const resources = [
    {
      title: 'Guía: Sigue Líneas',
      type: 'WEB',
      image: '/assets/sigue-linea.png',
      size: 'Guía',
      desc: 'Accede a esta guía recomendada con información técnica, esquemas y mejores prácticas.',
      link: 'https://siguelineas.danielnvcd.site/'
    },
    {
      title: 'Convocatoria Oficial',
      type: 'PDF',
      icon: FileText,
      size: '3.2 MB',
      desc: 'Bases y condiciones de la 6ta edición del concurso.',
      link: '/Convocatoria%206o%20concurso%2026.pdf'
    },
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

        {/* General Rulebook */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {resources.map((item) => {
            const Icon = item.icon;
            const isWeb = item.type === 'WEB';
            return (
              <a
                key={item.title}
                href={item.link}
                target={isWeb ? "_blank" : undefined}
                rel={isWeb ? "noreferrer" : undefined}
                download={!isWeb}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 card-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#070b0a] border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-contain drop-shadow-lg" />
                    ) : (
                      <Icon className="w-6 h-6 text-blue-400" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 mt-4 sm:mt-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">{item.size} • {item.type}</span>
                  <div className="w-full sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors gap-2">
                    <span className="sm:hidden text-sm font-bold">{isWeb ? 'Visitar' : 'Descargar'}</span>
                    {isWeb ? <ArrowUpRight className="w-5 h-5" /> : <FileDown className="w-5 h-5" />}
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
