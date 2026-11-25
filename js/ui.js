// Mostrar resultados en pantalla
import { $, esc } from "./utils.js";

export function setLoading(on) {
  $("go").disabled = on;
  $("go").textContent = on ? "Analizando el repositorio…" : "Evaluar proyecto";
}

export const showError = (msg) => { $("err").textContent = msg ? "No se pudo evaluar: " + msg : ""; };
export const clearOutput = () => { $("out").innerHTML = ""; showError(""); };

export function renderResult(d) {
  $("out").innerHTML = `
    <div class="hero">
      <div class="score">${d.notaFinal}<small>/20</small></div>
      <div><h2>${esc(d.proyecto)}</h2><p>${esc(d.resumen)}</p></div>
    </div>
    ${d.criterios.map((c) => `
      <div class="crit">
        <div class="row"><span>${esc(c.nombre)}</span><span>${c.nota}/20</span></div>
        <div class="bar"><i style="width:${c.nota * 5}%"></i></div>
        <p>${esc(c.comentario)}</p>
      </div>`).join("")}
    <div class="cols">
      <div><h3>Fortalezas</h3><ul>${d.fortalezas.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><h3>Qué mejorar</h3><ul>${d.mejoras.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    </div>
    <div class="verdict">${esc(d.veredicto)}</div>`;
}
