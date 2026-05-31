import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminFilters from '../components/AdminFilters';
import AdminTeamTable from '../components/AdminTeamTable';
import AdminTeamForm from '../components/AdminTeamForm';
import { exportToCsv } from '../utils/csv';
import { X, Trash2, Plus, Pencil, Eye } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { logAdminAction } from '../lib/audit';

const AdminEquipos = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all', category: 'all' });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null); // null, {} for new, or team obj for edit
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: catsData } = await supabase.from('categories').select('id, name, max_members, slug');
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
      const prev = teams.find(t => t.id === teamId);
      const { error } = await supabase
        .from('teams')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', teamId);

      if (error) throw error;

      logAdminAction('team_status_change', 'team', teamId, {
        from: prev?.status,
        to: newStatus,
        team_name: prev?.team_name
      });

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

  const handleSaveTeam = async (teamData, membersData, photo) => {
    try {
      setLoading(true);
      let teamId;
      let photoUrl = teamData.photo_url || null;
      let photoPath = teamData.photo_path || null;
      
      // Determine folio (existing or new)
      let folio = teamData.folio;
      if (!folio) {
        const cat = categories.find(c => c.id === teamData.category_id);
        const slug = cat ? cat.slug : 'PROG';
        const { data: generatedFolio, error: folioError } = await supabase.rpc('generate_folio', {
          category_slug: slug
        });
        if (folioError) throw folioError;
        folio = generatedFolio;
      }

      // Upload photo if provided
      if (photo) {
         const fileExt = photo.name.split('.').pop();
         const fileName = `team-photo.${fileExt}`;
         const filePath = `${folio}/${fileName}`;

         const { error: uploadError, data: uploadData } = await supabase.storage
            .from('team-photos')
            .upload(filePath, photo, { upsert: true });

         if (uploadError) throw uploadError;
         
         photoPath = uploadData.path;
         const { data: publicUrlData } = supabase.storage
            .from('team-photos')
            .getPublicUrl(filePath);
         
         photoUrl = publicUrlData.publicUrl;
      }
      
      if (editingTeam && editingTeam.id) {
        // Update existing
        teamId = editingTeam.id;
        const { error: teamError } = await supabase
          .from('teams')
          .update({
            team_name: teamData.team_name,
            category_id: teamData.category_id,
            campus: teamData.campus,
            institution: teamData.institution,
            leader_name: teamData.leader_name,
            leader_email: teamData.leader_email,
            leader_phone: teamData.leader_phone,
            leader_student_id: teamData.leader_student_id,
            status: teamData.status,
            photo_url: photoUrl,
            photo_path: photoPath,
            updated_at: new Date().toISOString()
          })
          .eq('id', teamId);

        if (teamError) throw teamError;

        // Sincronizar registro del lider en team_members
        const { error: leaderUpdateError } = await supabase
          .from('team_members')
          .update({
            full_name: teamData.leader_name,
            email: teamData.leader_email,
            student_id: teamData.leader_student_id
          })
          .eq('team_id', teamId)
          .eq('role', 'leader');

        if (leaderUpdateError) throw leaderUpdateError;

        // Delete old members
        const { error: delError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('role', 'member');

        if (delError) throw delError;

      } else {
        // Insert new
        const { data: newTeam, error: teamError } = await supabase
          .from('teams')
          .insert([{
             ...teamData,
             folio,
             photo_url: photoUrl,
             photo_path: photoPath,
             accepted_terms: true
          }])
          .select()
          .single();
          
        if (teamError) throw teamError;
        teamId = newTeam.id;
        
        // Insert leader as member
        const { error: leaderError } = await supabase
          .from('team_members')
          .insert([{
             team_id: teamId,
             full_name: teamData.leader_name,
             email: teamData.leader_email,
             student_id: teamData.leader_student_id,
             role: 'leader'
          }]);
        if (leaderError) throw leaderError;
      }

      // Insert new members
      if (membersData.length > 0) {
        const membersToInsert = membersData
          .filter(m => m.full_name && m.student_id)
          .map(m => ({
            team_id: teamId,
            full_name: m.full_name,
            email: m.email || null,
            student_id: m.student_id,
            role: 'member'
          }));
          
        if (membersToInsert.length > 0) {
           const { error: memError } = await supabase
             .from('team_members')
             .insert(membersToInsert);
           if (memError) throw memError;
        }
      }

      logAdminAction(
        editingTeam && editingTeam.id ? 'team_update' : 'team_create',
        'team',
        teamId,
        { folio, team_name: teamData.team_name }
      );

      setEditingTeam(null);
      fetchData(); // reload all data
    } catch (err) {
      console.error('Error saving team:', err);
      if (err.code === '23505') {
         alert('Error: Ya existe un registro con este correo o matrícula.');
      } else if (err.code === '42501' || /row-level security/i.test(err.message || '')) {
         alert('Error de permisos (RLS). Asegurate de tener corrida la migracion 009_admin_insert_policies.sql en Supabase.');
      } else {
         alert(`Error al guardar el equipo: ${err.message || 'desconocido'}`);
      }
    } finally {
      setLoading(false);
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

      teamsToDelete.forEach(t => {
        logAdminAction('team_delete', 'team', t.id, { folio: t.folio, team_name: t.team_name });
      });

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
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Inscripciones
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Equipos</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Revisa, filtra y cambia el estado de las inscripciones.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedTeamIds.length > 0 && (
            <button
              onClick={() => {
                const teamsToDelete = teams.filter(t => selectedTeamIds.includes(t.id));
                handleDeleteTeams(teamsToDelete);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-red-500/20 hover:shadow-md hover:shadow-red-500/30 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar {selectedTeamIds.length}
            </button>
          )}
          <button
            onClick={() => setEditingTeam({})}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo Equipo
          </button>
        </div>
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
           onEditTeam={setEditingTeam}
           onChangeStatus={handleChangeStatus}
           selectedTeamIds={selectedTeamIds}
           onToggleSelect={handleToggleSelect}
           onToggleSelectAll={handleToggleSelectAll}
           onDeleteTeam={(team) => handleDeleteTeams([team])}
         />
      )}

      {/* Modal Crear/Editar Equipo */}
      {editingTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/60">
            <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${editingTeam.id ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  {editingTeam.id ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingTeam.id ? 'Editar Equipo' : 'Nuevo Equipo'}
                </h2>
              </div>
              <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
               <AdminTeamForm 
                 team={editingTeam.id ? editingTeam : null} 
                 categories={categories} 
                 onSubmit={handleSaveTeam} 
                 onCancel={() => setEditingTeam(null)}
                 loading={loading}
               />
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalles */}
      {selectedTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200/60">
            <div className="px-6 py-4 border-b border-slate-200/80 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  Detalle del Equipo
                  <StatusBadge status={selectedTeam.status} />
                </h2>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors">
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
