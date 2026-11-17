// Datos de EJEMPLO para la demo. La persona, las empresas y las vacantes son ficticias.
// No hay datos de personas entrevistadas en este archivo.

export const PERSONA = {
  nombre: 'Dani',
  descripcion: '20 años, estudia, busca medio tiempo por las tardes, no tiene CV y no sabe cómo sacar su RFC.',
};

export const HORARIOS = ['Mañanas', 'Tardes', 'Noches', 'Fines de semana'];
export const PUESTOS = ['Atención a clientes', 'Administración', 'Almacén y logística', 'Ventas', 'Datos y oficina', 'Cocina y restaurantes'];
export const EMPRESAS = ['Tiendas y autoservicio', 'Manufactura', 'Bancos', 'Hoteles', 'Tecnología', 'Gobierno'];

export const PERFIL_INICIAL = {
  horarios: ['Tardes', 'Fines de semana'],
  puestos: ['Atención a clientes', 'Administración'],
  empresas: ['Tiendas y autoservicio', 'Manufactura'],
};

// Chatbot de CV: la primera pregunta es fija; las demás las redacta la IA según el tema.
// Si la IA falla o tarda más de 8 s, se usa la pregunta guionada.
export const CHAT_TEMAS = [
  {
    tema: 'qué estudia o estudió y en qué semestre o grado va',
    pregunta: 'Para empezar: ¿qué estudias o estudiaste, y en qué semestre vas?',
    ejemplo: 'Estudio la licenciatura en Administración, voy en 4.º semestre',
  },
  {
    tema: 'un proyecto o trabajo escolar que le dé orgullo y qué hizo en ese proyecto',
    pregunta: 'Bien, eso ya es parte de tu CV. Cuéntame de un proyecto o trabajo escolar que te dé orgullo: ¿qué hiciste tú?',
    ejemplo: 'Hicimos un plan de negocio para una cafetería; yo armé el presupuesto en Excel',
  },
  {
    tema: 'qué programas, idiomas o habilidades maneja (por ejemplo Excel, inglés, atención a clientes)',
    pregunta: 'Eso cuenta como experiencia. ¿Qué programas, idiomas o habilidades manejas? Por ejemplo Excel, inglés o atención a clientes.',
    ejemplo: 'Excel intermedio, inglés básico y trato con clientes',
  },
  {
    tema: 'si ha ayudado en un negocio familiar, voluntariado u otra actividad extra, y qué hacía',
    pregunta: 'Muy útil para las vacantes de tu lista. Última: ¿has ayudado en un negocio familiar, voluntariado u otra actividad? Todo cuenta.',
    ejemplo: 'Los fines de semana ayudo en la tienda de mi familia: cobro y acomodo mercancía',
  },
];

// CV de respaldo armado solo con las respuestas, sin IA.
export function cvDeRespaldo(respuestas) {
  const [estudios, proyecto, habilidades, extra] = respuestas;
  const lista = (s) => (s || '').split(/,| y /).map((x) => x.trim()).filter(Boolean);
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  return {
    resumen: 'Estudiante en busca de mi primer empleo formal de medio tiempo. Tengo experiencia práctica en proyectos escolares y me organizo bien con mis horarios.',
    educacion: cap(estudios || 'Estudiante'),
    proyectos: proyecto ? [cap(proyecto)] : [],
    habilidades: lista(habilidades).map(cap).slice(0, 6),
    extras: extra ? [cap(extra)] : [],
  };
}

export const CV_EJEMPLO = cvDeRespaldo(CHAT_TEMAS.map((t) => t.ejemplo));

