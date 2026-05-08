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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Only use light text when on home page AND at the very top (hero visible)
  const isHome = location.pathname === '/';
  const useLight = isHome && !scrolled;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Equipos', path: '/equipos' },
    { name: 'Ganadores', path: '/ganadores' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group">
            <img src={logo} alt="UDEA" className={`h-12 w-auto object-contain transition-all duration-300 ${useLight ? 'brightness-0 invert' : ''}`} />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative ${
                    useLight
                      ? isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      : isActive
                        ? 'text-blue-900 bg-blue-900/5'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="ml-4">
              <NavLink
                to="/inscripcion"
                className="bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 inline-block"
              >
                Inscribete
              </NavLink>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              useLight ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-3 px-2">
                <NavLink
                  to="/inscripcion"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 rounded-lg text-center text-sm font-bold bg-blue-900 text-white hover:bg-blue-800 transition-colors"
                >
                  Inscribete
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
