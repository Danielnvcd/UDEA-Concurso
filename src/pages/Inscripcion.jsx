import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RegistrationForm from '../components/RegistrationForm';
import { CheckCircle2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inscripcion = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState(null);
  const [platformStatus, setPlatformStatus] = useState('open');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch platform settings
        const { data: settingsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'event_config')
          .single();
          
        if (settingsData?.value?.status) {
          setPlatformStatus(settingsData.value.status);
        }

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
    <div className="min-h-screen pt-24 pb-20 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              Inscripción de Equipos
            </h1>
            <p className="text-slate-600">
              Completa este formulario para registrar a tu equipo en el Concurso Tecnológico UDEA 2026.
            </p>
          </div>
          
          <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Shield className="w-4 h-4" />
            Acceso Admin
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : successData ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Registro Exitoso!</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider font-bold">Folio de Inscripción</p>
                <p className="text-4xl font-black text-blue-600 tracking-tight">{successData.folio}</p>
              </div>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Tu registro ha sido recibido correctamente. El comité organizador revisará tu solicitud y te contactará al correo <span className="font-semibold text-slate-900">{successData.leader_email}</span> para la aprobación final.
              </p>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                Volver al Inicio
              </Link>
            </motion.div>
          ) : platformStatus === 'coming_soon' ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Próximamente</h3>
              <p className="text-slate-500">Las inscripciones aún no están abiertas. Mantente atento a nuestras redes oficiales.</p>
            </div>
          ) : platformStatus === 'closed' ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inscripciones Cerradas</h3>
              <p className="text-slate-500">El periodo de inscripción ha finalizado. Te esperamos en la próxima edición.</p>
            </div>

          ) : categories.length === 0 ? (
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
