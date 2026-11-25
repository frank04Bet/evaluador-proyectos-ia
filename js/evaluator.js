// Criterios y calificaciones: la rúbrica y el cálculo de la nota final
import { collectRepo } from "./github.js";
import { askGemini } from "./gemini.js";
import { round1 } from "./utils.js";

// Edita este texto para adaptar la rúbrica a tu curso
export const SYSTEM = `Eres un evaluador académico estricto pero justo de proyectos de software con inteligencia artificial.
Evalúas SOLO con la evidencia del repositorio. Si algo no aparece, no lo inventes: penalízalo y dilo.
Califica cada criterio de 0 a 20. Criterios:
1. ia: uso real de IA/ML (modelo, datos, entrenamiento, API de IA) y qué tan central es.
2. codigo: calidad, claridad y organización.
3. documentacion: README, instalación, uso, licencia.
4. estructura: carpetas, dependencias, reproducibilidad.
5. innovacion: originalidad, utilidad e impacto.
6. practicas: commits, pruebas, manejo de secretos, mantenimiento.
Responde ÚNICAMENTE con JSON válido, sin markdown:
{"proyecto":"","resumen":"2 frases","criterios":[{"id":"ia","nombre":"Uso de IA","nota":0,"comentario":""}, ...los 6],"fortalezas":["",""],"mejoras":["",""],"veredicto":"1 frase"}
Escribe en español.`;

// La nota final es el promedio de los criterios (la calcula el código, no la IA)
export const finalGrade = (criterios) =>
  round1(criterios.reduce((sum, c) => sum + c.nota, 0) / criterios.length);

export async function evaluate({ url, key, model }) {
  const evidence = await collectRepo(url);
  const result = await askGemini({ key, model, system: SYSTEM, evidence });
  return { ...result, notaFinal: finalGrade(result.criterios) };
}
