import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import Inicio from './pages/Inicio';

// Las páginas no-críticas se cargan bajo demanda
const Categorias = lazy(() => import('./pages/Categorias'));
const Eventos = lazy(() => import('./pages/Eventos'));
const Recursos = lazy(() => import('./pages/Recursos'));
const Inscripcion = lazy(() => import('./pages/Inscripcion'));
const Equipos = lazy(() => import('./pages/Equipos'));
const Ganadores = lazy(() => import('./pages/Ganadores'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Terminos = lazy(() => import('./pages/Terminos'));

// El admin solo se descarga si el usuario navega a /admin
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminEquipos = lazy(() => import('./pages/AdminEquipos'));
const AdminGanadores = lazy(() => import('./pages/AdminGanadores'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-8 w-8 border-b border-white/40" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Inicio />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="eventos" element={<Eventos />} />
            <Route path="recursos" element={<Recursos />} />
            <Route path="inscripcion" element={<Inscripcion />} />
            <Route path="equipos" element={<Equipos />} />
            <Route path="ganadores" element={<Ganadores />} />
            <Route path="privacidad" element={<Privacidad />} />
            <Route path="terminos" element={<Terminos />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="equipos" element={<AdminEquipos />} />
            <Route path="ganadores" element={<AdminGanadores />} />
            <Route path="configuracion" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
