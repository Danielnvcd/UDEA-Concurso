import { Cpu, Globe, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#020710] grid-bg border-t border-accent-cyan/10 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-accent-cyan/20 to-transparent blur-sm"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-layer border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-accent-blue/20 blur-md group-hover:opacity-100 transition-opacity"></div>
                <Cpu className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className="font-black text-2xl tracking-tight">
                <span className="text-white">TechCon </span>
                <span className="text-accent-cyan">ULA</span>
              </span>
            </Link>
            <p className="text-text-muted font-medium max-w-xs">
              Formando a la próxima generación de líderes en tecnología, innovación y robótica desde Puebla para el mundo.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Navegación</h4>
            <div className="flex flex-col gap-3 items-center">
              {['Inicio', 'Categorías', 'Eventos', 'Recursos'].map((item) => (
                <Link 
                  key={item} 
                  to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`}
                  className="text-text-muted hover:text-accent-cyan transition-colors font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials & Credits */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Comunidad</h4>
            <div className="flex gap-4 mb-6">
              {[Globe, MessageSquare, Users].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-layer border border-white/5 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-cyan/30 hover:bg-accent-cyan/10 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="text-center md:text-right">
              <span className="text-text-muted text-sm block mb-1">Diseñado & Desarrollado por</span>
              <a
                href="https://github.com/danielnvcd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-cyan font-bold hover:text-white transition-colors"
              >
                danielnvcd
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm font-medium">
            &copy; {new Date().getFullYear()} Concurso Tecnológico Universidad de los Ángeles. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-slate-600 text-sm font-medium">
            <a href="#" className="hover:text-text-muted transition-colors">Términos</a>
            <a href="#" className="hover:text-text-muted transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
