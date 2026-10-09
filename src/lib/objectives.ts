/**
 * Generador del árbol de objetivos (determinista, sin IA).
 * Transforma el árbol de problemas en objetivos convirtiendo
 * el lenguaje negativo a positivo mediante reglas lingüísticas.
 */

import type {
  ProblemTree,
  ObjectiveTree,
  ObjectiveNode,
  ProblemNode,
} from '@/data/schema';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface ToPositiveResult {
  text: string;
  confidence: 'high' | 'low';
  ruleId: string;
}

// ---- Excepciones de género ----

const MASCULINE_ENDING_EXCEPTIONS = new Set([
  'problema', 'programa', 'sistema', 'mapa', 'dia', 'tema', 'esquema', 'clima', 'idioma',
]);

const FEMININE_ENDING_EXCEPTIONS = new Set([
  'mano', 'foto', 'moto',
]);

const INVARIABLE_PLURALS = new Set(['crisis', 'analisis', 'tesis']);

// Palabras que empiezan con artículo o artículo + sustantivo no necesitan otro artículo
const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas']);

/**
 * Determina el artículo (el/la/los/las) para el RESTO del texto.
 * Toma la primera palabra como núcleo.
 */
function getArticle(resto: string): string {
  const trimmed = resto.trim();
  if (trimmed === '') return '';

  const firstWord = trimmed.split(/\s+/)[0].toLowerCase();
  // Si ya empieza con artículo, no agregar
  if (ARTICLES.has(firstWord)) return '';

  const isPlural = firstWord.endsWith('s') && !INVARIABLE_PLURALS.has(firstWord);

  // Excepciones de género femenino terminadas en "o"
  if (FEMININE_ENDING_EXCEPTIONS.has(firstWord)) {
    return isPlural ? 'las' : 'la';
  }

  // Excepciones de género masculino (terminan en "a" pero son masculinos)
  if (MASCULINE_ENDING_EXCEPTIONS.has(firstWord)) {
    return isPlural ? 'los' : 'el';
  }

  // Reglas generales
  if (isPlural) {
    return firstWord.endsWith('a') || firstWord.endsWith('ion') ||
      firstWord.endsWith('dad') || firstWord.endsWith('tad') ||
      firstWord.endsWith('tud') || firstWord.endsWith('umbre')
      ? 'las'
      : 'los';
  }

  // Singular
  if (
    firstWord.endsWith('a') ||
    firstWord.endsWith('ion') ||
    firstWord.endsWith('dad') ||
    firstWord.endsWith('tad') ||
    firstWord.endsWith('tud') ||
    firstWord.endsWith('umbre')
  ) {
    return 'la';
  }
  return 'el';
}

/** Capitaliza la primera letra */
function capitalize(s: string): string {
  if (s.length === 0) return s;
  return s[0].toUpperCase() + s.slice(1);
}

/** Convierte solo la primera letra a minúscula */
function lowerFirst(s: string): string {
  if (s.length === 0) return s;
  return s[0].toLowerCase() + s.slice(1);
}

/** Inserta el artículo después del verbo, respetando el resto */
function buildVerbPhrase(verb: string, resto: string): string {
  const art = getArticle(resto);
  if (art === '') {
    return `${verb} ${resto}`;
  }
  return `${verb} ${art} ${resto}`;
}

// Diccionario de antónimos nominales (regla 9)
// Keys are normalized (no accents) for matching; values preserve accents for output
const ANTONYMS: Record<string, { word: string; article: string }> = {
  desmotivacion: { word: 'motivación', article: 'la' },
  desinteres: { word: 'interés', article: 'el' },
  desempleo: { word: 'empleo', article: 'el' },
  desorganizacion: { word: 'organización', article: 'la' },
  desconfianza: { word: 'confianza', article: 'la' },
};

// Normaliza texto: minúsculas sin acentos para matching
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Transforma un texto de problema a su forma positiva (objetivo).
 * Las reglas se evalúan en orden; gana la primera que coincida.
 * No distingue mayúsculas; conserva el resto del texto.
 */
