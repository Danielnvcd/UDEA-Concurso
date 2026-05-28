import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { MapPin, ArrowRight, Users2, LayoutGrid, Medal, Landmark, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { supabase } from '../lib/supabase';

import imgProgramacion from '../assets/programacion_inicio.jpg';
import imgAjedrez2 from '../assets/ajedres2_inicio.jpg';
import imgSumo from '../assets/sumo_inicio.jpg';
import imgSigueLinea2 from '../assets/siguelinea_incio.jpg';
import imgFoto from '../assets/foto_inicio.jpg';
import imgGanadores from '../assets/ganadores_inicio.jpg';


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
  const [eventDate, setEventDate] = useState('2026-06-20T00:00:00');
  const [platformStatus, setPlatformStatus] = useState('open');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
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
      }
    };
    fetchSettings();
  }, []);
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
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#070b0a]">

        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-60"
            autoPlay
            loop
            muted
            playsInline
            src="/assets/inicio-video.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent" />
        </div>


        {/* Central Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none">
          <div
            className="absolute inset-0 rounded-[100%]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(30, 58, 138, 0.25) 0%, transparent 70%)',
              filter: 'blur(25px)',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20 flex flex-col items-center text-center">


          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="-mt-8 flex flex-col items-center"
          >
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Concurso Tecnológico
            </span>

            <h1 className="text-[40px] md:text-[72px] font-extrabold uppercase tracking-tight text-white mb-6 leading-[1.05]" style={{ fontFamily: 'Inter, sans-serif' }}>
              UNIVERSIDAD DE LOS <br className="hidden md:block" /> ANGELES<span className="text-blue-500">.</span>
            </h1>

            <p className="text-[14px] text-white/70 max-w-[512px] mx-auto font-normal leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Participa en competencias de innovación, programación y robótica. Demuestra tus habilidades y sé parte de la élite del futuro.
            </p>

            <div className="mb-10 w-full flex justify-center">
              <CountdownTimer targetDate={eventDate} />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link
                to="/categorias"
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[14px] uppercase tracking-wide border border-white/10 transition-all inline-flex items-center justify-center gap-2"
              >
                Explorar Categorías
              </Link>

              {platformStatus === 'coming_soon' ? (
                <div className="px-8 py-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl font-bold text-[14px] uppercase tracking-wide cursor-not-allowed">
                  Próximamente
                </div>
              ) : platformStatus === 'closed' ? (
                <div className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-[14px] uppercase tracking-wide cursor-not-allowed">
                  Inscripciones Cerradas
                </div>
              ) : (
                <Link
                  to="/inscripcion"
                  className="group px-8 py-4 bg-blue-900 text-white rounded-xl font-bold text-[14px] uppercase tracking-wide shadow-lg hover:shadow-blue-900/40 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
                >
                  Inscríbete Ahora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════ SEDES ═══════ */}
      <section className="py-24 bg-[#070b0a] border-t border-white/5 relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ubicaciones</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Sedes del Evento</h3>
              <p className="text-white/60 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                El concurso se lleva a cabo simultáneamente en nuestros dos planteles principales.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sedes.map((sede, idx) => (
              <Reveal key={sede.name} delay={idx * 0.15}>
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden card-lift group backdrop-blur-md">
                  {/* ── IMAGE PLACEHOLDER ── */}
                  <div className="aspect-[16/9] overflow-hidden img-placeholder relative bg-[#070b0a]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-[#070b0a]/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                    <img
                      src={`/assets/${sede.image}`}
                      alt={sede.name}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += `<span class="text-white/40 text-sm font-semibold">${sede.image}</span>`;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">{sede.role}</span>
                      <MapPin className="w-4 h-4 text-white/30" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-2">{sede.name}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{sede.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ORGANIZADORES ═══════ */}
      <section className="py-24 bg-[#070b0a] relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Logística</span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Comité Organizador</h3>
              <p className="text-white/60 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                Se encargan del desarrollo del evento y gracias a ellos se lleva a cabo el concurso.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {organizadores.map((org, idx) => (
              <Reveal key={org.name} delay={idx * 0.15}>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-start gap-5 card-lift backdrop-blur-md">
                  {/* ── ICON PLACEHOLDER ── */}
                  <div className="w-20 h-20 rounded-2xl shrink-0 bg-white/5 flex items-center justify-center border border-white/10">
                    <User className="w-10 h-10 text-white/40 drop-shadow-sm" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-0.5">{org.name}</h4>
                    <p className="text-blue-400 font-semibold text-sm mb-2">{org.role}</p>
                    <p className="text-white/50 text-sm leading-relaxed">{org.desc}</p>
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
