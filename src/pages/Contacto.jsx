import { motion } from 'framer-motion';
import { SendHorizonal, AtSign, Smartphone, MapPinned } from 'lucide-react';

const Contacto = () => {
  return (
    <div className="pt-32 pb-24 bg-layer grid-bg min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-4 text-gradient uppercase tracking-tight"
          >
            Terminal de Contacto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto font-medium"
          >
            ¿Errores de compilación en tus dudas? Haz un pull request de tus preguntas 
            al comité organizador y te responderemos pronto.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            {[
              { icon: AtSign, title: 'Email Oficial', detail: 'concurso@udea.edu.mx' },
              { icon: Smartphone, title: 'Línea Directa', detail: '+52 (222) 123 4567' },
              { icon: MapPinned, title: 'Cuartel General', detail: 'Puebla, México (CAPU y 11 Sur)' }
            ].map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="card-glass p-6 rounded-3xl flex items-start gap-4 hover:-translate-y-1 transition-transform cursor-default">
                  <div className="w-12 h-12 bg-accent-cyan/10 text-accent-cyan rounded-2xl flex items-center justify-center shrink-0 border border-accent-cyan/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 tracking-wide">{info.title}</h4>
                    <p className="text-text-muted font-medium">{info.detail}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 card-glass rounded-3xl p-8"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Identificación (Nombre)
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-primary text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:glow-cyan transition-all"
                    placeholder="Turing, Alan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Canal de retorno (Email)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-primary text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:glow-cyan transition-all"
                    placeholder="alan@enigma.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Carga útil (Mensaje)
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-primary text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:glow-cyan transition-all resize-none"
                  placeholder="Inicia transmisión de datos aquí..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-black px-8 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all glow-cyan"
              >
                Ejecutar Envío
                <SendHorizonal className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