export function toPositive(text: string): ToPositiveResult {
  const raw = text.trim();
  if (raw === '') return { text: '', confidence: 'low', ruleId: 'empty' };

  const norm = normalize(raw);

  // --- Regla 1: Déficit de cantidad al inicio ---
  const deficitQtyStart = /^(baja|bajo|bajas|bajos|poca|poco|pocas|pocos|escasa|escaso|escasas|escasos|limitada|limitado|limitadas|limitados|reducida|reducido|insuficiente|insuficientes)\b/i;
  {
    const m = norm.match(deficitQtyStart);
    if (m) {
      const resto = raw.slice(m[0].length).trim();
      const phrase = buildVerbPhrase('Aumentar', resto);
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r1_deficit_qty_start' };
    }
  }

  // --- Regla 2: Déficit de calidad al inicio ---
  const deficitQualStart = /^(deficiente|deficientes|inadecuada|inadecuado|inadecuadas|inadecuados|mala|malo|malas|malos|precaria|precario|obsoleta|obsoleto)\b/i;
  {
    const m = norm.match(deficitQualStart);
    if (m) {
      const resto = raw.slice(m[0].length).trim();
      const phrase = buildVerbPhrase('Mejorar', resto);
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r2_deficit_qual_start' };
    }
  }

  // --- Regla 3: Exceso al inicio ---
  const excessStart = /^(alta|alto|altas|altos|elevada|elevado|excesiva|excesivo)\b/i;
  {
    const m = norm.match(excessStart);
    if (m) {
      const resto = raw.slice(m[0].length).trim();
      const phrase = buildVerbPhrase('Disminuir', resto);
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r3_excess_start' };
    }
  }

  // --- Regla 4: Calificador de calidad al final ---
  const qualQualEnd = /\b(deficiente|deficientes|inadecuado|inadecuada|inadecuados|inadecuadas|precario|precaria|precarios|precarias)\s*$/i;
  {
    const m = norm.match(qualQualEnd);
    if (m && m.index !== undefined && m.index > 0) {
      const resto = raw.slice(0, m.index).trim();
      const phrase = buildVerbPhrase('Mejorar', lowerFirst(resto));
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r4_qual_qual_end' };
    }
  }

  // --- Regla 5: Calificador de cantidad al final ---
  const qualQtyEnd = /\b(insuficiente|insuficientes|limitado|limitada|limitados|limitadas)\s*$/i;
  {
    const m = norm.match(qualQtyEnd);
    if (m) {
      const resto = raw.slice(0, m.index).trim();
      const phrase = buildVerbPhrase('Aumentar', lowerFirst(resto));
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r5_qual_qty_end' };
    }
  }

  // --- Regla 6: Complejidad al final ---
  const complexEnd = /\b(complejo|compleja|complejos|complejas)\s*$/i;
  {
    const m = norm.match(complexEnd);
    if (m) {
      const resto = raw.slice(0, m.index).trim();
      const phrase = buildVerbPhrase('Simplificar', lowerFirst(resto));
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r6_complex_end' };
    }
  }

  // --- Regla 7: Dificultad para|de|en ---
  {
    const m = raw.match(/^(dificultad|dificultades)\s+(para|de|en)\s+(.+)$/i);
    if (m) {
      const isPlural = normalize(m[1]) === 'dificultades';
      const prep = m[2];
      const resto = lowerFirst(m[3]);
      const noun = isPlural ? 'las dificultades' : 'la dificultad';
      const text = `Disminuir ${noun} ${prep} ${resto}`;
      return { text: capitalize(text), confidence: 'high', ruleId: 'r7_dificultad' };
    }
  }

  // --- Regla 8: Desconocimiento de|sobre ---
  {
    const m = raw.match(/^desconocimiento\s+(de|sobre)\s+(.+)$/i);
    if (m) {
      const prep = m[1];
      const resto = lowerFirst(m[2]);
      const text = `Aumentar el conocimiento ${prep} ${resto}`;
      return { text: capitalize(text), confidence: 'high', ruleId: 'r8_desconocimiento' };
    }
  }

  // --- Regla 9: Diccionario de antónimos nominales ---
  {
    for (const [key, val] of Object.entries(ANTONYMS)) {
      const antonymNorm = key;
      if (norm.startsWith(antonymNorm + ' ') || norm === antonymNorm) {
        const resto = raw.slice(antonymNorm.length).trim();
        const text = resto
          ? `Aumentar ${val.article} ${val.word} ${resto}`
          : `Aumentar ${val.article} ${val.word}`;
        return { text: capitalize(text), confidence: 'high', ruleId: 'r9_antonym' };
      }
    }
  }

  // --- Regla 10: Falta|Ausencia|Carencia de ---
  {
    const m = raw.match(/^(falta|ausencia|carencia)\s+de\s+(.+)$/i);
    if (m) {
      const resto = lowerFirst(m[2]);
      const text = `Contar con ${resto}`;
      return { text: capitalize(text), confidence: 'high', ruleId: 'r10_falta' };
    }
  }

  // --- Regla 11: Aumento de|del|de la|de los|de las ---
  {
    const m = raw.match(/^aumento\s+(de|del|de\s+la|de\s+los|de\s+las)\s+(.+)$/i);
    if (m) {
      const artGroup = m[1].trim();
      const resto = lowerFirst(m[2]);
      // "Aumento de la pobreza" → "Reducir la pobreza"
      // "Aumento del desempleo" → "Reducir el desempleo"
      // Extraer artículo del grupo o calcularlo
      const artMatch = artGroup.match(/^de\s+(el|la|los|las)$/);
      let text: string;
      if (artMatch) {
        text = `Reducir ${artMatch[1]} ${resto}`;
      } else {
        // "Aumento de X" → calcular artículo de X
        const art = getArticle(resto);
        text = art ? `Reducir ${art} ${resto}` : `Reducir ${resto}`;
      }
      return { text: capitalize(text), confidence: 'high', ruleId: 'r11_aumento' };
    }
  }

  // --- Regla 12: Reducciones ---
  {
    // "Pérdida(s) de X" → "Reducir las pérdidas de X"
    const m1 = norm.match(/^perdida(s)?\s+de\s+(.+)$/i);
    if (m1) {
      const isPlural = norm.startsWith('perdidas');
      // Extract resto from raw using the match position
      const fullMatchEnd = norm.indexOf(m1[2]);
      const resto = lowerFirst(raw.slice(fullMatchEnd).trim());
      const noun = isPlural ? 'las pérdidas' : 'la pérdida';
      const text = `Reducir ${noun} de ${resto}`;
      return { text: capitalize(text), confidence: 'high', ruleId: 'r12_perdida' };
    }

    // "Deterioro de X" → "Mejorar X" con artículo
    const m2 = norm.match(/^deterioro\s+de\s+(.+)$/i);
    if (m2) {
      const restoStart = norm.indexOf(m2[1]);
      const resto = lowerFirst(raw.slice(restoStart).trim());
      const phrase = buildVerbPhrase('Mejorar', resto);
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r12_deterioro' };
    }

    // "Incremento de X" → "Reducir X" con artículo
    const m3 = norm.match(/^incremento\s+de\s+(.+)$/i);
    if (m3) {
      const restoStart = norm.indexOf(m3[1]);
      const resto = lowerFirst(raw.slice(restoStart).trim());
      const phrase = buildVerbPhrase('Reducir', resto);
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r12_incremento' };
    }

    // "Mortalidad|Deserción|Contaminación|Pobreza|Desigualdad|Desempleo" → "Reducir" + artículo + frase
    const m4 = norm.match(/^(mortalidad|desercion|contaminacion|pobreza|desigualdad|desempleo)\b(.*)$/i);
    if (m4) {
      const restoNorm = m4[2].trim();
      // Extract the original (accented) version
      const keywordEnd = norm.length - restoNorm.length;
      const originalKeyword = raw.slice(0, keywordEnd).trim();
      const originalResto = lowerFirst(raw.slice(keywordEnd).trim());
      const art = getArticle(originalKeyword + ' ' + originalResto);
      const phrase = originalResto
        ? `Reducir ${art} ${lowerFirst(originalKeyword)} ${originalResto}`
        : `Reducir ${art} ${lowerFirst(originalKeyword)}`;
      return { text: capitalize(phrase), confidence: 'high', ruleId: 'r12_reducir' };
    }
  }

  // --- Regla 13: Sin coincidencia ---
  return {
    text: `Superar: ${raw}`,
    confidence: 'low',
    ruleId: 'r13_fallback',
  };
}

