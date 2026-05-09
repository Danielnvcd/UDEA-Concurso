import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Inicio from './pages/Inicio';
import Categorias from './pages/Categorias';
import Eventos from './pages/Eventos';
import Recursos from './pages/Recursos';
import Contacto from './pages/Contacto';
import Inscripcion from './pages/Inscripcion';
import Equipos from './pages/Equipos';
import Ganadores from './pages/Ganadores';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipos from './pages/AdminEquipos';
import AdminGanadores from './pages/AdminGanadores';
import AdminSettings from './pages/AdminSettings';
import AdminRoute from './components/AdminRoute';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="recursos" element={<Recursos />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="inscripcion" element={<Inscripcion />} />
          <Route path="equipos" element={<Equipos />} />
          <Route path="ganadores" element={<Ganadores />} />
          <Route path="privacidad" element={<Privacidad />} />
          <Route path="terminos" element={<Terminos />} />
        </Route>
        
        {/* Admin Login sin el MainLayout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Rutas Admin Protegidas (se pueden poner bajo MainLayout si se desea o solas. Para un panel suele ser sin el layout principal, pero lo dejaremos así por ahora y luego se puede ajustar) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="equipos" element={<AdminEquipos />} />
          <Route path="ganadores" element={<AdminGanadores />} />
          <Route path="configuracion" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
