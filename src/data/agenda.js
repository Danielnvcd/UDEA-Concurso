import { Coffee, Award, Flag, Mic, ClipboardCheck, CheckCircle2, CalendarClock, Trophy, Sparkles } from 'lucide-react';

export const agendaDays = [
  {
    id: 'day1',
    tabName: 'Día 1: Pre-Selección',
    date: '17 de julio de 2026',
    description: 'Fase de eliminatorias, presentación de proyectos y selección de los mejores equipos.',
    schedule: [
      {
        time: '08:00',
        title: 'Recepción e inscripción',
        desc: 'Registro y acreditación de los participantes en cada categoría.',
        icon: ClipboardCheck,
      },
      {
        time: '08:30',
        title: 'Inauguración',
        desc: 'Bienvenida y lectura del reglamento del concurso.',
        icon: Sparkles,
      },
      {
        time: '09:00',
        title: 'Primera etapa de competencia',
        desc: 'Arrancan las pruebas en todas las modalidades: Programación, Seguidor de Línea, Innovación Tecnológica, Ajedrez y Minisumo.',
        icon: Flag,
      },
      {
        time: '10:30',
        title: 'Coffee break',
        desc: 'Pausa para refrigerio y networking entre los equipos.',
        icon: Coffee,
      },
      {
        time: '11:00',
        title: 'Segunda etapa de competencia',
        desc: 'Continúan las pruebas en todas las modalidades.',
        icon: Flag,
      },
      {
        time: '12:30',
        title: 'Ganadores virtuales y recomendaciones',
        desc: 'Los jueces anuncian a los participantes que pasan a la final y dan recomendaciones para mejorar sus prototipos.',
        icon: CheckCircle2,
        isFinal: true,
      },
    ],
  },
  {
    id: 'day2',
    tabName: 'Día 2: Gran Final',
    date: '18 de julio de 2026',
    description: 'Combates definitivos, competencias contrarreloj y ceremonia de premiación.',
    schedule: [
      {
        time: '08:00',
        title: 'Recepción e inscripción',
        desc: 'Registro de los finalistas y de los participantes de la modalidad sabatina.',
        icon: ClipboardCheck,
      },
      {
        time: '08:30',
        title: 'Inauguración',
        desc: 'Bienvenida y traslado de los participantes a cada área de competencia.',
        icon: Sparkles,
      },
      {
        time: '09:00',
        title: 'Primera etapa de competencia',
        desc: 'Inicio de la fase final en todas las modalidades.',
        icon: Flag,
      },
      {
        time: '10:30',
        title: 'Coffee break',
        desc: 'Pausa para refrigerio.',
        icon: Coffee,
      },
      {
        time: '11:00',
        title: 'Segunda etapa de competencia',
        desc: 'Deliberación de los jueces para asignar los tres primeros lugares por categoría.',
        icon: Flag,
      },
      {
        time: '12:30',
        title: 'Discurso de cierre',
        desc: 'Agradecimiento y palabras por parte de la coordinación y del comité organizador.',
        icon: Mic,
      },
      {
        time: '13:00',
        title: 'Entrega de premios y reconocimientos',
        desc: 'Premios económicos: 1º $1,000 · 2º $750 · 3º $500. Reconocimiento de participación a todos los concursantes.',
        icon: Trophy,
        isFinal: true,
      },
      {
        time: '14:00',
        title: 'Cierre del evento',
        desc: 'Culmen de la 6ª edición del Concurso IntraUniversitario CIUMeSis 2.0.',
        icon: Award,
        isFinal: true,
      },
    ],
  },
];
