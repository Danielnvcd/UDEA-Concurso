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

   // Lock body scroll when modal is open
   useEffect(() => {
      if (selectedTeam) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
      return () => {
         document.body.style.overflow = 'unset';
      };
   }, [selectedTeam]);

   const filteredTeams = teams.filter(team => {
      // Only show teams from the current year
      const currentYear = new Date().getFullYear();
      const isCurrentYear = team.created_at
         ? new Date(team.created_at).getFullYear() === currentYear
         : team.folio.includes(currentYear.toString());

      if (!isCurrentYear) return false;

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
      <div className="pt-24 pb-20 min-h-screen bg-[#070b0a] selection:bg-blue-900 selection:text-white relative overflow-hidden">

         {/* Clean Background */}
         <div className="absolute top-0 inset-x-0 h-64 bg-white/5 pointer-events-none border-b border-white/10"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header Section */}
            <div className="text-center mb-16">
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Participantes Oficiales</span>
               </motion.div>
               <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}
               >
                  Equipos
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-slate-400 max-w-2xl mx-auto font-medium" style={{ fontFamily: 'Inter, sans-serif' }}
               >
                  Los equipos participantes en el concurso.
               </motion.p>
            </div>

            {/* Clean Filter Bar */}
            <div className="mb-12 flex flex-col items-center gap-6 relative z-10">
               {/* Search Input */}
               <div className="relative w-full max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                     type="text"
                     placeholder="Buscar por equipo o folio..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                  />
               </div>

               {/* Category Filters */}
               <div className="w-full flex flex-wrap justify-center items-center gap-2 px-2">
                  <button
                     onClick={() => setFilterCat('all')}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${filterCat === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                  >
                     Todos
                  </button>

                  {categories.map(cat => (
                     <button
                        key={cat.id}
                        onClick={() => setFilterCat(cat.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${filterCat === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                     >
                        {cat.name}
                     </button>
                  ))}
               </div>
            </div>

            {/* Grid Container */}
            {loading ? (
               <div className="flex justify-center items-center py-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
               </div>
            ) : (
               <>
                  {filteredTeams.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTeams.map((team, idx) => (
                           <motion.div
                              key={team.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05, duration: 0.3 }}
                              onClick={() => setSelectedTeam(team)}
                              className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-white/10 hover:border-white/20 hover:shadow-md hover:bg-white/10 transition-all cursor-pointer flex flex-col h-full"
                           >
                              {/* Image Section */}
                              <div className="h-40 bg-[#070b0a]/50 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-white/5">
                                 {team.photo_url ? (
                                    <img
                                       src={team.photo_url}
                                       alt={team.team_name}
                                       className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                 ) : (
                                    <Users className="h-12 w-12 text-white/20" />
                                 )}

                                 {/* Floating Tags */}
                                 <div className="absolute top-3 right-3 z-20">
                                    <span className="bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm border border-white/10">
                                       {team.folio}
                                    </span>
                                 </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-5 flex flex-col flex-1 relative bg-transparent">
                                 <div className="inline-block px-2.5 py-1 bg-white/10 text-slate-300 rounded text-[11px] font-semibold uppercase tracking-wider w-fit mb-3">
                                    {team.category_name}
                                 </div>

                                 <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                    {team.team_name}
                                 </h3>

                                 <div className="mt-auto space-y-2">
                                    <div className="flex items-center text-slate-400 text-sm">
                                       <Building className="h-4 w-4 mr-2 text-white/40 shrink-0" />
                                       <span className="truncate">{team.institution}</span>
                                    </div>
                                    <div className="flex items-center text-slate-400 text-sm">
                                       <MapPin className="h-4 w-4 mr-2 text-white/40 shrink-0" />
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
                     >
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Search className="h-8 w-8 text-white/30" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No se encontraron equipos</h3>
                        <p className="text-slate-400">No hay resultados para tu búsqueda o filtro actual.</p>
                        <button onClick={() => { setSearch(''); setFilterCat('all'); }} className="mt-6 text-blue-400 font-bold text-sm hover:underline">Limpiar Filtros</button>
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
                     initial={{ opacity: 0, scale: 0.95, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 10 }}
                     transition={{ duration: 0.2 }}
                     className="bg-[#0f1715] rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col border border-white/10"
                  >
                     <div className="absolute top-4 right-4 z-30">
                        <button onClick={() => setSelectedTeam(null)} className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors border border-white/10">
                           <X className="h-5 w-5" />
                        </button>
                     </div>

                     {selectedTeam.photo_url ? (
                        <div className="w-full h-56 sm:h-72 bg-[#0a0f0d] shrink-0 relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-[#070b0a]/40 to-transparent z-10"></div>
                           <img src={selectedTeam.photo_url} alt="Team" className="w-full h-full object-cover opacity-80" />
                           <div className="absolute bottom-6 left-6 z-20">
                              <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
                                 {selectedTeam.category_name}
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedTeam.team_name}</h2>
                           </div>
                        </div>
                     ) : (
                        <div className="w-full h-40 bg-[#0a0f0d] shrink-0 flex items-end p-6 relative border-b border-white/10">
                           <div className="relative z-10">
                              <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
                                 {selectedTeam.category_name}
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedTeam.team_name}</h2>
                           </div>
                        </div>
                     )}

                     <div className="p-6 sm:p-8 overflow-y-auto bg-[#070b0a]">
                        <div className="bg-white/5 rounded-2xl p-6 shadow-sm border border-white/10 mb-6">
                           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                              Detalles de la Institución
                           </h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex items-start">
                                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 shrink-0 border border-white/10">
                                    <Building className="h-5 w-5 text-white/50" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Institución</p>
                                    <p className="text-white font-bold text-sm">{selectedTeam.institution}</p>
                                 </div>
                              </div>
                              <div className="flex items-start">
                                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 shrink-0 border border-white/10">
                                    <MapPin className="h-5 w-5 text-white/50" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sede</p>
                                    <p className="text-white font-bold text-sm">{selectedTeam.campus}</p>
                                 </div>
                              </div>
                              {(selectedTeam.career || selectedTeam.semester) && (
                                 <div className="flex items-start sm:col-span-2">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4 shrink-0 border border-white/10">
                                       <BookOpen className="h-5 w-5 text-white/50" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Carrera y Semestre</p>
                                       <p className="text-white font-bold text-sm">{selectedTeam.career || 'No especificada'} {selectedTeam.semester ? `• Semestre ${selectedTeam.semester}` : ''}</p>
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
                                 <div key={idx} className="bg-white/5 border border-white/10 shadow-sm rounded-xl p-4 flex items-center gap-4 transition-all hover:border-white/20 hover:bg-white/10">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner ${m.role === 'leader' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-white/10 text-slate-300'}`}>
                                       {m.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="text-sm font-extrabold text-white">{m.name}</p>
                                       <p className={`text-xs font-bold mt-0.5 ${m.role === 'leader' ? 'text-blue-400' : 'text-slate-500'}`}>
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
