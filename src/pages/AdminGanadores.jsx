import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, ChevronDown } from 'lucide-react';
import WinnerManager from '../components/WinnerManager';

const AdminGanadores = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id, name').order('name');
        if (error) throw error;
        setCategories(data || []);
        if (data && data.length > 0) {
            setSelectedCategory(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
     return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Reconocimientos
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Gestión de Ganadores
          <Trophy className="w-7 h-7 text-amber-500" />
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">Selecciona los equipos ganadores por categoría y decide si publicarlos.</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
        <label className="block text-sm font-semibold text-slate-700 mb-2.5">Seleccionar Categoría</label>
        <div className="relative w-full md:w-2/3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 font-medium shadow-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer transition-all"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <WinnerManager categoryId={selectedCategory} />
    </div>
  );
};

export default AdminGanadores;
