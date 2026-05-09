import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminFilters from '../components/AdminFilters';
import AdminTeamTable from '../components/AdminTeamTable';
import { exportToCsv } from '../utils/csv';
import { X, Trash2 } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const AdminEquipos = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all', category: 'all' });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: catsData } = await supabase.from('categories').select('id, name');
      if (catsData) setCategories(catsData);

      // Fetch teams
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`
          *,
          categories(name),
          team_members(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeams(teamsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleChangeStatus = async (teamId, newStatus) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', teamId);
      
      if (error) throw error;
      
      // Update local state
      setTeams(teams.map(t => t.id === teamId ? { ...t, status: newStatus } : t));
      
      // Also update selectedTeam if open
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam({ ...selectedTeam, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error al actualizar el estado.');
    }
  };

  const handleExport = () => {
    const dataToExport = filteredTeams.map(t => ({
      Folio: t.folio,
      Equipo: t.team_name,
      Categoria: t.categories?.name,
      Estado: t.status,
      Sede: t.campus,
      Institucion: t.institution,
      Lider: t.leader_name,
      CorreoLider: t.leader_email,
      TelefonoLider: t.leader_phone,
      MatriculaLider: t.leader_student_id,
      FechaRegistro: new Date(t.created_at).toLocaleString(),
      Integrantes: t.team_members?.map(m => m.full_name).join(' | ')
    }));
    exportToCsv('equipos_udea.csv', dataToExport);
  };

  const handleToggleSelect = (teamId) => {
    setSelectedTeamIds(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedTeamIds.length === filteredTeams.length && filteredTeams.length > 0) {
      setSelectedTeamIds([]);
    } else {
      setSelectedTeamIds(filteredTeams.map(t => t.id));
    }
  };

  const deleteTeamPhoto = async (photoUrl) => {
    if (!photoUrl) return;
    try {
      const urlParts = photoUrl.split('/team-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error } = await supabase.storage.from('team-photos').remove([filePath]);
        if (error) console.error('Error deleting photo:', error);
      }
    } catch (e) {
      console.error('Failed to parse and delete photo:', e);
    }
  };

  const handleDeleteTeams = async (teamsToDelete) => {
    const isMultiple = teamsToDelete.length > 1;
    const confirmMessage = isMultiple 
      ? `¿Estás seguro de que deseas eliminar ${teamsToDelete.length} equipos? Esta acción y sus fotos asociadas se borrarán permanentemente.`
      : `¿Estás seguro de que deseas eliminar al equipo "${teamsToDelete[0].team_name}"? Esta acción y su foto asociada se borrarán permanentemente.`;
      
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const idsToDelete = teamsToDelete.map(t => t.id);

      // 1. Delete photos from storage first
      for (const team of teamsToDelete) {
        if (team.photo_url) {
          await deleteTeamPhoto(team.photo_url);
        }
      }

      // 2. Delete from database
      const { error } = await supabase
        .from('teams')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      // 3. Update local state
      setTeams(prev => prev.filter(t => !idsToDelete.includes(t.id)));
      setSelectedTeamIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      
      // Close modal if deleted team was being viewed
      if (selectedTeam && idsToDelete.includes(selectedTeam.id)) {
        setSelectedTeam(null);
      }
    } catch (err) {
      console.error('Error deleting teams:', err);
      alert('Error al eliminar los equipos. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchStatus = filters.status === 'all' || team.status === filters.status;
    const matchCat = filters.category === 'all' || team.category_id === filters.category;
    const s = filters.search.toLowerCase();
    const matchSearch = !s || 
      team.team_name.toLowerCase().includes(s) || 
      team.folio.toLowerCase().includes(s) || 
      team.leader_name.toLowerCase().includes(s) || 
      team.leader_email.toLowerCase().includes(s);
    
    return matchStatus && matchCat && matchSearch;
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Equipos</h1>
          <p className="text-slate-500">Revisa, filtra y cambia el estado de las inscripciones.</p>
        </div>
        {selectedTeamIds.length > 0 && (
          <button 
            onClick={() => {
              const teamsToDelete = teams.filter(t => selectedTeamIds.includes(t.id));
              handleDeleteTeams(teamsToDelete);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar {selectedTeamIds.length} seleccionado(s)
          </button>
        )}
      </div>

      <AdminFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        categories={categories}
        onExport={handleExport}
      />

      {loading ? (
         <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
         <AdminTeamTable 
           teams={filteredTeams} 
           onViewDetails={setSelectedTeam} 
           onChangeStatus={handleChangeStatus}
           selectedTeamIds={selectedTeamIds}
           onToggleSelect={handleToggleSelect}
           onToggleSelectAll={handleToggleSelectAll}
           onDeleteTeam={(team) => handleDeleteTeams([team])}
         />
      )}

      {/* Modal Detalles */}
      {selectedTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                Detalle del Equipo
                <StatusBadge status={selectedTeam.status} />
              </h2>
              <button onClick={() => setSelectedTeam(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Info General</h3>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm border border-slate-100">
                      <p><span className="font-medium text-slate-700">Folio:</span> {selectedTeam.folio}</p>
                      <p><span className="font-medium text-slate-700">Equipo:</span> {selectedTeam.team_name}</p>
                      <p><span className="font-medium text-slate-700">Categoría:</span> {selectedTeam.categories?.name}</p>
                      <p><span className="font-medium text-slate-700">Sede:</span> {selectedTeam.campus}</p>
                      <p><span className="font-medium text-slate-700">Institución:</span> {selectedTeam.institution}</p>
                      <p><span className="font-medium text-slate-700">Registro:</span> {new Date(selectedTeam.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Líder del Equipo</h3>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm border border-blue-100">
                      <p><span className="font-medium text-blue-900">Nombre:</span> {selectedTeam.leader_name}</p>
                      <p><span className="font-medium text-blue-900">Correo:</span> <a href={`mailto:${selectedTeam.leader_email}`} className="text-blue-600 hover:underline">{selectedTeam.leader_email}</a></p>
                      <p><span className="font-medium text-blue-900">Teléfono:</span> {selectedTeam.leader_phone || 'N/A'}</p>
                      <p><span className="font-medium text-blue-900">Matrícula:</span> {selectedTeam.leader_student_id}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Integrantes ({selectedTeam.team_members?.length || 0})</h3>
                    <div className="space-y-2">
                      {selectedTeam.team_members?.map(m => (
                        <div key={m.id} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-800">{m.full_name} {m.role === 'leader' && <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1">Líder</span>}</p>
                            <p className="text-slate-500 text-xs">{m.email} | ID: {m.student_id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Foto del Equipo</h3>
                  {selectedTeam.photo_url ? (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                      <img src={selectedTeam.photo_url} alt="Team" className="w-full h-64 object-contain bg-black/5" />
                      <a href={selectedTeam.photo_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
                        Abrir Imagen Original
                      </a>
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 bg-slate-50">
                      Sin foto adjunta
                    </div>
                  )}

                  <div className="mt-8">
                     <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Acciones Rápidas</h3>
                     <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleChangeStatus(selectedTeam.id, 'accepted')} className={`py-2 rounded-lg font-medium text-sm border transition-colors ${selectedTeam.status === 'accepted' ? 'bg-green-100 border-green-300 text-green-800 ring-2 ring-green-500 ring-offset-1' : 'bg-white border-green-200 text-green-700 hover:bg-green-50'}`}>Aceptar</button>
                        <button onClick={() => handleChangeStatus(selectedTeam.id, 'rejected')} className={`py-2 rounded-lg font-medium text-sm border transition-colors ${selectedTeam.status === 'rejected' ? 'bg-red-100 border-red-300 text-red-800 ring-2 ring-red-500 ring-offset-1' : 'bg-white border-red-200 text-red-700 hover:bg-red-50'}`}>Rechazar</button>
                        <button onClick={() => handleChangeStatus(selectedTeam.id, 'waitlist')} className={`py-2 rounded-lg font-medium text-sm border transition-colors ${selectedTeam.status === 'waitlist' ? 'bg-purple-100 border-purple-300 text-purple-800 ring-2 ring-purple-500 ring-offset-1' : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50'}`}>Lista Espera</button>
                        <button onClick={() => handleChangeStatus(selectedTeam.id, 'pending')} className={`py-2 rounded-lg font-medium text-sm border transition-colors ${selectedTeam.status === 'pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 ring-2 ring-yellow-500 ring-offset-1' : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50'}`}>Marcar Pendiente</button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEquipos;
