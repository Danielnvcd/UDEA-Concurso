import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Search, GraduationCap, Building, BookOpen, X } from 'lucide-react';

const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const Equipos = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('id, name');
        if (cats) setCategories(cats);

        const { data, error } = await supabase.rpc('get_public_teams');
        if (error) throw error;
        setTeams(data || []);
      } catch (err) {
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedTeam ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedTeam]);

  const filteredTeams = teams.filter(team => {
    const currentYear = new Date().getFullYear();
    const isCurrentYear = team.created_at
      ? new Date(team.created_at).getFullYear() === currentYear
      : team.folio.includes(currentYear.toString());

    if (!isCurrentYear) return false;

    const matchSearch = team.team_name.toLowerCase().includes(search.toLowerCase()) || team.folio.toLowerCase().includes(search.toLowerCase());
    if (filterCat !== 'all') {
      const catObj = categories.find(c => c.id === filterCat);
      return matchSearch && catObj && team.category_name === catObj.name;
    }
    return matchSearch;
  });

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 min-h-screen bg-black text-white relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80,110,200,0.12) 0%, transparent 60%)',
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
            Participantes Oficiales
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.05] mb-5 sm:mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent"
            style={serif}
          >
            Equipos del <em style={{ ...serif, fontStyle: 'italic' }}>concurso</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-sm sm:text-base md:text-lg text-white/55 leading-relaxed"
          >
            Los equipos participantes en la edición actual.
          </motion.p>
        </div>

        {/* Filtros */}
        <div className="mb-10 sm:mb-12 flex flex-col items-center gap-4 sm:gap-5">
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/40" strokeWidth={1.75} />
            </div>
            <input
              type="text"
              placeholder="Buscar por equipo o folio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 rounded-full border border-white/10 bg-white/[0.03] text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-base sm:text-sm transition-colors min-h-[44px]"
            />
          </div>

          {/* Filtros en scroll horizontal en mobile */}
          <div className="w-full -mx-5 sm:mx-0 overflow-x-auto px-5 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex sm:flex-wrap sm:justify-center items-center gap-2 w-max sm:w-auto mx-auto">
              <button
                onClick={() => setFilterCat('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px] ${filterCat === 'all' ? 'liquid-glass text-white' : 'text-white/65 active:text-white border border-white/10'}`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCat(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px] ${filterCat === cat.id ? 'liquid-glass text-white' : 'text-white/65 active:text-white border border-white/10'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b border-white/40"></div>
          </div>
        ) : filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTeams.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                onClick={() => setSelectedTeam(team)}
                className="liquid-glass rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full group"
              >
                <div className="h-40 relative overflow-hidden flex items-center justify-center shrink-0 bg-white/[0.02]">
                  {team.photo_url ? (
                    <img src={team.photo_url} alt={team.team_name} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Users className="h-10 w-10 text-white/20" strokeWidth={1.5} />
                  )}
                  <div className="absolute top-3 right-3 glass-pill text-white px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase">
                    {team.folio}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <span className="glass-pill inline-block w-fit text-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] mb-3">
                    {team.category_name}
                  </span>
                  <h3 className="text-lg font-medium text-white mb-3 line-clamp-2 leading-snug" style={serif}>
                    {team.team_name}
                  </h3>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center text-white/55 text-sm">
                      <Building className="h-4 w-4 mr-2 text-white/40 shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{team.institution}</span>
                    </div>
                    <div className="flex items-center text-white/55 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-white/40 shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{team.campus}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 glass-pill flex items-center justify-center mx-auto mb-6">
              <Search className="h-7 w-7 text-white/40" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2" style={serif}>No se encontraron equipos</h3>
            <p className="text-white/55">No hay resultados para tu búsqueda o filtro actual.</p>
            <button
              onClick={() => { setSearch(''); setFilterCat('all'); }}
              className="mt-6 text-white text-sm underline underline-offset-4 hover:opacity-80"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="liquid-glass rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col bg-black"
            >
              <button
                onClick={() => setSelectedTeam(null)}
                className="absolute top-4 right-4 z-30 glass-pill p-2 text-white hover:opacity-80 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>

              {selectedTeam.photo_url ? (
                <div className="w-full h-56 sm:h-72 shrink-0 relative">
                  <img src={selectedTeam.photo_url} alt="Team" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className="glass-pill inline-block text-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] mb-3">
                      {selectedTeam.category_name}
                    </span>
                    <h2 className="text-3xl text-white" style={serif}>{selectedTeam.team_name}</h2>
                  </div>
                </div>
              ) : (
                <div className="w-full p-8 shrink-0 border-b border-white/[0.08]">
                  <span className="glass-pill inline-block text-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] mb-3">
                    {selectedTeam.category_name}
                  </span>
                  <h2 className="text-3xl text-white" style={serif}>{selectedTeam.team_name}</h2>
                </div>
              )}

              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="liquid-glass rounded-2xl p-6 mb-6">
                  <p className="text-[10px] font-medium text-white/55 uppercase tracking-[0.2em] mb-5">Detalles de la institución</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center shrink-0">
                        <Building className="h-4 w-4 text-white/70" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/45 uppercase tracking-[0.18em] mb-1">Institución</p>
                        <p className="text-white text-sm">{selectedTeam.institution}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-white/70" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/45 uppercase tracking-[0.18em] mb-1">Sede</p>
                        <p className="text-white text-sm">{selectedTeam.campus}</p>
                      </div>
                    </div>
                    {(selectedTeam.career || selectedTeam.semester) && (
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-white/70" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/45 uppercase tracking-[0.18em] mb-1">Carrera y semestre</p>
                          <p className="text-white text-sm">{selectedTeam.career || 'No especificada'} {selectedTeam.semester ? `· Semestre ${selectedTeam.semester}` : ''}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-white/55 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} /> Integrantes del equipo
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTeam.members?.map((m, idx) => (
                      <div key={idx} className="liquid-glass rounded-xl p-4 flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full glass-pill flex items-center justify-center text-white font-medium">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white">{m.name}</p>
                          <p className="text-[10px] font-medium uppercase tracking-[0.18em] mt-0.5 text-white/55">
                            {m.role === 'leader' ? 'Representante' : 'Integrante'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Equipos;
