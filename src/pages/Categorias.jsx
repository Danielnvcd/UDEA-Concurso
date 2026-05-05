import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Castle, Bot, Waypoints, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: 'innovacion',
    title: 'Innovación',
    description: 'Desarrollo de proyectos creativos orientados a resolver problemas reales de la industria actual.',
    icon: Sparkles,
  },
  {
    id: 'programacion',
    title: 'Programación Algorítmica',
    description: 'Desafíos de lógica matemática y desarrollo de software competitivo bajo estrictos límites de tiempo.',
    icon: Terminal,
  },
  {
    id: 'ajedrez',
    title: 'Ajedrez Estratégico',
    description: 'Torneo de ajedrez clásico enfocado en el análisis, la estrategia profunda y la capacidad de anticipación.',
    icon: Castle,
  },
  {
    id: 'sumo',
    title: 'Robótica: Sumo',
    description: 'Diseño, ensamblaje y programación algorítmica de robots autónomos de combate cuerpo a cuerpo.',
    icon: Bot,
  },
  {
    id: 'sigue-lineas',
    title: 'Robótica: Sigue Líneas',
    description: 'Ingeniería de vehículos autónomos para recorrer circuitos complejos con evasión de obstáculos.',
    icon: Waypoints,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Categorias = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-800 tracking-tight"
          >
            Disciplinas Técnicas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Nuestras competencias están diseñadas para evaluar habilidades prácticas y conocimientos técnicos a nivel profesional.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expandedId === cat.id;

            return (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                className={`bg-white border rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'border-sky-300 shadow-md ring-1 ring-sky-50' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="px-6 py-6 sm:px-8 flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-6">
                    <div className={`p-3 rounded-xl transition-colors duration-300 shrink-0 ${
                      isExpanded ? 'bg-blue-900 text-white' : 'bg-slate-50 text-slate-500'
                    }`}>
                      <Icon className="w-6 h-6" strokeWidth={isExpanded ? 2.5 : 2} />
                    </div>
                    
                    <div>
                      <h3 className={`text-xl font-bold tracking-tight mb-1 transition-colors duration-300 ${
                        isExpanded ? 'text-blue-900' : 'text-slate-800'
                      }`}>
                        {cat.title}
                      </h3>
                      <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className={`shrink-0 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90 text-sky-500' : 'text-slate-300'
                  }`}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                    >
                      <div className="px-6 py-6 sm:px-8 sm:ml-16">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requisitos Técnicos</h4>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              Equipos de máximo 3 integrantes. Indispensable presentar credencial vigente. 
                              El uso de frameworks externos o librerías pre-compiladas está sujeto al reglamento oficial de la categoría.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Criterios de Evaluación</h4>
                            <ul className="text-sm text-slate-600 font-medium space-y-1">
                              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-sky-500"></div> Eficiencia y rendimiento</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-sky-500"></div> Diseño y arquitectura</li>
                              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-sky-500"></div> Funcionalidad requerida</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Categorias;