// ---- Mapeo de tipos de nodo ----

function mapNodeType(node: ProblemNode): ObjectiveNode['type'] {
  switch (node.type) {
    case 'problema': return 'general';
    case 'causa':
      if (node.level === 1) return 'especifico';
      return 'medio';
    case 'efecto':
      if (node.level === 1) return 'fin_directo';
      if (node.level === 2) return 'fin_indirecto';
      return 'fin_ultimo';
  }
}

/**
 * Genera el árbol de objetivos a partir del árbol de problemas.
 * Si se pasa `previous`, conserva los nodos con manuallyEdited = true.
 */
export function generateObjectiveTree(
  problemTree: ProblemTree,
  previous?: ObjectiveTree,
): ObjectiveTree {
  // Mapear nodos del problema → nuevos nodos de objetivo
  const prevBySource = new Map<string, ObjectiveNode>();
  if (previous) {
    for (const node of previous.nodes) {
      prevBySource.set(node.sourceNodeId, node);
    }
  }

  const newNodes: ObjectiveNode[] = problemTree.nodes.map((pNode, index) => {
    const prev = prevBySource.get(pNode.id);
    const type = mapNodeType(pNode);

    if (prev && prev.manuallyEdited) {
      return {
        ...prev,
        type,
        parentId: null, // se resolverá después
        order: index,
        needsReview: false,
      };
    }

    const result = toPositive(pNode.text);
    return {
      id: prev?.id ?? generateId(),
      sourceNodeId: pNode.id,
      type,
      parentId: null,
      text: result.text,
      order: index,
      manuallyEdited: false,
      needsReview: result.confidence === 'low',
    };
  });

  // Resolver parentIds: el parentId del objetivo es el id del nodo objetivo
  // cuyo sourceNodeId coincide con el parentId del nodo problema correspondiente
  const sourceToObjId = new Map<string, string>();
  for (const node of newNodes) {
    sourceToObjId.set(node.sourceNodeId, node.id);
  }

  for (let i = 0; i < newNodes.length; i++) {
    const pNode = problemTree.nodes[i];
    if (pNode.parentId) {
      newNodes[i].parentId = sourceToObjId.get(pNode.parentId) ?? null;
    }
  }

  return {
    nodes: newNodes,
    generatedAt: new Date().toISOString(),
  };
}
