import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-primary/95 backdrop-blur-xl shadow-lg' : 'bg-primary/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-blue rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <Cpu className="h-8 w-8 text-white relative z-10" />
              </div>
              <span className="font-black text-xl hidden sm:flex gap-1 tracking-tight">
                <span className="text-gradient">TechCon</span>
                <span className="text-accent-cyan">ULA</span>
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
                    `text-sm font-semibold transition-colors relative group ${
                      isActive ? 'text-accent-blue' : 'text-text-muted hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-blue glow-blue"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            
            <a
              href="#inscripcion"
              className="bg-accent-blue text-white px-6 py-2 rounded-full font-bold text-sm transition-all hover:bg-blue-600 glow-blue hover:scale-105 active:scale-95"
            >
              Inscríbete
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-muted hover:text-white focus:outline-none transition-colors"
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
            className="md:hidden bg-layer/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-base font-bold transition-colors border border-transparent ${
                      isActive
                        ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                        : 'text-text-muted hover:bg-white/5 hover:text-white'
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
                  className="block w-full py-3 rounded-xl text-center text-base font-bold bg-accent-blue text-white glow-blue hover:bg-blue-600 transition-colors"
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
