import { useEffect, useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Trophy, Home, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';

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

  const navItemClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-blue-700 bg-blue-50/80'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <NavLink to="/admin" className="flex items-center">
                <img src={logo} alt="UDEA" className="h-9 w-auto object-contain" />
              </NavLink>
              <nav className="hidden md:flex items-center gap-1">
                <NavLink to="/admin" end className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <LayoutDashboard className="h-4 w-4" /> Resumen
                      {isActive && <span className="absolute -bottom-[17px] left-3 right-3 h-0.5 bg-blue-600 rounded-full" />}
                    </>
                  )}
                </NavLink>
                <NavLink to="/admin/equipos" className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <Users className="h-4 w-4" /> Equipos
                      {isActive && <span className="absolute -bottom-[17px] left-3 right-3 h-0.5 bg-blue-600 rounded-full" />}
                    </>
                  )}
                </NavLink>
                <NavLink to="/admin/ganadores" className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <Trophy className="h-4 w-4" /> Ganadores
                      {isActive && <span className="absolute -bottom-[17px] left-3 right-3 h-0.5 bg-blue-600 rounded-full" />}
                    </>
                  )}
                </NavLink>
                <NavLink to="/admin/configuracion" className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <Settings className="h-4 w-4" /> Configuración
                      {isActive && <span className="absolute -bottom-[17px] left-3 right-3 h-0.5 bg-blue-600 rounded-full" />}
                    </>
                  )}
                </NavLink>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100/70 transition-all"
              >
                <Home className="h-4 w-4" /> Inicio
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRoute;
