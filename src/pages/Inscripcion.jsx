import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RegistrationForm from '../components/RegistrationForm';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inscripcion = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: availabilityData, error: availError } = await supabase.rpc('get_category_availability');
        if (availError) throw availError;

        const { data: catData, error: catError } = await supabase.from('categories').select('id, max_members');
        if (catError) throw catError;

        // Merge max_members into the availability data
        const mergedData = availabilityData?.map(avail => {
           const matchingCat = catData?.find(c => c.id === avail.category_id);
           return {
              ...avail,
              max_members: matchingCat ? matchingCat.max_members : 1
           };
        });

        setCategories(mergedData || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Tu inscripción fue recibida!</h2>
          <p className="text-slate-500 mb-6">
            Hemos registrado a tu equipo exitosamente. Un organizador revisará tu registro a la brevedad.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-xl text-left mb-6 border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Folio de Registro</p>
            <p className="text-lg font-mono font-bold text-slate-800 mb-3">{successData.folio}</p>
            
            <p className="text-sm text-slate-500 mb-1">Equipo</p>
            <p className="font-semibold text-slate-800 mb-3">{successData.team_name}</p>
            
            <p className="text-sm text-slate-500 mb-1">Estado</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pendiente de confirmación
            </span>
          </div>

          <Link
            to="/"
            className="inline-block w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 relative overflow-hidden selection:bg-blue-900 selection:text-white">
      {/* Premium Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
             <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 bg-blue-100/50 px-4 py-1.5 rounded-full border border-blue-200/50">
                Paso 1 de 1
             </span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Inscripción de Equipos
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Registra a tu equipo en el Concurso Tecnológico UDEA 2026. 
            El registro será evaluado por el comité organizador para su aprobación final.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {categories.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <p className="text-slate-500">No hay categorías disponibles en este momento.</p>
            </div>
          ) : (
            <RegistrationForm 
              categories={categories} 
              onSuccess={(data) => setSuccessData(data)} 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Inscripcion;
