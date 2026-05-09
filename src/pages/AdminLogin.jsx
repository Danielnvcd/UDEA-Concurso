import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: isAdmin } = await supabase.rpc('is_admin');
          if (isAdmin) {
            navigate('/admin');
          }
        }
      } catch (err) {
        console.error('Error checking existing session:', err);
      }
    };
    
    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify if the user is an active admin via our RPC
      const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

      if (rpcError) throw rpcError;

      if (isAdmin) {
        navigate('/admin');
      } else {
        await supabase.auth.signOut();
        setError('No tienes permisos de administrador.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message === 'Invalid login credentials'
        ? 'Credenciales inválidas.'
        : 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[400px] w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="mb-8">
          <img src={logo} alt="UDEA Logo" className="h-16 w-auto object-contain brightness-0 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Panel Admin
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa tus credenciales para administrar la plataforma.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-9 px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                  placeholder="admin@ejemplo.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full pl-9 px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio público
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
