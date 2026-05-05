import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ from, to, suffix = "", duration = 2 }) => {
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
    <div className="w-full bg-primary overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center text-white grid-bg pt-20 lg:pt-32 pb-20">
        <div className="absolute inset-0 hero-glow pointer-events-none"></div>
        
        {/* Animated SVG Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-float ${i % 2 === 0 ? 'bg-accent-blue/20 blur-2xl' : 'bg-accent-cyan/20 blur-xl'}`}
              style={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 3}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative"
          >
            <div className="absolute -left-2 -top-2 w-3 h-3 rounded-full bg-accent-cyan animate-pulse-glow"></div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-sm font-bold tracking-wide uppercase">
              🏆 Torneo Universitario 2026
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight"
          >
            <span className="block text-gradient">Concurso Tecnológico</span>
            <span className="block text-white mt-2">Universidad de los Ángeles</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Participa en competencias de innovación, programación y robótica. Demuestra
            tus habilidades, domina la tecnología y sé parte de la élite del futuro.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              to="/categorias"
              className="px-8 py-4 bg-accent-blue text-white rounded-full font-bold shadow-lg glow-blue hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
            >
              Ver categorías
            </Link>
            <Link
              to="/recursos"
              className="px-8 py-4 bg-transparent border-2 border-accent-cyan text-accent-cyan rounded-full font-bold hover:bg-accent-cyan/10 transition-all hover:scale-105 active:scale-95"
            >
              Recursos de apoyo
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 md:gap-0 md:justify-around w-full max-w-4xl bg-accent-cyan/5 backdrop-blur-md border border-accent-cyan/20 rounded-3xl py-6 px-4 md:divide-x divide-accent-cyan/20"
          >
            {[
              { label: 'Participantes', value: 300, prefix: '+' },
              { label: 'Categorías', value: 5, prefix: '' },
              { label: 'Sedes', value: 2, prefix: '' },
              { label: 'Premios', value: 100, prefix: 'Hasta $', suffix: 'k' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center px-6 w-1/2 md:w-auto">
                <h4 className="text-3xl md:text-4xl font-black text-white mb-1">
                  {stat.prefix}
                  <AnimatedCounter from={0} to={stat.value} duration={2 + idx * 0.2} />
                  {stat.suffix}
                </h4>
                <p className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sedes Section */}
      <section className="py-24 bg-layer relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-gradient uppercase tracking-tight">Sedes del Evento</h3>
            <p className="text-text-muted max-w-2xl mx-auto text-lg">
              El concurso se llevará a cabo simultáneamente en nuestros dos planteles principales, equipados con la mejor infraestructura tecnológica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Plantel CAPU', desc: 'Sede principal de innovación, desarrollo y ceremonia de clausura.', isMain: true },
              { name: 'Plantel 11 Sur', desc: 'Centro de alta tecnología para robótica y competencias de programación algorítmica.', isMain: false },
            ].map((plantel, idx) => (
              <motion.div
                key={plantel.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="card-glass p-8 rounded-3xl relative group hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent-blue/0 group-hover:bg-accent-blue/5 transition-colors duration-300"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-accent-blue/0 to-accent-cyan/0 group-hover:from-accent-blue/50 group-hover:to-accent-cyan/50 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-accent-cyan/10 rounded-2xl flex items-center justify-center text-accent-cyan group-hover:glow-cyan transition-all border border-accent-cyan/20">
                      <MapPin className="w-8 h-8" strokeWidth={2} />
                    </div>
                    {plantel.isMain && (
                      <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 rounded-full text-xs font-bold uppercase tracking-wider">
                        Sede Principal
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-white mb-3">{plantel.name}</h4>
                  <p className="text-text-muted text-lg">{plantel.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizadores Section */}
      <section className="py-24 bg-primary grid-bg relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4 text-white uppercase tracking-tight">Comité Organizador</h3>
            <p className="text-text-muted max-w-2xl mx-auto text-lg">
              Un equipo de expertos dedicado a fomentar la tecnología y la innovación en nuestra comunidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Prof. Sandra', role: 'Coordinadora General', initials: 'PS', desc: 'Encargada de la logística global y alianzas estratégicas.' },
              { name: 'Prof. Nacho', role: 'Director Técnico', initials: 'PN', desc: 'Juez principal y supervisor de las reglas de robótica.' },
            ].map((org, idx) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="bg-layer p-6 rounded-3xl border border-white/5 flex items-center gap-6 relative group overflow-hidden"
              >
                {/* Border Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-violet opacity-0 group-hover:opacity-100 p-[1px] rounded-3xl transition-opacity duration-300 -z-10">
                  <div className="absolute inset-0 bg-layer rounded-3xl z-0"></div>
                </div>

                <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-accent-blue to-accent-violet shadow-lg relative z-10 border-2 border-white/10">
                  <span className="text-2xl font-black text-white tracking-widest">{org.initials}</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-black text-white mb-1">{org.name}</h4>
                  <p className="text-accent-cyan font-bold text-sm uppercase tracking-wider mb-2">{org.role}</p>
                  <p className="text-text-muted text-sm leading-relaxed">{org.desc}</p>
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
