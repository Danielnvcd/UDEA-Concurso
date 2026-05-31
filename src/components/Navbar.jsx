import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Equipos', path: '/equipos' },
    { name: 'Ganadores', path: '/ganadores' },
  ];

  const isSolid = scrolled || isOpen;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* ── Barra principal ── */}
      <div
        className="pointer-events-auto px-4 sm:px-6 transition-all duration-500 ease-in-out"
        style={{
          paddingTop: scrolled ? '0.625rem' : '1.25rem',
          paddingBottom: scrolled ? '0.625rem' : '1.25rem',
          background: isSolid
            ? 'rgba(4, 4, 12, 0.88)'
            : 'transparent',
          backdropFilter: isSolid ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isSolid ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: isSolid
            ? '1px solid rgba(255,255,255,0.07)'
            : '1px solid transparent',
          boxShadow: isSolid
            ? '0 4px 32px rgba(0,0,0,0.5)'
            : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center shrink-0 group">
            <img
              src={logo}
              alt="UDEA"
              className="h-7 sm:h-8 w-auto object-contain brightness-0 invert transition-opacity duration-300 group-hover:opacity-75"
            />
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `nav-link-glass px-3.5 py-2 rounded-xl text-[13.5px] font-medium ${
                    isActive
                      ? 'is-active text-white'
                      : 'text-white/50 hover:text-white/90'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* CTA Inscríbete */}
          <div className="hidden md:flex items-center">
            <NavLink
              to="/inscripcion"
              className="liquid-glass rounded-xl px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:text-white/80 active:scale-[0.97]"
            >
              Inscríbete
            </NavLink>
          </div>

          {/* Botón hamburguesa mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            className="md:hidden h-10 w-10 ml-auto flex items-center justify-center rounded-xl text-white/80 hover:bg-white/10 active:bg-white/15 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Menú mobile ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto md:hidden mx-3 mt-1.5 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/[0.08]"
            style={{ background: '#0a0a0a' }}
          >
            <div className="p-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `nav-link-glass flex items-center w-full px-4 py-3 rounded-xl text-[14px] font-medium mb-0.5 last:mb-0 ${
                      isActive
                        ? 'is-active text-white'
                        : 'text-white/50 hover:text-white/90'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Separador */}
              <div className="mx-2 my-2 h-px bg-white/[0.07]" />

              {/* CTA mobile */}
              <NavLink
                to="/inscripcion"
                onClick={() => setIsOpen(false)}
                className="liquid-glass flex items-center justify-center w-full px-4 py-3 rounded-xl text-[14px] font-semibold text-white active:opacity-80 transition-opacity"
              >
                Inscríbete
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>




    </nav>
  );
};

export default Navbar;
