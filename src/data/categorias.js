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
    subtitle: 'Algoritmos y resolución de problemas',
    description: 'Demuestra tus habilidades de programación, análisis y desarrollo de algoritmos resolviendo una problemática con una propuesta novedosa.',
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
    subtitle: 'Estrategia y habilidad mental',
    description: 'Torneo individual de ajedrez bajo las reglas oficiales del juego, con eliminatorias por sorteo entre ambas sucursales.',
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
    title: 'Minisumo (Sumobot)',
    subtitle: 'Combate autónomo en el dohyo',
    description: 'Robot minisumo autónomo cuyo objetivo es sacar al contrincante del dohyo de ~50 cm de diámetro.',
    icon: Bot,
    color: 'from-red-500 to-rose-500',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    image: imgSumo,
    details: {
      teams: '3 integrantes máx.',
      duration: '3 rondas en 3 min',
      criteria: [
        'Máx. 10 × 10 × 10 cm / 500 g',
        'Robot 100% autónomo',
        'Sistema de puntos "Yuko"',
      ],
    },
  },
];
