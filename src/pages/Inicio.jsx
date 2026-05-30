import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { supabase } from '../lib/supabase';

const serif = { fontFamily: "'Instrument Serif', serif" };

const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="max-w-3xl mx-auto text-center mb-16">
    <p className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-5">
      {eyebrow}
    </p>
    <h2
      className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-[-0.01em] mb-5 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
      style={serif}
    >
      {title}
    </h2>
    <p className="text-base text-white/55 leading-relaxed">
      {description}
    </p>
  </div>
);

const Inicio = () => {
  const [eventDate, setEventDate] = useState(null);
  const [platformStatus, setPlatformStatus] = useState('open');
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const videoRef = useRef(null);

  // Video: respeta prefers-reduced-motion y se pausa cuando el hero sale del viewport
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      v.pause();
      return;
    }

    v.play().catch(() => {});

    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'event_config')
          .single();

        if (data && data.value) {
          if (data.value.event_date) setEventDate(data.value.event_date);
          if (data.value.status) setPlatformStatus(data.value.status);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setSettingsLoaded(true);
      }
    };
    fetchSettings();
  }, []);

  const sedes = [
    {
      name: 'Plantel CAPU',
      role: 'Sede Principal',
      desc: 'Centro de innovación, desarrollo y ceremonia de clausura. Equipado con laboratorios de última generación.',
      image: 'sede-capu.png',
    },
    {
      name: 'Plantel 11 Sur',
      role: 'Sede Técnica',
      desc: 'Centro de alta tecnología para robótica, competencias algorítmicas y pruebas de campo.',
      image: 'sede-11sur.png',
    },
  ];

  const organizadores = [
    {
      name: 'Mtra. Sandra Armenta Ortigoza',
      role: 'Organizadora',
      desc: 'Ingeniería en Mecatrónica.',
    },
    {
      name: 'Mtro. Ignacio Rosales Ortiz',
      role: 'Organizador',
      desc: 'Ingeniería en Sistemas.',
    },
  ];

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-top opacity-60"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            src="/assets/background-inicio.mp4"
          />
          {/* Overlays para integrarlo al diseño liquid-glass */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at top, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-7 sm:gap-10 pt-20 sm:pt-0">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase"
          >
            Concurso Tecnológico — Edición 2026
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
            style={serif}
          >
            Universidad de los Ángeles
          </motion.h1>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl leading-relaxed -mt-3 sm:-mt-4 px-2"
          >
            Participa en competencias de innovación, programación y robótica.
            Demuestra tus habilidades y sé parte de la élite del futuro.
          </motion.p>

          {/* Countdown con skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="min-h-[152px] md:min-h-[148px] flex items-center justify-center"
          >
            {settingsLoaded && eventDate ? (
              <CountdownTimer targetDate={eventDate} />
            ) : (
              <div className="flex gap-2 sm:gap-3 md:gap-5 my-10" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] md:w-24 md:h-24 rounded-xl sm:rounded-2xl liquid-glass animate-pulse"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto px-4 sm:px-0"
          >
            {platformStatus === 'coming_soon' ? (
              <div className="px-8 sm:px-10 py-3.5 text-[14px] font-medium border border-white/10 rounded-full text-white/60 cursor-not-allowed text-center min-h-[48px] flex items-center justify-center">
                Próximamente
              </div>
            ) : platformStatus === 'closed' ? (
              <div className="px-8 sm:px-10 py-3.5 text-[14px] font-medium border border-white/10 rounded-full text-white/60 cursor-not-allowed text-center min-h-[48px] flex items-center justify-center">
                Inscripciones cerradas
              </div>
            ) : (
              <Link
                to="/inscripcion"
                className="liquid-glass rounded-full px-8 sm:px-10 py-3.5 text-[14px] font-medium text-white active:opacity-80 transition-opacity inline-flex items-center justify-center gap-2 min-h-[48px]"
              >
                Inscríbete ahora
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/categorias"
              className="px-8 sm:px-10 py-3.5 text-[14px] font-medium border border-white/10 rounded-full active:border-white/30 active:bg-white/[0.04] transition-all duration-300 text-white/90 backdrop-blur-sm inline-flex items-center justify-center min-h-[48px]"
            >
              Explorar categorías
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ═══════ SEDES ═══════ */}
      <section className="relative py-20 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Ubicaciones"
              title={<>Planteles del <em style={{ ...serif, fontStyle: 'italic' }}>evento</em></>}
              description="El concurso se lleva a cabo simultáneamente en nuestros dos planteles principales."
            />
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {sedes.map((sede, idx) => (
              <Reveal key={sede.name} delay={idx * 0.1}>
                <article className="liquid-glass rounded-2xl overflow-hidden group h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden bg-white/[0.02] relative">
                    <img
                      src={`/assets/${sede.image}`}
                      alt={sede.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase">
                        {sede.role}
                      </span>
                      <MapPin className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-3" style={serif}>
                      {sede.name}
                    </h3>
                    <p className="text-sm text-white/55 leading-relaxed">
                      {sede.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════ ORGANIZADORES ═══════ */}
      <section className="relative py-20 sm:py-28 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Logística"
              title={<>Comité <em style={{ ...serif, fontStyle: 'italic' }}>organizador</em></>}
              description="Se encargan del desarrollo del evento y gracias a ellos se lleva a cabo el concurso."
            />
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {organizadores.map((org, idx) => (
              <Reveal key={org.name} delay={idx * 0.1}>
                <article className="liquid-glass rounded-2xl p-8 h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 shrink-0 rounded-full glass-pill flex items-center justify-center">
                      <User className="w-6 h-6 text-white/60" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase block mb-2">
                        {org.role}
                      </span>
                      <h3 className="text-xl font-medium text-white mb-2 leading-tight" style={serif}>
                        {org.name}
                      </h3>
                      <p className="text-sm text-white/55 leading-relaxed">
                        {org.desc}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Inicio;
