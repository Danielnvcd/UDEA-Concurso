import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import RegistrationForm from '../components/RegistrationForm';
import { CheckCircle2, Shield, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const serif = { fontFamily: "'Bricolage Grotesque', sans-serif" };

const Inscripcion = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState(null);
  const [platformStatus, setPlatformStatus] = useState('open');
  const [requireRegistrationCode, setRequireRegistrationCode] = useState(true);
  const [session, setSession] = useState(null);
  const [existingTeam, setExistingTeam] = useState(null);
  const [checkingTeam, setCheckingTeam] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const fetchCategories = async () => {
      try {
        const { data: settingsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'event_config')
          .single();

        if (settingsData?.value?.status) {
          setPlatformStatus(settingsData.value.status);
        }
        if (settingsData?.value?.require_registration_code === false) {
          setRequireRegistrationCode(false);
        }

        const { data: availabilityData, error: availError } = await supabase.rpc('get_category_availability');
        if (availError) throw availError;

        const { data: catData, error: catError } = await supabase.from('categories').select('id, max_members');
        if (catError) throw catError;

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

        const { data: leaderData } = await supabase
          .from('teams')
          .select('*, categories(name)')
          .eq('leader_email', userEmail)
          .gte('created_at', currentYearStart)
          .maybeSingle();

        if (leaderData) {
          setExistingTeam(leaderData);
          return;
        }

        const { data: memberData } = await supabase
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
        options: { redirectTo: `${window.location.origin}/inscripcion` }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="fixed inset-0 bg-black -z-[1] pointer-events-none" />
        <div className="animate-spin rounded-full h-10 w-10 border-b border-white/40"></div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen pt-28 pb-12 text-white flex items-center justify-center px-6 relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="fixed inset-0 bg-black -z-[1] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(80,200,140,0.18) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass rounded-2xl p-10 max-w-md w-full text-center relative"
        >
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full glass-pill mb-6">
            <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
          <h2 className="text-3xl font-medium text-white mb-3" style={serif}>¡Tu inscripción fue recibida!</h2>
          <p className="text-white/60 mb-7 leading-relaxed">
            Hemos registrado a tu equipo exitosamente. Un organizador revisará tu registro a la brevedad.
          </p>

          <div className="glass-pill !rounded-2xl p-5 text-left mb-7">
            <p className="text-[10px] text-white/55 font-medium uppercase tracking-[0.2em] mb-1">Folio de Registro</p>
            <p className="text-lg font-mono font-medium text-white mb-4">{successData.folio}</p>

            <p className="text-[10px] text-white/55 font-medium uppercase tracking-[0.2em] mb-1">Equipo</p>
            <p className="text-white mb-4">{successData.team_name}</p>

            <p className="text-[10px] text-white/55 font-medium uppercase tracking-[0.2em] mb-1">Estado</p>
            <span className="glass-pill inline-block px-3 py-1 text-xs text-white/85">
              Pendiente de confirmación
            </span>
          </div>

          <Link
            to="/"
            className="liquid-glass inline-block w-full text-white font-medium py-3 px-4 rounded-full transition-opacity hover:opacity-90"
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 sm:pb-24 text-white relative overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fixed inset-0 bg-black -z-[1] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(80,110,200,0.12) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 sm:pb-8 border-b border-white/[0.08]"
        >
          <div className="max-w-2xl">
            <p className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-3 sm:mb-4">
              Inscripción 2026
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.01em] leading-[1.05] mb-3 sm:mb-4 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent" style={serif}>
              Inscripción de <em style={{ ...serif, fontStyle: 'italic' }}>equipos</em>
            </h1>
            <p className="text-sm sm:text-base text-white/55 leading-relaxed">
              Registra a tu equipo en el 6º Concurso IntraUniversitario CIUMeSis 2.0. Costo: $200 por concursante y categoría.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {session && (
              <div className="glass-pill inline-flex items-center gap-2 text-sm text-white px-3 py-2 max-w-full">
                {(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) && (
                  <img
                    src={session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url}
                    alt=""
                    className="w-5 h-5 rounded-full shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span className="text-xs sm:text-sm truncate max-w-[160px] sm:max-w-[180px]">{session.user.email}</span>
                <button
                  onClick={() => { if (window.confirm('¿Cerrar sesión?')) supabase.auth.signOut(); }}
                  className="text-white/60 hover:text-white transition-colors shrink-0 p-1 -m-1"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <Link
              to="/admin/login"
              className="glass-pill inline-flex items-center gap-1.5 text-sm font-medium text-white/75 hover:text-white transition-colors px-3 py-2"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Acceso Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {platformStatus === 'coming_soon' ? (
            <div className="liquid-glass rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 glass-pill flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-2xl font-medium text-white mb-2" style={serif}>Próximamente</h3>
              <p className="text-white/55">Las inscripciones aún no están abiertas. Mantente atento a nuestras redes oficiales.</p>
            </div>
          ) : platformStatus === 'closed' ? (
            <div className="liquid-glass rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 glass-pill flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-2xl font-medium text-white mb-2" style={serif}>Inscripciones Cerradas</h3>
              <p className="text-white/55">El periodo de inscripción ha finalizado. Te esperamos en la próxima edición.</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <p className="text-white/55">No hay categorías disponibles en este momento.</p>
            </div>
          ) : !session ? (
            <div className="liquid-glass rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 glass-pill flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-white mb-3" style={serif}>Inicio de sesión requerido</h3>
              <p className="text-white/55 mb-8 max-w-sm mx-auto leading-relaxed">
                Para inscribir a tu equipo necesitas iniciar sesión con tu cuenta de Google institucional o personal.
              </p>
              <button
                onClick={handleGoogleLogin}
                className="liquid-glass inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 rounded-full text-white font-medium transition-opacity active:opacity-80 mb-5 min-h-[48px]"
              >
                Continuar con Google
              </button>
              <p className="text-xs text-white/45 max-w-xs mx-auto flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Solo utilizaremos tu correo electrónico para identificar tu registro.
              </p>
            </div>
          ) : (
            <>
              <div className="liquid-glass rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  {(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) && (
                    <img
                      src={session.user.user_metadata?.picture || session.user.user_metadata?.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div>
                    <p className="text-[10px] text-white/55 font-medium uppercase tracking-[0.2em]">Sesión iniciada como</p>
                    <p className="text-white">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("¿Estás seguro de que deseas cerrar sesión? Perderás cualquier dato del formulario que no hayas enviado.")) {
                      supabase.auth.signOut();
                    }
                  }}
                  className="text-sm text-white/60 hover:text-white transition-colors shrink-0"
                >
                  Cerrar sesión
                </button>
              </div>

              {checkingTeam ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b border-white/40"></div>
                </div>
              ) : existingTeam ? (
                <div className="liquid-glass rounded-2xl p-7 sm:p-10 text-center max-w-2xl mx-auto">
                  <div className="w-14 h-14 glass-pill flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-3" style={serif}>Ya estás registrado</h3>
                  <p className="text-white/55 mb-8 max-w-md mx-auto leading-relaxed">
                    Tu correo <span className="text-white">{session.user.email}</span> ya se encuentra vinculado a un equipo. No es necesario que vuelvas a llenar el formulario.
                  </p>

                  <div className="glass-pill !rounded-2xl p-6 max-w-sm mx-auto text-left">
                    <div className="mb-4">
                      <p className="text-[10px] text-white/55 uppercase font-medium tracking-[0.2em] mb-1">Folio del Equipo</p>
                      <p className="text-xl font-medium text-white">{existingTeam.folio}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/55 uppercase font-medium tracking-[0.2em] mb-1">Nombre del Equipo</p>
                      <p className="text-white">{existingTeam.team_name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <RegistrationForm
                  categories={categories}
                  onSuccess={(data) => setSuccessData(data)}
                  userEmail={session.user.email}
                  requireRegistrationCode={requireRegistrationCode}
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
