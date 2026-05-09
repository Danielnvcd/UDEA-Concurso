import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Code2, Crown, Bot, Route, ChevronDown, Clock, Users, Target } from 'lucide-react';

import imgInovacion from '../assets/inovacion.jpg';
import imgProgramacion from '../assets/programacion_inicio.jpg';
import imgAjedrez2 from '../assets/ajedres2_inicio.jpg';
import imgSumo from '../assets/sumo_inicio.jpg';
import imgSigueLineas from '../assets/siguelinea_incio.jpg';
import imgSigueLinea2 from '../assets/siguelinea_incio.jpg';

const categories = [
  {
    id: 'innovacion',
    title: 'Innovacion',
    subtitle: 'Proyectos creativos con impacto real',
    description: 'Desarrollo de proyectos creativos orientados a resolver problemas reales de la industria actual con soluciones tecnologicas viables.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    image: imgInovacion,
    details: {
      teams: '3 integrantes max.',
      duration: '4 horas',
      criteria: ['Viabilidad tecnica', 'Impacto social', 'Presentacion y pitch', 'Innovacion del enfoque'],
    },
  },
  {
    id: 'programacion',
    title: 'Programacion Algoritmica',
    subtitle: 'Resolucion de problemas bajo presion',
    description: 'Desafios de logica matematica y desarrollo de software competitivo bajo estrictos limites de tiempo y recursos.',
    icon: Code2,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    image: imgProgramacion,
    details: {
      teams: '2 integrantes max.',
      duration: '3 horas',
      criteria: ['Eficiencia del algoritmo', 'Tiempo de ejecucion', 'Casos de prueba correctos', 'Calidad del codigo'],
    },
  },
  {
    id: 'ajedrez',
    title: 'Ajedrez Estrategico',
    subtitle: 'Analisis, estrategia y anticipacion',
    description: 'Torneo de ajedrez clasico enfocado en el analisis profundo, la estrategia y la capacidad de anticipacion tactica.',
    icon: Crown,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    image: imgAjedrez2,
    details: {
      teams: 'Individual',
      duration: '30 min por partida',
      criteria: ['Sistema suizo', 'Puntos de Buchholz', 'Rating FIDE aplicable', 'Partidas rapidas'],
    },
  },
  {
    id: 'sumo',
    title: 'Robotica: SumoRobot',
    subtitle: 'Combate autonomo cuerpo a cuerpo',
    description: 'Diseno, ensamblaje y programacion de robots autonomos de combate que deben sacar al oponente del ring.',
    icon: Bot,
    color: 'from-red-500 to-rose-500',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    image: imgSumo,
    details: {
      teams: '3 integrantes max.',
      duration: 'Eliminacion directa',
      criteria: ['Diseno mecanico', 'Autonomia total', 'Peso maximo 500g', 'Dimensiones reglamentarias'],
    },
  },
  {
    id: 'sigue-lineas',
    title: 'Robotica: Sigue Lineas',
    subtitle: 'Velocidad, precision y evasion',
    description: 'Ingenieria de vehiculos autonomos para recorrer circuitos complejos con evasion de obstaculos en el menor tiempo.',
    icon: Route,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    image: imgSigueLineas,
    details: {
      teams: '3 integrantes max.',
      duration: '3 intentos',
      criteria: ['Tiempo de recorrido', 'Precision en curvas', 'Evasion de obstaculos', 'Calibracion de sensores'],
    },
  },
];

const Categorias = () => {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-4 block">Competencias</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight"
          >
            Disciplinas Tecnicas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Cinco categorias disenadas para evaluar habilidades practicas y conocimiento tecnico a nivel profesional.
          </motion.p>
        </div>

        {/* Category Cards Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] max-w-md group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-60 rounded-2xl overflow-hidden mb-6 ring-1 ring-slate-900/5 shadow-sm">
                  {/* Gradient for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent z-10 pointer-events-none" />
                  
                  {/* Hover overlay mix-blend */}
                  <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                  
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-sm border border-white/20">
                    <Icon className={`w-5 h-5 ${cat.textColor}`} strokeWidth={2.5} />
                  </div>
                  
                  {/* Floating Badges */}
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Users className="w-3.5 h-3.5" strokeWidth={2.5} /> {cat.details.teams}
                    </span>
                    <span className="px-3 py-1.5 bg-black/30 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> {cat.details.duration}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 px-1 sm:px-2">
                  <div className="mb-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-sm font-bold text-sky-600/90 tracking-wide uppercase">
                      {cat.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm mb-8 flex-1">
                    {cat.description}
                  </p>

                  <div className="pt-6 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                      Criterios de Evaluación
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                      {cat.details.criteria.map((c) => (
                        <div key={c} className="flex items-start gap-2.5">
                          <Target className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-sm text-slate-700 font-medium leading-tight">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
