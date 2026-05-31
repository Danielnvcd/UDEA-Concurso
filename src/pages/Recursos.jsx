import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, FileText } from 'lucide-react';

const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

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
      desc: 'Convocatoria de la 6ta edición del concurso intrauniversitario.',
      link: '/Convocatoria%206o%20concurso%2026.pdf'
    },
    {
      title: 'Bases del Concurso 2026',
      type: 'PDF',
      icon: FileText,
      size: '568 KB',
      desc: 'Reglamento completo: categorías, criterios de evaluación, penalizaciones, premios y programa del evento.',
      link: '/Bases-Concurso-2026.pdf'
    }
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 bg-black min-h-screen text-white relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
            Documentos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={serif}
          >
            Recursos de <em style={{ ...serif, fontStyle: 'italic' }}>apoyo</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed"
          >
            Material oficial y reglamentos técnicos para la competencia.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
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
                className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group active:opacity-90 transition-opacity min-h-[72px]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl shrink-0 glass-pill flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-9 h-9 object-contain" />
                    ) : (
                      <Icon className="w-6 h-6 text-white/80" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white mb-1" style={serif}>{item.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                  <span className="text-[10px] font-medium text-white/45 uppercase tracking-[0.2em] hidden sm:block">{item.size} · {item.type}</span>
                  <div className="glass-pill h-11 w-full px-4 sm:w-12 sm:px-0 flex items-center justify-center text-white/80 group-active:text-white transition-colors gap-2">
                    <span className="sm:hidden text-sm font-medium">{isWeb ? 'Visitar' : 'Descargar'}</span>
                    {isWeb ? <ArrowUpRight className="w-4 h-4" strokeWidth={2} /> : <FileDown className="w-4 h-4" strokeWidth={2} />}
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
