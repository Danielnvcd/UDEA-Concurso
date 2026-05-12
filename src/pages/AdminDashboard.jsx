import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
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
    {
      title: 'Total Equipos',
      value: stats.total,
      icon: Users,
      gradient: 'from-blue-500 to-sky-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      ring: 'ring-blue-100',
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-amber-500 to-yellow-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      ring: 'ring-amber-100',
    },
    {
      title: 'Aceptados',
      value: stats.accepted,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-green-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      ring: 'ring-emerald-100',
    },
    {
      title: 'Lista Espera',
      value: stats.waitlist,
      icon: AlertCircle,
      gradient: 'from-purple-500 to-violet-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      ring: 'ring-purple-100',
    },
    {
      title: 'Rechazados',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-rose-500 to-red-500',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      ring: 'ring-rose-100',
    },
  ];

  const acceptanceRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Panel principal
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resumen General</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Métricas principales de inscripciones al concurso.</p>
        </div>
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Tasa de aceptación</p>
              <p className="text-lg font-black text-slate-900 leading-tight">{acceptanceRate}%</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const pct = stats.total > 0 ? (card.value / stats.total) * 100 : 0;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4, ease: 'easeOut' }}
              className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />
              <div className="flex items-start justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} ring-4 ${card.ring} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} strokeWidth={2.2} />
                </div>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</h3>
              <p className="text-4xl font-black text-slate-900 mt-1 tabular-nums tracking-tight">{card.value}</p>
              {card.title !== 'Total Equipos' && stats.total > 0 && (
                <div className="mt-3">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: idx * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{pct.toFixed(0)}% del total</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
