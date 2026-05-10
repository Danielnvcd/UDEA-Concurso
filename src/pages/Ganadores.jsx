import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

        const winnersPromise = supabase
          .from('winners')
          .select(`
            id, place, title, prize, notes,
            category_id, categories(name, slug),
            team_id, teams(folio, team_name, photo_url, institution)
          `)
          .eq('is_published', true)
          .order('category_id')
          .order('place');

        const [settingsRes, winnersRes] = await Promise.all([settingsPromise, winnersPromise]);

        if (settingsRes.data?.value?.status) {
          setPlatformStatus(settingsRes.data.value.status);
        }

        if (winnersRes.error) throw winnersRes.error;

        // Group by category
        const grouped = {};
        winnersRes.data?.forEach(w => {
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
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#070b0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getPlaceStyles = (place) => {
    switch (place) {
      case 1:
        return { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Trophy className="h-6 w-6 text-amber-400" />, label: '1er Lugar' };
      case 2:
        return { color: 'text-slate-300', bg: 'bg-slate-400/20', icon: <Medal className="h-6 w-6 text-slate-300" />, label: '2do Lugar' };
      case 3:
        return { color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Medal className="h-6 w-6 text-orange-400" />, label: '3er Lugar' };
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Award className="h-6 w-6 text-blue-400" />, label: 'Mención Especial' };
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#070b0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Ganadores del Concurso
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Celebramos el talento, la innovación y el esfuerzo de los equipos destacados.
          </p>
        </motion.div>

        {/* Banner de estado actual del concurso */}
        <div className="mb-12">
          <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 max-w-3xl mx-auto">
            <Trophy className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {platformStatus === 'coming_soon' 
                ? 'Próximamente: Ganadores' 
                : platformStatus === 'closed'
                ? 'Competencia en Progreso'
                : 'Aún no hay ganadores de la edición actual'}
            </h3>
            <p className="text-slate-400">
              {platformStatus === 'coming_soon'
                ? 'El concurso aún no ha comenzado. Mantente atento para conocer a los futuros campeones.'
                : platformStatus === 'closed'
                ? 'Las inscripciones están cerradas. Los ganadores serán revelados al concluir el evento.'
                : 'Los ganadores de esta edición serán publicados al finalizar el concurso.'}
            </p>
          </div>
        </div>

        {Object.keys(winnersByCategory).length > 0 && (
          <div className="space-y-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                Ediciones Anteriores
              </h2>
              <div className="w-16 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></div>
            </div>
            {Object.entries(winnersByCategory).map(([categoryName, winners], index) => (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <h2 className="text-2xl font-bold text-blue-400 px-6">{categoryName}</h2>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-center">
                  {/* Sort winners to display 2nd, 1st, 3rd logic for podium if we want, but simple order is fine for cards */}
                  {winners.sort((a, b) => a.place - b.place).map((winner) => {
                    const style = getPlaceStyles(winner.place);
                    return (
                      <div key={winner.id} className="relative bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all">
                        <div className={`absolute top-0 inset-x-0 h-2 ${style.bg}`}></div>
                        
                        {winner.teams.photo_url ? (
                          <div className="h-48 w-full relative">
                            <img src={winner.teams.photo_url} alt={winner.teams.team_name} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a]/90 to-transparent"></div>
                            <div className="absolute bottom-3 left-4 flex items-center text-white">
                               {style.icon}
                               <span className="ml-2 font-bold text-lg drop-shadow-md">{style.label}</span>
                            </div>
                          </div>
                        ) : (
                          <div className={`h-32 w-full flex items-center justify-center border-b border-white/5 ${style.bg}`}>
                            <div className="flex flex-col items-center">
                               {style.icon}
                               <span className={`mt-2 font-bold ${style.color}`}>{style.label}</span>
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-1">{winner.teams.team_name}</h3>
                          <div className="flex items-center text-slate-400 text-sm mb-4">
                            <Users className="h-4 w-4 mr-1.5" />
                            <span>{winner.teams.institution}</span>
                          </div>
                          
                          {winner.prize && (
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10 mt-4">
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Premio</p>
                              <p className="text-sm font-semibold text-white">{winner.prize}</p>
                            </div>
                          )}
                          
                          {winner.notes && (
                            <p className="mt-4 text-sm text-slate-400 italic">"{winner.notes}"</p>
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
