import { useEffect, useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Trophy, Home, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Call our RPC function to check if the user is an active admin
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) throw error;
        
        setIsAdmin(data);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
         checkAdminStatus();
      } else {
         setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="font-bold text-xl text-blue-900 tracking-tight">Admin UDEA</span>
              <nav className="hidden md:flex space-x-4">
                <NavLink to="/admin" end className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Resumen
                </NavLink>
                <NavLink to="/admin/equipos" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Users className="h-4 w-4 mr-2" /> Equipos
                </NavLink>
                <NavLink to="/admin/ganadores" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Trophy className="h-4 w-4 mr-2" /> Ganadores
                </NavLink>
                <NavLink to="/admin/configuracion" className={({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Settings className="h-4 w-4 mr-2" /> Configuración
                </NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <NavLink to="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                <Home className="h-4 w-4 mr-1.5" /> Inicio
              </NavLink>
              <button onClick={handleLogout} className="flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                <LogOut className="h-4 w-4 mr-1.5" /> Salir
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRoute;
