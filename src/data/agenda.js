import { Coffee, Award, Flag, Presentation, ClipboardCheck, CheckCircle2, CalendarClock } from 'lucide-react';

const baseSchedule = [
  {
    time: '08:00',
    title: 'Recepción e inscripción',
    desc: 'Registro de los equipos participantes y acreditación.',
    icon: ClipboardCheck,
  },
  {
    time: '09:00',
    title: 'Inicio de los concursos',
    desc: 'Arrancan las competencias de las diferentes categorías en las áreas asignadas.',
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
    title: 'Segunda ronda de participantes',
    desc: 'Continúan las pruebas con la siguiente tanda de equipos.',
    icon: Presentation,
  },
  {
    time: '12:30',
    title: 'Término de la presentación',
    desc: 'Cierre formal de la presentación de prototipos.',
    icon: CheckCircle2,
  },
];

export const agendaDays = [
  {
    id: 'day1',
    tabName: 'Día 1',
    date: '24 de junio de 2026',
    description: 'Recepción, competencias por categoría y cierre de la primera jornada.',
    schedule: [
      ...baseSchedule,
      {
        time: '13:00',
        title: 'Siguiente ronda mañana',
        desc: 'La competencia continúa al día siguiente con la jornada final.',
        icon: CalendarClock,
        isFinal: true,
      },
    ],
  },
  {
    id: 'day2',
    tabName: 'Día 2',
    date: '25 de junio de 2026',
    description: 'Segunda jornada de competencias y entrega de reconocimientos.',
    schedule: [
      ...baseSchedule,
      {
        time: '13:00',
        title: 'Entrega de reconocimientos',
        desc: 'Premiación y reconocimientos a todas las categorías.',
        icon: Award,
        isFinal: true,
      },
    ],
  },
];
