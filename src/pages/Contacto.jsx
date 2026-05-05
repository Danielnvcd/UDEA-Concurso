import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, Loader2, CheckCircle2 } from 'lucide-react';

const FloatingInput = ({ id, label, type = "text", value, onChange, isTextarea = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative pt-6">
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{
          y: isActive ? -28 : 0,
          scale: isActive ? 0.85 : 1,
          color: isActive ? '#0ea5e9' : '#64748b' // sky-500 : slate-500
        }}
        className="absolute left-4 top-10 transform -translate-y-1/2 origin-left font-bold pointer-events-none transition-colors"
      >
        {label}
      </motion.label>
      
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={5}
          className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-sky-500 transition-colors resize-none text-slate-800 font-medium shadow-sm"
          required
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white focus:outline-none focus:border-sky-500 transition-colors text-slate-800 font-medium shadow-sm"
          required
        />
      )}
    </div>
  );
};

const Contacto = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      // Reset form after a while
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen flex items-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-800 tracking-tight"
          >
            Ponte en Contacto
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-xl mx-auto font-medium"
          >
            ¿Tienes dudas sobre los requisitos o reglas? Escríbenos y te responderemos a la brevedad.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <FloatingInput 
                id="name" 
                label="Nombre Completo" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
              <FloatingInput 
                id="email" 
                label="Correo Electrónico" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            
            <FloatingInput 
              id="message" 
              label="Escribe tu mensaje..." 
              isTextarea={true}
              value={formData.message} 
              onChange={(e) => setFormData({...formData, message: e.target.value})} 
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full h-14 relative rounded-xl font-black text-lg transition-all overflow-hidden bg-blue-900 text-white hover:bg-blue-800 shadow-md active:scale-[0.98]"
              >
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-center gap-2 absolute inset-0"
                    >
                      Enviar Mensaje
                      <SendHorizonal className="w-5 h-5" />
                    </motion.div>
                  )}
                  {status === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center absolute inset-0 bg-blue-800"
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 absolute inset-0 bg-sky-500"
                    >
                      <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                          d="M20 6L9 17l-5-5"
                        />
                      </motion.svg>
                      ¡Mensaje enviado!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacto;
