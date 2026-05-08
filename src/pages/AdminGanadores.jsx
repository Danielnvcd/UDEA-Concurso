import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Ganadores</h1>
        <p className="text-slate-500">Selecciona los equipos ganadores por categoría y decide si publicarlos.</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Categoría</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/2 rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <WinnerManager categoryId={selectedCategory} />
    </div>
  );
};

export default AdminGanadores;
