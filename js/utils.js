// Funciones auxiliares reutilizables

export const $ = (id) => document.getElementById(id);

// Evita que texto devuelto por la IA se interprete como HTML
export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Extrae usuario y repositorio de cualquier enlace de GitHub
export function parseRepo(url) {
  const m = url.match(/github\.com\/([\w.-]+)\/([\w.-]+)/i);
  if (!m) throw new Error("Ese enlace no parece un repositorio de GitHub.");
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

// Redondea a 1 decimal
export const round1 = (n) => Math.round(n * 10) / 10;

// Guardado de la clave en el navegador (con try/catch por si está bloqueado)
export const loadKey = () => {
  try { return localStorage.getItem("gemini_key") || ""; } catch { return ""; }
};
export const saveKey = (k) => {
  try { localStorage.setItem("gemini_key", k); } catch {}
};
