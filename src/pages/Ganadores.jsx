import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

const serif = { fontFamily: "'Instrument Serif', serif" };

const Ganadores = () => {
  const [winnersByCategory, setWinnersByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [platformStatus, setPlatformStatus] = useState('open');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsPromise = supabase
          .from('settings')
          .select('value')
          .eq('key', 'event_config')
          .single();

        const winnersPromise = supabase.rpc('get_published_winners');

        const [settingsRes, winnersRes] = await Promise.all([settingsPromise, winnersPromise]);

        if (settingsRes.data?.value?.status) {
          setPlatformStatus(settingsRes.data.value.status);
        }

        if (winnersRes.error) throw winnersRes.error;

        // Normalizamos al shape que el render espera
        const normalized = (winnersRes.data || []).map(w => ({
          id: w.id,
          place: w.place,
          title: w.title,
          prize: w.prize,
          notes: w.notes,
          categories: { name: w.category_name, slug: w.category_slug },
          teams: w.team_id ? {
            folio: w.team_folio,
            team_name: w.team_name,
            photo_url: w.team_photo_url,
            institution: w.team_institution,
          } : null,
        }));

        const grouped = {};
        normalized.forEach(w => {
          if (!w?.categories?.name || !w?.teams) return;
          const catName = w.categories.name;
          if (!grouped[catName]) grouped[catName] = [];
          grouped[catName].push(w);
        });

        setWinnersByCategory(grouped);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-black gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/15 border-t-white"></div>
        <p className="text-white/60 text-sm">Cargando ganadores…</p>
      </div>
    );
  }

  const getPlaceStyles = (place) => {
    switch (place) {
      case 1:
        return { icon: <Trophy className="h-5 w-5 text-white" />, label: '1er Lugar' };
      case 2:
        return { icon: <Medal className="h-5 w-5 text-white/80" />, label: '2do Lugar' };
      case 3:
        return { icon: <Medal className="h-5 w-5 text-white/70" />, label: '3er Lugar' };
      default:
        return { icon: <Award className="h-5 w-5 text-white/70" />, label: 'Mención Especial' };
    }
  };

  const hasWinners = Object.keys(winnersByCategory).length > 0;

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 sm:pb-24 bg-black text-white relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(80,110,200,0.12) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-5"
          >
            Reconocimientos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={serif}
          >
            Ganadores del <em style={{ ...serif, fontStyle: 'italic' }}>concurso</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed"
          >
            Celebramos el talento, la innovación y el esfuerzo de los equipos destacados.
          </motion.p>
        </div>

        {/* Banner de estado */}
        {!hasWinners ? (
          <div className="mb-12 sm:mb-16 max-w-2xl mx-auto">
            <div className="liquid-glass rounded-2xl p-7 sm:p-10 text-center">
              <Trophy className="h-10 w-10 text-white/30 mx-auto mb-5" strokeWidth={1.5} />
              <h3 className="text-2xl font-medium text-white mb-3" style={serif}>
                {platformStatus === 'coming_soon'
                  ? 'Próximamente: ganadores'
                  : platformStatus === 'closed'
                  ? 'Competencia en progreso'
                  : 'Aún no hay ganadores de la edición actual'}
              </h3>
              <p className="text-sm text-white/55 leading-relaxed">
                {platformStatus === 'coming_soon'
                  ? 'El concurso aún no ha comenzado. Mantente atento para conocer a los futuros campeones.'
                  : platformStatus === 'closed'
                  ? 'Las inscripciones están cerradas. Los ganadores serán revelados al concluir el evento.'
                  : 'Los ganadores de esta edición serán publicados al finalizar el concurso.'}
              </p>
            </div>
          </div>
        ) : (
          platformStatus !== 'open' && (
            <div className="mb-10 sm:mb-12 flex justify-center px-5 sm:px-0">
              <div className="glass-pill inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm text-white/75 text-center">
                <Trophy className="h-4 w-4 text-white/70" strokeWidth={1.75} />
                {platformStatus === 'coming_soon'
                  ? 'La próxima edición se anunciará pronto. Mientras tanto, revisa a los campeones de ediciones anteriores.'
                  : 'Competencia en progreso. Estos son los ganadores de ediciones anteriores.'}
              </div>
            </div>
          )
        )}

        {hasWinners && (
          <div className="space-y-20">
            <div className="text-center mb-4">
              <p className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase">
                Ediciones anteriores
              </p>
            </div>

            {Object.entries(winnersByCategory).map(([categoryName, winners], index) => (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <div className="flex items-center justify-center mb-8 sm:mb-10 gap-3 sm:gap-5">
                  <div className="h-px bg-white/[0.08] flex-1 max-w-[80px] sm:max-w-[180px]" />
                  <h2 className="text-2xl md:text-3xl font-medium text-white text-center" style={serif}>{categoryName}</h2>
                  <div className="h-px bg-white/[0.08] flex-1 max-w-[80px] sm:max-w-[180px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                  {winners.sort((a, b) => a.place - b.place).map((winner) => {
                    const style = getPlaceStyles(winner.place);
                    return (
                      <div key={winner.id} className="liquid-glass rounded-2xl overflow-hidden">
                        {winner.teams?.photo_url ? (
                          <div className="h-48 w-full relative">
                            <img src={winner.teams.photo_url} alt={winner.teams?.team_name || ''} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 glass-pill px-3 py-1.5">
                              {style.icon}
                              <span className="text-white text-xs font-medium uppercase tracking-[0.15em]">{style.label}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 w-full flex items-center justify-center border-b border-white/[0.06]">
                            <div className="flex flex-col items-center gap-2">
                              {style.icon}
                              <span className="text-white text-xs font-medium uppercase tracking-[0.15em]">{style.label}</span>
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="text-xl font-medium text-white mb-2" style={serif}>{winner.teams?.team_name || 'Equipo'}</h3>
                          <div className="flex items-center text-white/55 text-sm mb-4">
                            <Users className="h-4 w-4 mr-1.5" strokeWidth={1.75} />
                            <span>{winner.teams?.institution || '—'}</span>
                          </div>

                          {winner.prize && (
                            <div className="glass-pill px-3 py-2 mt-3 inline-block">
                              <p className="text-[10px] text-white/55 font-medium uppercase tracking-[0.2em] mb-0.5">Premio</p>
                              <p className="text-sm font-medium text-white">{winner.prize}</p>
                            </div>
                          )}

                          {winner.notes && (
                            <p className="mt-4 text-sm text-white/55 italic leading-relaxed">"{winner.notes}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ganadores;
