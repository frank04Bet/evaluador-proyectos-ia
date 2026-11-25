// Control principal: conecta el formulario con el resto de módulos
import { $, loadKey, saveKey } from "./utils.js";
import { evaluate } from "./evaluator.js";
import { setLoading, showError, clearOutput, renderResult } from "./ui.js";

$("key").value = loadKey();

$("f").addEventListener("submit", async (e) => {
  e.preventDefault();
  clearOutput();
  setLoading(true);
  try {
    const key = $("key").value.trim();
    saveKey(key);
    const result = await evaluate({ url: $("url").value.trim(), key, model: $("model").value.trim() });
    renderResult(result);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
});
