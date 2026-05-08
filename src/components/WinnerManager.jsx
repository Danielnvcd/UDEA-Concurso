import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Save, Trash2 } from 'lucide-react';

const WinnerManager = ({ categoryId }) => {
  const [acceptedTeams, setAcceptedTeams] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch accepted teams for this category
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, team_name, folio')
          .eq('category_id', categoryId)
          .eq('status', 'accepted');
          
        if (teamsError) throw teamsError;
        setAcceptedTeams(teamsData || []);

        // Fetch existing winners for this category
        const { data: winnersData, error: winnersError } = await supabase
          .from('winners')
          .select('*')
          .eq('category_id', categoryId);
          
        if (winnersError) throw winnersError;
        setWinners(winnersData || []);
      } catch (err) {
        console.error('Error fetching winners data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleWinnerChange = (place, field, value) => {
    setWinners(prev => {
      const newWinners = [...prev];
      const existingIdx = newWinners.findIndex(w => w.place === place);
      
      if (existingIdx >= 0) {
        if (field === 'team_id' && !value) {
            // Remove winner if team is deselected
            newWinners.splice(existingIdx, 1);
        } else {
            newWinners[existingIdx] = { ...newWinners[existingIdx], [field]: value };
        }
      } else if (value) {
        // Only add if we actually selected a team
        newWinners.push({
          place,
          category_id: categoryId,
          team_id: field === 'team_id' ? value : null,
          prize: field === 'prize' ? value : '',
          is_published: false
        });
      }
      return newWinners;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Basic validation: ensure no duplicate teams in different places
      const selectedTeamIds = winners.map(w => w.team_id).filter(id => id);
      const uniqueTeams = new Set(selectedTeamIds);
      if (selectedTeamIds.length !== uniqueTeams.size) {
          alert('Error: Un mismo equipo no puede ocupar múltiples lugares.');
          setSaving(false);
          return;
      }

      // First, get current winners to handle deletions
      const { data: currentWinners } = await supabase.from('winners').select('id').eq('category_id', categoryId);
      const currentIds = currentWinners?.map(w => w.id) || [];
      
      // Delete old winners
      if (currentIds.length > 0) {
        await supabase.from('winners').delete().in('id', currentIds);
      }

      // Insert new winners
      const toInsert = winners.filter(w => w.team_id).map(w => {
          const { id, ...rest } = w; // Remove local id if exists
          return rest;
      });

      if (toInsert.length > 0) {
        const { error } = await supabase.from('winners').insert(toInsert);
        if (error) throw error;
      }
      
      alert('Ganadores guardados exitosamente.');
    } catch (err) {
      console.error('Error saving winners:', err);
      alert('Error al guardar ganadores.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (place, isPublished) => {
      const winner = winners.find(w => w.place === place);
      if (!winner || !winner.id) {
          alert('Primero debes guardar el ganador antes de publicarlo.');
          return;
      }
      try {
          const { error } = await supabase.from('winners').update({ is_published: isPublished }).eq('id', winner.id);
          if (error) throw error;
          
          setWinners(prev => prev.map(w => w.place === place ? { ...w, is_published: isPublished } : w));
      } catch(err) {
          console.error(err);
          alert('Error al actualizar estado de publicación.');
      }
  };

  if (!categoryId) return null;

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando datos...</div>;
  }

  const places = [
    { num: 1, label: 'Primer Lugar', icon: <Trophy className="h-5 w-5 text-amber-500" /> },
    { num: 2, label: 'Segundo Lugar', icon: <Trophy className="h-5 w-5 text-slate-400" /> },
    { num: 3, label: 'Tercer Lugar', icon: <Trophy className="h-5 w-5 text-amber-700" /> },
    { num: 0, label: 'Mención Especial', icon: <Trophy className="h-5 w-5 text-blue-500" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Asignar Ganadores</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="space-y-6">
        {places.map(place => {
          const currentWinner = winners.find(w => w.place === place.num) || {};
          return (
            <div key={place.num} className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex flex-col md:flex-row gap-4 md:items-start">
              <div className="flex items-center w-48 shrink-0">
                {place.icon}
                <span className="ml-2 font-bold text-slate-700">{place.label}</span>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Equipo Seleccionado</label>
                  <select
                    value={currentWinner.team_id || ''}
                    onChange={(e) => handleWinnerChange(place.num, 'team_id', e.target.value)}
                    className="w-full border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Sin asignar --</option>
                    {acceptedTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.folio} - {t.team_name}</option>
                    ))}
                  </select>
                </div>
                
                {currentWinner.team_id && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Premio (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Trofeo y $5,000 MXN"
                      value={currentWinner.prize || ''}
                      onChange={(e) => handleWinnerChange(place.num, 'prize', e.target.value)}
                      className="w-full border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {currentWinner.id && (
                 <div className="flex items-end justify-end md:ml-4 mt-2 md:mt-0 h-full">
                     <label className="flex items-center space-x-2 cursor-pointer">
                         <input 
                            type="checkbox" 
                            checked={currentWinner.is_published}
                            onChange={(e) => togglePublish(place.num, e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500" 
                         />
                         <span className="text-sm font-medium text-slate-700">{currentWinner.is_published ? 'Público' : 'Oculto'}</span>
                     </label>
                 </div>
              )}
            </div>
          );
        })}
      </div>
      
      {acceptedTeams.length === 0 && (
         <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
             No hay equipos aceptados en esta categoría todavía. Debes aceptar equipos primero en la sección de Equipos.
         </div>
      )}
    </div>
  );
};

export default WinnerManager;
