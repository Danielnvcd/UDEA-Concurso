import { Lightbulb, Code2, Crown, Bot, Route } from 'lucide-react';

import imgInovacion from '../assets/inovacion.jpg';
import imgProgramacion from '../assets/programacion_inicio.jpg';
import imgAjedrez2 from '../assets/ajedres2_inicio.jpg';
import imgSumo from '../assets/sumo_inicio.jpg';
import imgSigueLineas from '../assets/siguelinea_incio.jpg';

// -----------------------------------------------------------------------------
// CATEGORÍAS DEL 6º CONCURSO INTRAUNIVERSITARIO CIUMeSis 2.0
// Resumen basado en las Bases del Concurso 2026.
// -----------------------------------------------------------------------------

export const categories = [
  {
    id: 'programacion',
    title: 'Programación',
    subtitle: 'Resolucion de problemas bajo presion',
    description: 'Desafios de logica matematica y desarrollo de software competitivo bajo estrictos limites de tiempo y recursos.',
    icon: Code2,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    image: imgProgramacion,
    details: {
      teams: '3 integrantes máx.',
      duration: '20 min de presentación',
      criteria: [
        'Innovación del proyecto',
        'Dominio del código',
        'Claridad en la exposición',
      ],
    },
  },
  {
    id: 'sigue-lineas',
    title: 'Seguidor de Línea',
    subtitle: 'Velocidad, precisión y evasión',
    description: 'Robot autónomo que recorre un circuito de línea negra (~38 mm) sobre fondo blanco, detectando y evitando un obstáculo.',
    icon: Route,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    image: imgSigueLineas,
    details: {
      teams: '3 integrantes máx.',
      duration: '2 vueltas en 4 min',
      criteria: [
        'Robot 100% autónomo',
        'Mejor tiempo en 2 rondas',
        'Final en modo persecución',
      ],
    },
  },
  {
    id: 'innovacion',
    title: 'Innovación Tecnológica',
    subtitle: 'Estilo libre con enfoque en IA',
    description: 'Prototipo físico o simulación que resuelva una problemática real, con enfoque en inteligencia artificial y proyectos aplicados.',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    image: imgInovacion,
    details: {
      teams: '3 integrantes máx.',
      duration: '10 min expo + 10 min Q&A',
      criteria: [
        'Innovación e impacto',
        'Utilidad del proyecto',
        'Recursos y costos',
      ],
    },
  },
  {
    id: 'ajedrez',
    title: 'Ajedrez',
    subtitle: 'Analisis, estrategia y anticipacion',
    description: 'Torneo de ajedrez clasico enfocado en el analisis profundo, la estrategia y la capacidad de anticipacion tactica.',
    icon: Crown,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    image: imgAjedrez2,
    details: {
      teams: 'Individual',
      duration: 'Eliminatorias por sorteo',
      criteria: [
        'Reglas oficiales del ajedrez',
        'Modalidad con o sin reloj',
        'Final entre ambas sucursales',
      ],
    },
  },
  {
    id: 'sumo',
    title: 'Minisumo',
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
    title: 'Seguidor de líneas',
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
