import { Clock, Flag, Coffee, Award, Mic, Swords, Presentation, Users, Trophy } from 'lucide-react';

// -----------------------------------------------------------------------------
// ARCHIVO DE CONFIGURACIÓN DE LA AGENDA
// Aquí puedes modificar los días, horarios, títulos, descripciones e iconos
// de los eventos. 
// Iconos disponibles (puedes importar más de lucide-react arriba):
// Clock, Flag, Coffee, Award, Mic, Swords, Presentation, Users, Trophy
// -----------------------------------------------------------------------------

export const agendaDays = [
  {
    id: 'day1',
    tabName: 'Día 1: Pre-Selección',
    date: '19 de junio de 2026',
    description: 'Fase de eliminatorias, presentación de proyectos y selección de los mejores equipos.',
    schedule: [
      { time: '08:00', title: 'Registro de Equipos', desc: 'Confirmación de asistencia, revisión técnica y asignación de mesas.', icon: Clock },
      { time: '09:30', title: 'Apertura del Evento', desc: 'Bienvenida oficial y explicación de las reglas de las eliminatorias.', icon: Mic },
      { time: '10:00', title: 'Presentación de Proyectos', desc: 'Los equipos muestran sus avances ante los jueces y el público.', icon: Presentation },
      { time: '13:00', title: 'Receso y Comida', desc: 'Tiempo libre para descansar y hacer networking.', icon: Coffee },
      { time: '14:30', title: 'Rondas Eliminatorias', desc: 'Pruebas preliminares en pista y validación de autonomía.', icon: Flag },
      { time: '17:30', title: 'Anuncio de Finalistas', desc: 'Selección oficial de los equipos que pasan al Día 2.', icon: Users, isFinal: true },
    ]
  },
  {
    id: 'day2',
    tabName: 'Día 2: Gran Final',
    date: '20 de junio de 2026',
    description: 'Combates definitivos, competencias contrarreloj y ceremonia de premiación.',
    schedule: [
      { time: '09:00', title: 'Recepción de Finalistas', desc: 'Ingreso a la arena principal y calibración final de equipos.', icon: Clock },
      { time: '10:00', title: 'Inicio del Torneo Final', desc: 'Arrancan los enfrentamientos directos en todas las categorías.', icon: Swords },
      { time: '14:00', title: 'Receso y Exhibiciones', desc: 'Pausa para comida. Área de demostraciones tecnológicas abierta.', icon: Coffee },
      { time: '15:30', title: 'Rondas de Campeonato', desc: 'Las finales absolutas por el primer lugar de cada disciplina.', icon: Trophy },
      { time: '18:00', title: 'Premiación y Clausura', desc: 'Entrega de trofeos, reconocimientos a los ganadores y cierre del evento.', icon: Award, isFinal: true },
    ]
  }
];
