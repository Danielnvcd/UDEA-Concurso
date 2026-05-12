import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, AlertCircle, Calendar, Settings2 } from 'lucide-react';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [config, setConfig] = useState({
    event_date: '',
    status: 'open'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'event_config')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error initially
      
      if (data && data.value) {
        // Format date for datetime-local input (YYYY-MM-DDThh:mm)
        const dateObj = new Date(data.value.event_date);
        const formattedDate = !isNaN(dateObj) 
          ? new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
          : '';
          
        setConfig({
          event_date: formattedDate,
          status: data.value.status || 'open'
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Error al cargar la configuración actual.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Ensure date is valid ISO string
      const isoDate = config.event_date ? new Date(config.event_date).toISOString() : null;

      const payload = {
        event_date: isoDate,
        status: config.status
      };

      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'event_config', 
          value: payload,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' });
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Ocurrió un error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Sistema
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Configuración de la Plataforma
          <Settings2 className="w-7 h-7 text-blue-600" />
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">Modifica los parámetros generales del concurso.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {message.text && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Fecha y Hora del Evento
              </label>
              <input
                type="datetime-local"
                required
                value={config.event_date}
                onChange={(e) => setConfig({ ...config, event_date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">Esta fecha se utilizará en el contador de la página principal.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Estado de Inscripciones</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`relative flex cursor-pointer rounded-lg border p-4 text-center transition-all ${config.status === 'coming_soon' ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="status" value="coming_soon" className="sr-only" checked={config.status === 'coming_soon'} onChange={(e) => setConfig({ ...config, status: e.target.value })} />
                  <span className={`block w-full text-sm font-bold ${config.status === 'coming_soon' ? 'text-yellow-800' : 'text-slate-600'}`}>Próximamente</span>
                </label>
                <label className={`relative flex cursor-pointer rounded-lg border p-4 text-center transition-all ${config.status === 'open' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="status" value="open" className="sr-only" checked={config.status === 'open'} onChange={(e) => setConfig({ ...config, status: e.target.value })} />
                  <span className={`block w-full text-sm font-bold ${config.status === 'open' ? 'text-green-800' : 'text-slate-600'}`}>Abiertas</span>
                </label>
                <label className={`relative flex cursor-pointer rounded-lg border p-4 text-center transition-all ${config.status === 'closed' ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="status" value="closed" className="sr-only" checked={config.status === 'closed'} onChange={(e) => setConfig({ ...config, status: e.target.value })} />
                  <span className={`block w-full text-sm font-bold ${config.status === 'closed' ? 'text-red-800' : 'text-slate-600'}`}>Cerradas</span>
                </label>
              </div>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                <strong>Próximamente:</strong> Oculta el formulario de inscripción y muestra un aviso en la página principal.<br/>
                <strong>Abiertas:</strong> Permite que los equipos se registren normalmente.<br/>
                <strong>Cerradas:</strong> Bloquea el formulario indicando que el periodo ha finalizado.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-sm py-2.5 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
