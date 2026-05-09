import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorias', path: '/categorias' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="UDEA" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Concurso Tecnologico Anual de la Universidad de los Angeles, Puebla. Innovacion, programacion y robotica.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Navegacion</h4>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Stack</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {/* React */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-cyan-400/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor">
                  <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z" />
                </svg>
                <span className="text-xs font-medium text-slate-300">React</span>
              </div>

              {/* Vite */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-purple-400/30 transition-colors">
                <svg viewBox="0 0 410 404" className="w-5 h-5" fill="none">
                  <path d="M399.641 59.525l-183.998 329.02c-3.799 6.793-13.559 6.967-17.592.31L7.465 59.524C3.093 52.26 8.895 43.337 17.148 44.578l187.31 28.08c.913.137 1.842.137 2.755 0l183.27-28.08c8.253-1.24 14.056 7.684 9.158 14.947z" fill="url(#vite-a)" />
                  <path d="M293.305 1.55l-121.77 23.91c-1.727.34-2.99 1.851-3.026 3.623l-7.857 187.076c-.057 1.347 1.34 2.327 2.593 1.82l32.777-13.298c1.407-.571 2.9.46 2.764 1.91l-9.707 103.605c-.178 1.897 2.123 2.878 3.262 1.39l7.468-9.756 83.283-169.678c.733-1.493-.745-3.125-2.279-2.518l-33.834 13.387c-1.432.567-2.907-.524-2.713-2.007l16.002-136.626c.194-1.65-1.528-2.81-2.963-1.997z" fill="url(#vite-b)" />
                  <defs>
                    <linearGradient id="vite-a" x1="6.7" y1="32.08" x2="235.02" y2="344.15" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#41D1FF" /><stop offset="1" stopColor="#BD34FE" />
                    </linearGradient>
                    <linearGradient id="vite-b" x1="194.65" y1="8.82" x2="236.08" y2="292.99" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFBD4F" /><stop offset="1" stopColor="#FF9212" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xs font-medium text-slate-300">Vite</span>
              </div>

              {/* Tailwind CSS */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-sky-400/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="currentColor">
                  <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                </svg>
                <span className="text-xs font-medium text-slate-300">Tailwind</span>
              </div>

              {/* Framer Motion */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg group hover:border-pink-400/30 transition-colors">
                <svg viewBox="0 0 14 21" className="w-4 h-5 text-white" fill="currentColor">
                  <path d="M0 0h14v7H7zm0 7h7l7 7H7v7l-7-7z" />
                </svg>
                <span className="text-xs font-medium text-slate-300">Motion</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start mt-4 pt-4 border-t border-white/5">
              <a
                href="https://github.com/Danielnvcd/UDEA-Concurso"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Ver Repositorio
              </a>
              <a
                href="https://danielnvcd.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Desarrollado por danielnvcd
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            2026 UDEA. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidad" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Política de Privacidad
            </Link>
            <span className="text-slate-700 text-xs">·</span>
            <Link to="/terminos" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Términos de Servicio
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Disenado y construido por <span className="text-sky-400 font-semibold">danielnvcd</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
