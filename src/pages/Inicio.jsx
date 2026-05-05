import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';

// Animated Counter Component
const AnimatedCounter = ({ from, to, suffix = "", duration = 1.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(from, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current) + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(to);
    }
  }, [isInView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const Inicio = () => {
  return (
    <div className="w-full bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center text-white bg-gradient-to-br from-blue-900 to-sky-500 pt-24 pb-20">
        
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: i === 0 ? 300 : i === 1 ? 450 : 250,
                height: i === 0 ? 300 : i === 1 ? 450 : 250,
                left: i === 0 ? '10%' : i === 1 ? '60%' : '80%',
                top: i === 0 ? '20%' : i === 1 ? '50%' : '10%',
              }}
              animate={{ 
                scale: [1, 1.05, 1], 
                rotate: [0, 5, 0] 
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50/20 backdrop-blur-sm text-sky-100 text-sm font-bold tracking-wide">
              🏆 Torneo Universitario 2026
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          >
            <span className="block">Concurso Tecnológico</span>
            <span className="block">Universidad de los Ángeles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-sky-100 max-w-2xl mx-auto font-medium"
          >
            Participa en competencias de innovación, programación y robótica. Demuestra
            tus habilidades y sé parte de la élite del futuro.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full"
          >
            <CountdownTimer targetDate="2026-06-20T00:00:00" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4"
          >
            <Link
              to="/categorias"
              className="px-10 py-4 bg-amber-500 text-blue-900 rounded-full font-black text-lg shadow-lg hover:shadow-xl transition-transform hover:scale-105 active:scale-95 btn-shimmer inline-block"
            >
              Explorar Categorías
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 divide-x-0 md:divide-x divide-slate-100">
            {[
              { label: 'Participantes', value: 300, prefix: '+' },
              { label: 'Categorías', value: 5, prefix: '' },
              { label: 'Sedes', value: 2, prefix: '' },
              { label: 'Premios en efectivo', value: 10000, prefix: '$' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-6 text-center">
                <h4 className="text-3xl md:text-4xl font-black text-blue-900 mb-1">
                  {stat.prefix}
                  <AnimatedCounter from={0} to={stat.value} duration={1.5} />
                </h4>
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sedes Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-slate-800 tracking-tight">Sedes del Evento</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              El concurso se llevará a cabo simultáneamente en nuestros dos planteles principales, equipados con la mejor infraestructura tecnológica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Plantel CAPU', desc: 'Sede principal de innovación, desarrollo y ceremonia de clausura.', isMain: true },
              { name: 'Plantel 11 Sur', desc: 'Centro de alta tecnología para robótica y competencias algorítmicas.', isMain: false },
            ].map((plantel, idx) => (
              <motion.div
                key={plantel.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 card-lift hover:border-sky-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-colors border border-slate-100">
                    <MapPin className="w-8 h-8" strokeWidth={2} />
                  </div>
                  {plantel.isMain && (
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium tracking-wide">
                      Sede Principal
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-3">{plantel.name}</h4>
                <p className="text-slate-500 text-base">{plantel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizadores Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-slate-800 tracking-tight">Comité Organizador</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Un equipo de expertos dedicado a fomentar la tecnología y la innovación en nuestra comunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { name: 'Prof. Sandra', role: 'Coordinadora General', initials: 'S', desc: 'Encargada de la logística global y alianzas estratégicas.' },
              { name: 'Prof. Nacho', role: 'Director Técnico', initials: 'N', desc: 'Juez principal y supervisor de las reglas de robótica.' },
            ].map((org, idx) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 card-lift hover:border-sky-200"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-900 to-sky-500 shadow-sm">
                  <span className="text-3xl font-black text-white">{org.initials}</span>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{org.name}</h4>
                  <p className="text-sky-600 font-bold text-sm tracking-wide mb-1">{org.role}</p>
                  <p className="text-slate-500 text-sm">{org.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
