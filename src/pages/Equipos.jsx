import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, Search, GraduationCap, Building, BookOpen, X, ChevronRight, Trophy } from 'lucide-react';

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

  const filteredTeams = teams.filter(team => {
    const matchSearch = team.team_name.toLowerCase().includes(search.toLowerCase()) || team.folio.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || team.category_id === filterCat; // Note: RPC doesn't return category_id currently, but wait!
    // RPC returns category_name, so we need to filter by name or modify filter logic.
    // Let's filter by name if filterCat !== 'all'
    if (filterCat !== 'all') {
       const catObj = categories.find(c => c.id === filterCat);
       return matchSearch && catObj && team.category_name === catObj.name;
    }
    return matchSearch;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50 selection:bg-blue-900 selection:text-white relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-200/50 via-slate-50 to-slate-50 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 block">Participantes Oficiales</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight"
          >
            Equipos Clasificados
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Descubre a los innovadores y desarrolladores que competirán por la excelencia en el Concurso Tecnológico UDEA.
          </motion.p>
        </div>

        {/* Premium Glassmorphic Filter Bar - Stacked & Wrapped Layout */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3, duration: 0.6 }}
           className="mb-16 flex flex-col items-center gap-6 relative z-10"
        >
           {/* Search Input */}
           <div className="relative w-full max-w-2xl group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input 
                 type="text" 
                 placeholder="Buscar por equipo o folio..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="block w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-200/60 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 focus:bg-white transition-all text-base font-medium outline-none"
              />
           </div>
           
           {/* Animated Segmented Controls (Wrapped Pills) */}
           <div className="w-full flex flex-wrap justify-center items-center gap-3 px-2">
              <button 
                 onClick={() => setFilterCat('all')}
                 className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none border ${filterCat === 'all' ? 'border-transparent text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'}`}
              >
                 {filterCat === 'all' && (
                    <motion.div layoutId="activeFilterBg" className="absolute inset-0 bg-slate-900 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                 )}
                 <span className="relative z-10">Todos</span>
              </button>
              
              {categories.map(cat => (
                 <button 
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none border ${filterCat === cat.id ? 'border-transparent text-white shadow-lg shadow-blue-600/30' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'}`}
                 >
                    {filterCat === cat.id && (
                       <motion.div layoutId="activeFilterBg" className="absolute inset-0 bg-blue-600 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className="relative z-10">{cat.name}</span>
                 </button>
              ))}
           </div>
        </motion.div>

        {/* Grid Container */}
        {loading ? (
           <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
           </div>
        ) : (
           <>
              {filteredTeams.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTeams.map((team, idx) => (
                       <motion.div
                          key={team.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 + 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          onClick={() => setSelectedTeam(team)}
                          className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer flex flex-col h-full border border-slate-100 hover:border-slate-200 hover:-translate-y-1"
                       >
                          {/* Image Section */}
                          <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0">
                             {/* Gradient Overlay for better text readability */}
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                             
                             {team.photo_url ? (
                                <img 
                                   src={team.photo_url} 
                                   alt={team.team_name} 
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                             ) : (
                                <Users className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform duration-700 ease-out" />
                             )}
                             
                             {/* Floating Tags */}
                             <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm border border-white/50">
                                   {team.folio}
                                </span>
                             </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-6 flex flex-col flex-1 relative bg-white z-20">
                             <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold uppercase tracking-wider w-fit mb-3 border border-blue-100/50">
                                {team.category_name}
                             </div>
                             
                             <h3 className="text-2xl font-extrabold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                                {team.team_name}
                             </h3>
                             
                             <div className="mt-auto space-y-3">
                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 shrink-0 border border-slate-100">
                                      <Building className="h-4 w-4 text-slate-400" />
                                   </div>
                                   <span className="truncate">{team.institution}</span>
                                </div>
                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                   <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 shrink-0 border border-slate-100">
                                      <MapPin className="h-4 w-4 text-slate-400" />
                                   </div>
                                   <span className="truncate">{team.campus}</span>
                                </div>
                             </div>

                             <div className="mt-6 flex items-center justify-between text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span>Ver perfil completo</span>
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                   <ChevronRight className="h-4 w-4" />
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
                    className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed max-w-2xl mx-auto"
                 >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron equipos</h3>
                    <p className="text-slate-500">No hay resultados para tu búsqueda o filtro actual.</p>
                    <button onClick={() => {setSearch(''); setFilterCat('all');}} className="mt-6 text-blue-600 font-bold text-sm hover:underline">Limpiar Filtros</button>
                 </motion.div>
              )}
           </>
        )}
      </div>

      {/* Premium Team Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedTeam(null)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: "spring", bounce: 0, duration: 0.5 }}
               className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
            >
              <div className="absolute top-4 right-4 z-30">
                 <button onClick={() => setSelectedTeam(null)} className="h-10 w-10 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-colors shadow-lg">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              {selectedTeam.photo_url ? (
                 <div className="w-full h-64 sm:h-80 bg-slate-900 shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                    <img src={selectedTeam.photo_url} alt="Team" className="w-full h-full object-cover" />
                    <div className="absolute bottom-6 left-6 sm:left-8 z-20">
                       <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg inline-block mb-3">
                          {selectedTeam.category_name}
                       </span>
                       <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">{selectedTeam.team_name}</h2>
                    </div>
                 </div>
              ) : (
                 <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 shrink-0 flex items-end p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] rounded-full bg-white/5 blur-[50px]"></div>
                    <div className="relative z-10">
                       <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg inline-block mb-3">
                          {selectedTeam.category_name}
                       </span>
                       <h2 className="text-3xl sm:text-4xl font-black text-white">{selectedTeam.team_name}</h2>
                    </div>
                 </div>
              )}

              <div className="p-6 sm:p-8 overflow-y-auto bg-slate-50">
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                       Detalles de la Institución
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 shrink-0 border border-slate-100">
                             <Building className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Institución</p>
                             <p className="text-slate-800 font-bold text-sm">{selectedTeam.institution}</p>
                          </div>
                       </div>
                       <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 shrink-0 border border-slate-100">
                             <MapPin className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sede</p>
                             <p className="text-slate-800 font-bold text-sm">{selectedTeam.campus}</p>
                          </div>
                       </div>
                       {(selectedTeam.career || selectedTeam.semester) && (
                          <div className="flex items-start sm:col-span-2">
                             <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 shrink-0 border border-slate-100">
                                <BookOpen className="h-5 w-5 text-slate-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carrera y Semestre</p>
                                <p className="text-slate-800 font-bold text-sm">{selectedTeam.career || 'No especificada'} {selectedTeam.semester ? `• Semestre ${selectedTeam.semester}` : ''}</p>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center pl-2">
                       <GraduationCap className="h-5 w-5 mr-2 text-slate-400" /> Integrantes del Equipo
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {selectedTeam.members?.map((m, idx) => (
                          <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex items-center gap-4 transition-all hover:border-slate-200 hover:shadow-md">
                             <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner ${m.role === 'leader' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {m.name.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                <p className="text-sm font-extrabold text-slate-800">{m.name}</p>
                                <p className={`text-xs font-bold mt-0.5 ${m.role === 'leader' ? 'text-blue-600' : 'text-slate-400'}`}>
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
