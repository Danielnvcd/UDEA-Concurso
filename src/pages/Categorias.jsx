import { motion } from 'framer-motion';
import { Sparkles, Terminal, Castle, Bot, Waypoints, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'innovacion',
    title: 'Innovación',
    description: 'Proyectos creativos orientados a resolver problemas reales, con o sin el uso de IA.',
    icon: Sparkles,
    accent: 'yellow-500',
    accentHex: '#eab308',
    isRobotics: false,
  },
  {
    id: 'programacion',
    title: 'Programación',
    description: 'Desafíos algorítmicos y desarrollo de software bajo presión.',
    icon: Terminal,
    accent: 'blue-500',
    accentHex: '#3b82f6',
    isRobotics: false,
  },
  {
    id: 'ajedrez',
    title: 'Ajedrez',
    description: 'Torneo estratégico clásico. Pon a prueba tu mente y capacidad de anticipación.',
    icon: Castle,
    accent: 'slate-300',
    accentHex: '#cbd5e1',
    isRobotics: false,
  },
  {
    id: 'sumo',
    title: 'SumoRobot',
    description: 'Diseña y programa un robot autónomo capaz de sacar a su oponente del ring.',
    icon: Bot,
    accent: 'red-500',
    accentHex: '#ef4444',
    isRobotics: true,
  },
  {
    id: 'sigue-lineas',
    title: 'Sigue líneas con obstáculos',
    description: 'Crea un vehículo que recorra un circuito evadiendo obstáculos en el menor tiempo.',
    icon: Waypoints,
    accent: 'green-500',
    accentHex: '#22c55e',
    isRobotics: true,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } }
};

const Categorias = () => {
  return (
    <div className="pt-32 pb-24 bg-primary grid-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/30 text-accent-violet text-sm font-bold tracking-wide uppercase mb-6"
          >
            5 Disciplinas
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6 text-gradient uppercase tracking-tight"
          >
            Categorías
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto font-medium"
          >
            Elige tu especialidad y demuestra tu talento. Contamos con diversas áreas para que pongas a prueba tus conocimientos técnicos.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="card-glass p-8 rounded-3xl relative group transition-all duration-300 border-white/10 overflow-hidden cursor-pointer flex flex-col h-full"
                style={{ '--hover-color': cat.accentHex }}
              >
                {/* Dynamic Border Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl border-2"
                  style={{ borderColor: cat.accentHex + '80' }} // 50% opacity hex
                ></div>

                {cat.isRobotics && (
                  <div className="absolute top-6 right-6 px-3 py-1 bg-accent-violet/20 text-accent-violet rounded-full text-xs font-bold uppercase tracking-wider border border-accent-violet/20">
                    Robótica
                  </div>
                )}

                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.accentHex + '15' }} // 10% opacity
                >
                  {/* Glow effect for icon container */}
                  <div 
                    className="absolute inset-0 rounded-2xl blur-md opacity-50"
                    style={{ backgroundColor: cat.accentHex }}
                  ></div>
                  <Icon 
                    className="w-8 h-8 relative z-10" 
                    style={{ color: cat.accentHex }} 
                    strokeWidth={2.5} 
                  />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{cat.title}</h3>
                <p className="text-text-muted leading-relaxed font-medium flex-grow">
                  {cat.description}
                </p>

                <div className="mt-8 flex justify-end">
                  <ArrowRight 
                    className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                    style={{ color: cat.accentHex }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Categorias;
