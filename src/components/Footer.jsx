import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-900 to-sky-500"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo & Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Cpu className="w-8 h-8 text-blue-900" />
              <span className="font-black text-xl tracking-tight">
                <span className="text-blue-900">UDEA</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {['Inicio', 'Categorías', 'Eventos', 'Recursos', 'Contacto'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`}
                className="text-slate-500 hover:text-blue-900 transition-colors font-medium text-sm"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Credits */}
          <div className="text-center md:text-right text-sm text-slate-500 font-medium">
            <p className="mb-1 text-xs uppercase tracking-wider text-slate-400 font-bold">Stack Tecnológico</p>
            <p className="mb-3 text-slate-600">
              React + Vite + Tailwind CSS v4 + Framer Motion
            </p>
            <p>
              Diseñado y construido por{' '}
              <a
                href="https://github.com/danielnvcd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 font-bold hover:text-blue-900 transition-colors"
              >
                danielnvcd
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
