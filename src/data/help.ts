import type { ModuleDef } from '@/config';

interface HelpEntry {
  slug: string;
  title: string;
  body: string;
}

export const HELP_TEXTS: Record<string, HelpEntry> = {
  datos: {
    slug: 'datos',
    title: 'Datos generales del proyecto',
    body: 'Aquí registras la información básica de tu proyecto: nombre, sector, entidad formuladora, departamento, municipio, año de inicio y horizonte de evaluación. El horizonte es el número de años durante los cuales vas a evaluar los costos y beneficios del proyecto. El año 0 corresponde a la inversión inicial.',
  },
  participantes: {
    slug: 'participantes',
    title: 'Participantes y stakeholders',
    body: 'Identifica a las personas, comunidades y entidades que participan o se ven afectadas por el proyecto. Cada participante tiene un rol (lo que hace en relación con el proyecto), una expectativa (lo que espera o aporta) y una postura (a favor, neutral o en contra). Esto te ayuda a entender a quién involucrar y cómo gestionar los intereses de cada actor.',
  },
  poblacion: {
    slug: 'poblacion',
    title: 'Población afectada vs. objetivo',
    body: 'La población afectada son las personas que actualmente sufren el problema. La población objetivo son las que se beneficiarán directamente con el proyecto. Registra la cantidad, la unidad (personas, familias, viviendas) y la fuente de los datos. También describe sus características socioeconómicas para entender el contexto.',
  },
  problema: {
    slug: 'problema',
    title: 'Árbol de problemas',
    body: 'El árbol de problemas organiza visualmente el problema central, sus causas y sus efectos. El tronco es el problema central. Las raíces son las causas: las directas (nivel 1) conectan con el problema, y las indirectas (nivel 2) conectan con las causas directas. Las ramas son los efectos: directos (nivel 1), indirectos (nivel 2) y finales (nivel 3). Esta estructura te ayuda a entender por qué existe el problema y qué consecuencias genera.',
  },
  objetivos: {
    slug: 'objetivos',
    title: 'Árbol de objetivos',
    body: 'El árbol de objetivos se deriva del árbol de problemas transformando el lenguaje negativo en positivo. El problema central se convierte en el objetivo general. Las causas se convierten en objetivos específicos y medios. Los efectos se convierten en fines. Puedes editar manualmente los textos que necesites ajustar; los nodos editados no se sobrescriben al regenerar automáticamente.',
  },
  mercado: {
    slug: 'mercado',
    title: 'Análisis de mercado',
    body: 'El análisis de mercado estudia la oferta (cuánto se produce actualmente), la demanda (cuánto se necesita o consume) y el déficit (demanda menos oferta). Un déficit positivo significa demanda insatisfecha. Proyecta ambos valores año a año con una tasa de crecimiento para estimar el mercado futuro del bien o servicio que generará el proyecto.',
  },
  'cadena-valor': {
    slug: 'cadena-valor',
    title: 'Cadena de valor',
    body: 'La cadena de valor conecta cada objetivo específico con sus productos y actividades. Un producto es el bien o servicio que entrega el proyecto. Una actividad es lo que hay que hacer para producir ese producto. Cada actividad tiene líneas de costo (mano de obra, materiales, equipos, servicios) que se suman para calcular la inversión y los costos de operación.',
  },
  riesgos: {
    slug: 'riesgos',
    title: 'Identificación de riesgos',
    body: 'Un riesgo es un evento incierto que puede afectar el proyecto. Se identifican en cuatro niveles: fin, propósito, componente y actividad. Cada riesgo se evalúa por su probabilidad (1 a 5) y su impacto (1 a 5). El producto de ambos da una magnitud que ayuda a priorizar. Para cada riesgo se describe su efecto y las medidas de mitigación propuestas.',
  },
  ingresos: {
    slug: 'ingresos',
    title: 'Ingresos y beneficios',
    body: 'Aquí registras los ingresos y beneficios del proyecto a lo largo del horizonte. Cada línea tiene una cantidad por año, un valor unitario y una tasa de crecimiento. Los ingresos son recursos monetarios que genera el proyecto. Los beneficios son valoraciones económicas de efectos positivos que no necesariamente son dinero en efectivo.',
  },
  flujo: {
    slug: 'flujo',
    title: 'Flujo de caja y evaluación',
    body: 'El flujo de caja consolida costos y beneficios año a año. Con ese flujo se calculan los indicadores de viabilidad: el VPN (Valor Presente Neto) trae todos los flujos a valor presente descontándolos por una tasa; la TIR (Tasa Interna de Retorno) es la tasa que hace el VPN igual a cero; la relación Beneficio/Costo compara el valor presente de beneficios y costos. Un VPN positivo y una TIR mayor que la tasa de descuento indican viabilidad.',
  },
  indicadores: {
    slug: 'indicadores',
    title: 'Indicadores y marco lógico',
    body: 'El marco lógico organiza el proyecto en cuatro niveles: fin, propósito, componente y actividad. Cada nivel tiene un nombre, un indicador medible, su fórmula de cálculo, la unidad, la línea base (valor inicial), la meta (valor esperado), los medios de verificación y los supuestos. Los supuestos son condiciones externas que deben cumplirse para alcanzar el resultado.',
  },
  financiacion: {
    slug: 'financiacion',
    title: 'Financiación',
    body: 'Define las fuentes de financiación del proyecto: recursos de la Nación, departamento, municipio, Sistema General de Regalías (SGR), sector privado, cooperación internacional o recursos propios. Para cada fuente registra los montos por año. La suma de todas las fuentes debe cubrir los costos del proyecto en cada año.',
  },
  cronograma: {
    slug: 'cronograma',
    title: 'Cronograma del proyecto',
    body: 'El cronograma programa las actividades del proyecto en el tiempo. Cada actividad tiene un mes de inicio y una duración en meses. El mes 1 corresponde al primer mes del proyecto. El cronograma te permite visualizar la secuencia de actividades, identificar el camino crítico y estimar el tiempo total de ejecución.',
  },
  resumen: {
    slug: 'resumen',
    title: 'Resumen ejecutivo',
    body: 'El resumen ejecutivo consolida toda la formulación: el problema central, el objetivo general, los beneficios esperados, los costos totales, las fuentes de financiación y los indicadores de viabilidad (VPN, TIR, B/C). Es la primera página que leerá quien evalúe el proyecto, por lo que debe ser claro y conciso.',
  },
};

export function getHelpText(slug: string): HelpEntry | undefined {
  return HELP_TEXTS[slug];
}

export function getHelpForModule(mod: ModuleDef): { title: string; body: string } {
  const entry = HELP_TEXTS[mod.slug];
  if (entry) return { title: entry.title, body: entry.body };
  return { title: mod.helpTitle, body: mod.helpText };
}
