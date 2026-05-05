import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const isDarkBg = location.pathname === '/' && !scrolled;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-md border-slate-200 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <Cpu className={`h-8 w-8 transition-colors ${isDarkBg ? 'text-white' : 'text-blue-900'}`} />
              <span className="font-black text-xl tracking-tight hidden sm:block">
                <span className={`transition-colors ${isDarkBg ? 'text-white' : 'text-blue-900'}`}>UDEA</span>
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors relative py-2 ${
                      isDarkBg 
                        ? (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                        : (isActive ? 'text-blue-900' : 'text-slate-500 hover:text-blue-900')
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-sky-500 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            
            <a
              href="#inscripcion"
              className="bg-sky-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95 btn-shimmer shadow-md shadow-sky-500/20"
            >
              Inscríbete
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isDarkBg ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-900'} focus:outline-none transition-colors`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-blue-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-900'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 px-2">
                <a
                  href="#inscripcion"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 rounded-xl text-center text-base font-bold bg-sky-500 text-white btn-shimmer shadow-md shadow-sky-500/20"
                >
                  Inscríbete
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
