import { Lightbulb, Code2, Crown, Bot, Route } from 'lucide-react';

import imgInovacion from '../assets/inovacion.jpg';
import imgProgramacion from '../assets/programacion_inicio.jpg';
import imgAjedrez2 from '../assets/ajedres2_inicio.jpg';
import imgSumo from '../assets/sumo_inicio.jpg';
import imgSigueLineas from '../assets/siguelinea_incio.jpg';
// imgSigueLinea2 was imported in the component but unused, so we omit it or keep it if needed
import imgSigueLinea2 from '../assets/siguelinea_incio.jpg';

// -----------------------------------------------------------------------------
// ARCHIVO DE CONFIGURACIÓN DE CATEGORÍAS
// Aquí puedes modificar los nombres, descripciones, requisitos y criterios
// de las categorías del evento.
// -----------------------------------------------------------------------------

export const categories = [
  {
    id: 'innovacion',
    title: 'Innovación Tecnológica IA',
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
    title: 'Programación',
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
      duration: '30 min por partida',
      criteria: ['Sistema suizo', 'Puntos de Buchholz', 'Rating FIDE aplicable', 'Partidas rapidas'],
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
