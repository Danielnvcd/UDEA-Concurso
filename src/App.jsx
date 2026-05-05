import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Inicio from './pages/Inicio';
import Categorias from './pages/Categorias';
import Eventos from './pages/Eventos';
import Recursos from './pages/Recursos';
import Contacto from './pages/Contacto';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
