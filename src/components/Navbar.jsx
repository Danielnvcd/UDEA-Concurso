import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Equipos', path: '/equipos' },
    { name: 'Ganadores', path: '/ganadores' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3.5 sm:pt-4 pointer-events-none"
    >
      <div className="liquid-glass rounded-2xl pl-4 pr-2 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between max-w-5xl mx-auto pointer-events-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0">
          <img src={logo} alt="UDEA" className="h-7 sm:h-8 w-auto object-contain brightness-0 invert" />
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-white/80 text-[14px] font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors duration-300 ${isActive ? 'text-white' : 'hover:text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right: CTA inscribete (solo desktop) */}
        <div className="hidden md:flex items-center">
          <NavLink
            to="/inscripcion"
            className="liquid-glass rounded-xl px-5 py-2 text-[14px] font-medium text-white hover:opacity-90 transition-opacity"
          >
            Inscríbete
          </NavLink>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          className="md:hidden h-10 w-10 ml-auto flex items-center justify-center rounded-xl text-white/85 active:bg-white/10 transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — absolute para no inflar el bounding box del nav y bloquear toques */}
      <div
        className={`md:hidden absolute left-3 right-3 top-full mt-2 max-w-5xl mx-auto origin-top transition-[opacity,transform] duration-200 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="rounded-2xl p-2.5 space-y-1 border border-white/10 shadow-2xl shadow-black/50"
          style={{ background: 'rgba(8, 8, 8, 0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 active:bg-white/5'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/inscripcion"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center mt-2 px-4 py-3.5 rounded-xl text-[15px] font-medium liquid-glass text-white"
          >
            Inscríbete ahora
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
