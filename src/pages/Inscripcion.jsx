import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RegistrationForm from '../components/RegistrationForm';
import { CheckCircle2, Shield, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Inscripcion = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState(null);
  const [platformStatus, setPlatformStatus] = useState('open');
  const [session, setSession] = useState(null);
  const [existingTeam, setExistingTeam] = useState(null);
  const [checkingTeam, setCheckingTeam] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkExistingTeam = async (userEmail) => {
      setCheckingTeam(true);
      try {
        const currentYearStart = `${new Date().getFullYear()}-01-01T00:00:00.000Z`;

        // Consultar si es líder este año
        const { data: leaderData, error: leaderError } = await supabase
          .from('teams')
          .select('*, categories(name)')
          .eq('leader_email', userEmail)
          .gte('created_at', currentYearStart)
          .maybeSingle();

        if (leaderData) {
          setExistingTeam(leaderData);
          return;
        }

        // Consultar si es miembro este año
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select('team_id, teams(*, categories(name))')
          .eq('email', userEmail)
          .gte('created_at', currentYearStart)
          .maybeSingle();

        if (memberData?.teams) {
          setExistingTeam(memberData.teams);
        } else {
          setExistingTeam(null);
        }
      } catch (err) {
        console.error('Error checking existing team:', err);
      } finally {
        setCheckingTeam(false);
      }
    };

    if (session?.user?.email) {
      checkExistingTeam(session.user.email);
    } else {
      setExistingTeam(null);
    }
  }, [session]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/inscripcion`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#070b0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#070b0a] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Tu inscripción fue recibida!</h2>
          <p className="text-slate-400 mb-6">
            Hemos registrado a tu equipo exitosamente. Un organizador revisará tu registro a la brevedad.
          </p>
          
          <div className="bg-[#070b0a] p-4 rounded-xl text-left mb-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Folio de Registro</p>
            <p className="text-lg font-mono font-bold text-white mb-3">{successData.folio}</p>
            
            <p className="text-sm text-slate-400 mb-1">Equipo</p>
            <p className="font-semibold text-white mb-3">{successData.team_name}</p>
            
            <p className="text-sm text-slate-400 mb-1">Estado</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
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
    <div className="min-h-screen pt-24 pb-20 bg-[#070b0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Inscripción de Equipos
            </h1>
            <p className="text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Completa este formulario para registrar a tu equipo en el Concurso Tecnológico UDEA 2026.
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {session && (
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-500/15 px-3 py-1.5 rounded-lg border border-blue-400/30">
                {(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) && (
                  <img
                    src={session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url}
                    alt=""
                    className="w-5 h-5 rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="text-xs sm:text-sm truncate max-w-[180px]">{session.user.email}</span>
                <button
                  onClick={() => {
                    if (window.confirm('¿Cerrar sesión?')) supabase.auth.signOut();
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
              <Shield className="w-4 h-4" />
              Acceso Admin
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : successData ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-sm border border-white/10 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">¡Registro Exitoso!</h2>
              <div className="bg-[#070b0a] border border-white/10 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <p className="text-sm text-slate-400 mb-2 uppercase tracking-wider font-bold">Folio de Inscripción</p>
                <p className="text-4xl font-black text-blue-400 tracking-tight">{successData.folio}</p>
              </div>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Tu registro ha sido recibido correctamente. El comité organizador revisará tu solicitud y te contactará al correo <span className="font-semibold text-white">{successData.leader_email}</span> para la aprobación final.
              </p>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm">
                Volver al Inicio
              </Link>
            </motion.div>
          ) : platformStatus === 'coming_soon' ? (
            <div className="text-center p-12 bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10">
              <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Próximamente</h3>
              <p className="text-slate-400">Las inscripciones aún no están abiertas. Mantente atento a nuestras redes oficiales.</p>
            </div>
          ) : platformStatus === 'closed' ? (
            <div className="text-center p-12 bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Inscripciones Cerradas</h3>
              <p className="text-slate-400">El periodo de inscripción ha finalizado. Te esperamos en la próxima edición.</p>
            </div>

          ) : categories.length === 0 ? (
            <div className="text-center p-12 bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10">
              <p className="text-slate-400">No hay categorías disponibles en este momento.</p>
            </div>
          ) : !session ? (
            <div className="text-center p-12 bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10">
               <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Inicio de Sesión Requerido</h3>
               <p className="text-slate-400 mb-8 max-w-sm mx-auto">Para inscribir a tu equipo en el concurso, necesitas iniciar sesión con tu cuenta de Google institucional o personal.</p>
               <button 
                 onClick={handleGoogleLogin} 
                 className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold hover:bg-white/20 transition-colors shadow-sm mb-4"
               >
                  Continuar con Google
               </button>
               <p className="text-xs text-slate-400 max-w-xs mx-auto flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Solo utilizaremos tu correo electrónico para identificar tu registro. No accederemos a más datos.
               </p>
            </div>
          ) : (
             <>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 gap-4">
                 <div className="flex items-center gap-3">
                    {(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) && (
                       <img 
                         src={session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url} 
                         alt="Avatar" 
                         className="w-10 h-10 rounded-full bg-[#070b0a]" 
                         referrerPolicy="no-referrer"
                         onError={(e) => { e.target.style.display = 'none'; }}
                       />
                    )}
                    <div>
                       <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Sesión iniciada como:</p>
                       <p className="font-semibold text-white">{session.user.email}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (window.confirm("¿Estás seguro de que deseas cerrar sesión? Perderás cualquier dato del formulario que no hayas enviado.")) {
                       supabase.auth.signOut();
                     }
                   }} 
                   className="text-sm font-semibold text-slate-400 hover:text-white underline shrink-0"
                 >
                    Cerrar sesión
                 </button>
              </div>

              {checkingTeam ? (
                 <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                 </div>
              ) : existingTeam ? (
                 <div className="text-center p-8 sm:p-12 bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ya estás registrado</h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      Tu correo <strong className="text-white">{session.user.email}</strong> ya se encuentra vinculado a un equipo. No es necesario que vuelvas a llenar el formulario.
                    </p>
                    
                    <div className="bg-[#070b0a] rounded-xl p-6 mb-8 max-w-sm mx-auto border border-white/10 text-left">
                       <div className="mb-4">
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Folio del Equipo</p>
                          <p className="text-xl font-black text-blue-400">{existingTeam.folio}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Nombre del Equipo</p>
                          <p className="font-semibold text-white">{existingTeam.team_name}</p>
                       </div>
                    </div>
                 </div>
              ) : (
                <RegistrationForm 
                  categories={categories} 
                  onSuccess={(data) => setSuccessData(data)} 
                  userEmail={session.user.email}
                />
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Inscripcion;