// Vacantes de ejemplo. formal: 'contrato' | 'practica' | null (no indica contrato ni pago).
export const VACANTES = [
  {
    id: 'v1', titulo: 'Asesor de atención a clientes', empresa: 'Tiendas Altiplano (ejemplo)', zona: 'Centro, Querétaro',
    horario: 'Tardes', horarioTexto: 'Tardes · 24 h', pago: '$8,400 al mes', formal: 'contrato', base: 88, area: 'Atención a clientes', fuente: 'Computrabajo',
    requisitos: ['Bachillerato terminado o en curso', 'Gusto por el trato con clientes', 'Disponibilidad de 4 a 9 pm'],
    prestaciones: ['Contrato escrito', 'Alta en el IMSS desde el primer día', 'Aguinaldo y vacaciones de ley'],
    claves: ['atención a clientes', 'cobro en caja', 'manejo de inventario'],
  },
  {
    id: 'v2', titulo: 'Auxiliar administrativo de medio tiempo', empresa: 'Distribuidora del Bajío (ejemplo)', zona: 'Epigmenio González, Querétaro',
    horario: 'Tardes', horarioTexto: 'Tardes · 20 h', pago: '$7,800 al mes', formal: 'contrato', base: 84, area: 'Administración', fuente: 'Indeed',
    requisitos: ['Estudiante de Administración o afín', 'Excel básico', 'Horario de 3 a 7 pm'],
    prestaciones: ['Contrato por tiempo determinado', 'Alta en el IMSS', 'Horario compatible con escuela'],
    claves: ['Excel', 'presupuestos', 'archivo y captura de datos'],
  },
  {
    id: 'v3', titulo: 'Practicante de análisis de datos', empresa: 'Manufactura Querétaro (ejemplo)', zona: 'Parque industrial, El Marqués',
    horario: 'Mañanas', horarioTexto: 'Mañanas · 30 h', pago: '$6,000 al mes', formal: 'practica', base: 79, area: 'Datos y oficina', fuente: 'LinkedIn',
    requisitos: ['Estudiante de 4.º semestre en adelante', 'Excel intermedio', 'Disponibilidad de 6 meses'],
    prestaciones: ['Beca mensual con pago', 'Convenio con tu escuela', 'Seguro de la escuela'],
    claves: ['Excel intermedio', 'tablas dinámicas', 'reportes'],
  },
  {
    id: 'v4', titulo: 'Cajero de fin de semana', empresa: 'Autoservicio La Cañada (ejemplo)', zona: 'El Pueblito, Corregidora',
    horario: 'Fines de semana', horarioTexto: 'Fines de semana · 16 h', pago: '$5,200 al mes', formal: 'contrato', base: 81, area: 'Ventas', fuente: 'Workday',
    requisitos: ['Mayor de 18 años', 'Manejo de efectivo', 'Sábado y domingo'],
    prestaciones: ['Contrato escrito', 'Alta en el IMSS', 'Prima dominical'],
    claves: ['cobro en caja', 'atención a clientes', 'manejo de efectivo'],
  },
  {
    id: 'v5', titulo: 'Practicante de recursos humanos', empresa: 'Grupo Hotelero Bernal (ejemplo)', zona: 'Juriquilla, Querétaro',
    horario: 'Tardes', horarioTexto: 'Tardes · 20 h', pago: '$5,500 al mes', formal: 'practica', base: 74, area: 'Administración', fuente: 'LinkedIn',
    requisitos: ['Estudiante de Administración o Psicología', 'Organización', 'Excel básico'],
    prestaciones: ['Beca mensual con pago', 'Constancia de prácticas'],
    claves: ['organización', 'Excel', 'trato con personas'],
  },
  {
    id: 'v6', titulo: 'Ayudante general de almacén', empresa: 'Logística Querétaro Norte (ejemplo)', zona: 'Parque industrial, El Marqués',
    horario: 'Noches', horarioTexto: 'Noches · 40 h', pago: '$9,600 al mes', formal: 'contrato', base: 70, area: 'Almacén y logística', fuente: 'Indeed',
    requisitos: ['Disponibilidad nocturna', 'Trabajo en equipo'],
    prestaciones: ['Contrato escrito', 'Alta en el IMSS', 'Transporte de personal'],
    claves: ['inventario', 'trabajo en equipo'],
  },
];

// Vacantes que el filtro de formalidad oculta (no indican contrato ni pago fijo).
export const INFORMALES = [
  { id: 'i1', titulo: 'Ayudante de mostrador', empresa: 'Negocio local (ejemplo)', zona: 'Centro, Querétaro', horario: 'Tardes', nota: '«Pago por día, sin contrato»' },
  { id: 'i2', titulo: 'Vendedor por comisión', empresa: 'Anuncio sin empresa (ejemplo)', zona: 'Querétaro', horario: 'Tardes', nota: '«Solo comisiones, sin sueldo base»' },
  { id: 'i3', titulo: 'Mesero de eventos', empresa: 'Anuncio en redes (ejemplo)', zona: 'Juriquilla, Querétaro', horario: 'Fines de semana', nota: 'No dice si hay contrato ni seguro' },
];
export const INFORMALES_TOTAL = 14; // vacantes informales descartadas hoy en la demo

export const FUENTES = ['LinkedIn', 'Indeed', 'Computrabajo', 'Workday'];

// Solicitudes previas de la persona de ejemplo para el tablero de seguimiento.
export const SOLICITUDES_PREVIAS = [
  {
    id: 's1', titulo: 'Auxiliar de recepción', empresa: 'Hotel Arcos del Centro (ejemplo)', formal: 'contrato', current: 3,
    nota: 'Recibiste una oferta con contrato. Revisa los papeles que te piden.', tipo: 'oferta',
  },
  {
    id: 's2', titulo: 'Practicante de compras', empresa: 'Autopartes del Centro (ejemplo)', formal: 'practica', current: 2,
    nota: 'Entrevista el jueves a las 16:00. Te recordamos un día antes.', tipo: 'entrevista',
  },
  {
    id: 's3', titulo: 'Capturista de datos', empresa: 'Servicios Contables QRO (ejemplo)', formal: 'contrato', current: 0,
    nota: 'No han respondido en 14 días. ¿Les escribimos?', tipo: 'sin-respuesta', dias: 14,
  },
];

// Métricas: la línea base es real (trabajo de campo del equipo). Lo demás es SIMULADO.
export const LINEA_BASE = [
  { dato: 'La mayoría consiguió su primer empleo en menos de tres meses.', fuente: 'Entrevistas de campo del equipo (23), Querétaro, nov 2026' },
  { dato: 'Más de la mitad entró a ese primer empleo sin contrato ni seguro.', fuente: 'Entrevistas de campo del equipo (23), Querétaro, nov 2026' },
];

export const METRICAS_SIMULADAS = {
  30: { formal: 12, practica: 6, ingreso: 4, respuesta: 38, dias: 9 },
  60: { formal: 27, practica: 9, ingreso: 6, respuesta: 41, dias: 8 },
  90: { formal: 41, practica: 11, ingreso: 8, respuesta: 44, dias: 7 },
};
