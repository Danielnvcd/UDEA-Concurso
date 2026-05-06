import { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { MapPin, ArrowRight, Users2, LayoutGrid, Medal, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';

import imgProgramacion from '../assets/programacion_inicio.jpg';
import imgAjedrez2 from '../assets/ajedres2_inicio.jpg';
import imgSumo from '../assets/sumo_inicio.jpg';
import imgSigueLinea2 from '../assets/siguelinea_incio.jpg';
import imgFoto from '../assets/foto_inicio.jpg';
import imgGanadores from '../assets/ganadores_inicio.jpg';

/* ── Animated Counter ── */
const AnimatedCounter = ({ from, to, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const spring = useSpring(from, { duration: 1800, bounce: 0 });
  const display = useTransform(spring, (v) => prefix + Math.round(v) + suffix);

  useEffect(() => {
    if (isInView) spring.set(to);
  }, [isInView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

/* ── Fade-in wrapper ── */
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

const Inicio = () => {
  const stats = [
    { icon: Users2,     label: 'Participantes', value: 300,   prefix: '+', suffix: '', desc: 'Estudiantes registrados'    },
    { icon: LayoutGrid, label: 'Categorias',    value: 5,     prefix: '',  suffix: '', desc: 'Disciplinas tecnicas'        },
    { icon: Landmark,   label: 'Sedes',         value: 2,     prefix: '',  suffix: '', desc: 'Planteles universitarios'    },
    { icon: Medal,      label: 'En premios',    value: 10000, prefix: '$', suffix: '', desc: 'Para los ganadores'          },
  ];

  const sedes = [
    {
      name: 'Plantel CAPU',
      role: 'Sede Principal',
      desc: 'Centro de innovacion, desarrollo y ceremonia de clausura. Equipado con laboratorios de ultima generacion.',
      image: 'sede-capu.png',
    },
    {
      name: 'Plantel 11 Sur',
      role: 'Sede Tecnica',
      desc: 'Centro de alta tecnologia para robotica, competencias algoritmicas y pruebas de campo.',
      image: 'sede-11sur.png',
    },
  ];

  const organizadores = [
    {
      name: 'Profa. Sandra',
      role: 'Organizadora',
      desc: '',
      image: 'profa-sandra.jpg',
      initials: 'S',
    },
    {
      name: 'Prof. Nacho',
      role: 'Organizador',
      desc: '',
      image: 'prof-nacho.jpg',
      initials: 'N',
    },
  ];

  return (
    <div className="w-full overflow-hidden">

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

        {/* Photo Collage Background */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {[imgProgramacion, imgAjedrez2, imgSumo,
            imgSigueLinea2, imgFoto, imgGanadores].map((src, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: i * 0.05, ease: 'easeOut' }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />

        {/* Grid pattern on top */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-32 pb-20">

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]"
          >
            Concurso Tecnologico
            <br />
            <span className="text-gradient bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
              Universidad de los Angeles
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Participa en competencias de innovacion, programacion y robotica.
            Demuestra tus habilidades y se parte de la elite del futuro.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CountdownTimer targetDate="2026-06-20T00:00:00" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
          >
            <Link
              to="/categorias"
              className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Explorar Categorias
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#inscripcion"
              className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-base backdrop-blur-sm hover:bg-white/20 transition-all inline-flex items-center justify-center"
            >
              Inscribete Ahora
            </a>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="relative -mt-16 z-20 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal>
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-8 flex flex-col gap-3 group hover:bg-slate-50 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                      <div>
                        <div className="text-3xl md:text-4xl font-black tabular-nums text-blue-900">
                          <AnimatedCounter from={0} to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 mt-1">{stat.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
                      </div>
                      <div className="h-px w-8 bg-blue-900/30 group-hover:w-12 transition-all duration-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ═══════ SEDES ═══════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 block">Ubicaciones</span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Sedes del Evento</h3>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                El concurso se lleva a cabo simultaneamente en nuestros dos planteles principales.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sedes.map((sede, idx) => (
              <Reveal key={sede.name} delay={idx * 0.15}>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-lift group">
                  {/* ── IMAGE PLACEHOLDER ── */}
                  <div className="aspect-[16/9] overflow-hidden img-placeholder">
                    <img
                      src={`/assets/${sede.image}`}
                      alt={sede.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += `<span class="text-slate-400 text-sm font-semibold">${sede.image}</span>`;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-sky-500">{sede.role}</span>
                      <MapPin className="w-4 h-4 text-slate-300" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{sede.name}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{sede.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ORGANIZADORES ═══════ */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 block">Logistica</span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4"></h3>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                Se encargan del desarrollo del evento y gracias a ellos se lleva a cabo el concurso.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {organizadores.map((org, idx) => (
              <Reveal key={org.name} delay={idx * 0.15}>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-5 card-lift">
                  {/* ── PHOTO PLACEHOLDER ── */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 img-placeholder">
                    <img
                      src={`/assets/${org.image}`}
                      alt={org.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += `<div class="w-full h-full bg-gradient-to-br from-blue-900 to-sky-500 flex items-center justify-center"><span class="text-white text-2xl font-black">${org.initials}</span></div>`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-0.5">{org.name}</h4>
                    <p className="text-sky-500 font-semibold text-sm mb-2">{org.role}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{org.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Inicio;
