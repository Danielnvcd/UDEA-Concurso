import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    waitlist: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.from('teams').select('status');
        if (error) throw error;

        const newStats = {
          total: data.length,
          pending: data.filter(t => t.status === 'pending').length,
          accepted: data.filter(t => t.status === 'accepted').length,
          rejected: data.filter(t => t.status === 'rejected').length,
          waitlist: data.filter(t => t.status === 'waitlist').length,
          cancelled: data.filter(t => t.status === 'cancelled').length,
        };
        setStats(newStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Equipos', value: stats.total, icon: <Users className="h-6 w-6 text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Pendientes', value: stats.pending, icon: <Clock className="h-6 w-6 text-yellow-500" />, bg: 'bg-yellow-50' },
    { title: 'Aceptados', value: stats.accepted, icon: <CheckCircle className="h-6 w-6 text-green-500" />, bg: 'bg-green-50' },
    { title: 'Lista Espera', value: stats.waitlist, icon: <AlertCircle className="h-6 w-6 text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Rechazados', value: stats.rejected, icon: <XCircle className="h-6 w-6 text-red-500" />, bg: 'bg-red-50' },
  ];

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Resumen General</h1>
        <p className="text-slate-500">Métricas principales de inscripciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col"
          >
            <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{card.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
