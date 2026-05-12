import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Save, ChevronDown, Eye, EyeOff, Medal, Award, Star } from 'lucide-react';

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
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, team_name, folio')
          .eq('category_id', categoryId)
          .eq('status', 'accepted');

        if (teamsError) throw teamsError;
        setAcceptedTeams(teamsData || []);

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
            newWinners.splice(existingIdx, 1);
        } else {
            newWinners[existingIdx] = { ...newWinners[existingIdx], [field]: value };
        }
      } else if (value) {
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
      const selectedTeamIds = winners.map(w => w.team_id).filter(id => id);
      const uniqueTeams = new Set(selectedTeamIds);
      if (selectedTeamIds.length !== uniqueTeams.size) {
          alert('Error: Un mismo equipo no puede ocupar múltiples lugares.');
          setSaving(false);
          return;
      }

      const { data: currentWinners } = await supabase.from('winners').select('id').eq('category_id', categoryId);
      const currentIds = currentWinners?.map(w => w.id) || [];

      if (currentIds.length > 0) {
        await supabase.from('winners').delete().in('id', currentIds);
      }

      const toInsert = winners.filter(w => w.team_id).map(w => {
          const { id, ...rest } = w;
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
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-sm text-slate-500">Cargando datos...</p>
      </div>
    );
  }

  const places = [
    { num: 1, label: 'Primer Lugar', icon: Trophy, accent: 'amber', gradient: 'from-amber-400 to-yellow-500' },
    { num: 2, label: 'Segundo Lugar', icon: Medal, accent: 'slate', gradient: 'from-slate-300 to-slate-400' },
    { num: 3, label: 'Tercer Lugar', icon: Award, accent: 'orange', gradient: 'from-orange-400 to-amber-600' },
    { num: 0, label: 'Mención Especial', icon: Star, accent: 'blue', gradient: 'from-blue-400 to-sky-500' },
  ];

  const accentClasses = {
    amber: { iconBg: 'bg-amber-100', iconColor: 'text-amber-600', ring: 'ring-amber-200' },
    slate: { iconBg: 'bg-slate-200', iconColor: 'text-slate-600', ring: 'ring-slate-300' },
    orange: { iconBg: 'bg-orange-100', iconColor: 'text-orange-600', ring: 'ring-orange-200' },
    blue: { iconBg: 'bg-blue-100', iconColor: 'text-blue-600', ring: 'ring-blue-200' },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-lg font-bold text-slate-900">Asignar Ganadores</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 disabled:opacity-50 transition-all"
        >
          <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="p-5 space-y-4">
        {places.map(place => {
          const currentWinner = winners.find(w => w.place === place.num) || {};
          const Icon = place.icon;
          const accent = accentClasses[place.accent];
          const hasTeam = !!currentWinner.team_id;
          return (
            <div
              key={place.num}
              className={`relative bg-white rounded-xl border ${hasTeam ? 'border-slate-200 shadow-sm' : 'border-slate-200/70 border-dashed'} p-5 transition-all hover:border-slate-300`}
            >
              <div className={`absolute left-0 top-5 bottom-5 w-1 bg-gradient-to-b ${place.gradient} rounded-r ${hasTeam ? 'opacity-100' : 'opacity-30'}`} />
              <div className="flex flex-col md:flex-row gap-4 md:items-start pl-3">
                <div className="flex items-center gap-3 w-full md:w-52 shrink-0">
                  <div className={`w-11 h-11 rounded-xl ${accent.iconBg} ring-4 ${accent.ring} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${accent.iconColor}`} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{place.label}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                      {place.num === 0 ? 'Especial' : `${place.num}° lugar`}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Equipo Seleccionado</label>
                    <div className="relative">
                      <select
                        value={currentWinner.team_id || ''}
                        onChange={(e) => handleWinnerChange(place.num, 'team_id', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-all"
                      >
                        <option value="">-- Sin asignar --</option>
                        {acceptedTeams.map(t => (
                          <option key={t.id} value={t.id}>{t.folio} - {t.team_name}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {hasTeam && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Premio (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ej. Trofeo y $5,000 MXN"
                        value={currentWinner.prize || ''}
                        onChange={(e) => handleWinnerChange(place.num, 'prize', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  )}
                </div>

                {currentWinner.id && (
                  <div className="flex items-center md:items-start">
                    <button
                      type="button"
                      onClick={() => togglePublish(place.num, !currentWinner.is_published)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        currentWinner.is_published
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {currentWinner.is_published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {currentWinner.is_published ? 'Público' : 'Oculto'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {acceptedTeams.length === 0 && (
        <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Trophy className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="font-bold">Sin equipos aceptados</p>
            <p className="text-amber-700/90 mt-0.5">No hay equipos aceptados en esta categoría todavía. Debes aceptar equipos primero en la sección de Equipos.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerManager;
