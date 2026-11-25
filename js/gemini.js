// Conexión con Gemini: envía la evidencia y devuelve la respuesta en JSON
export async function askGemini({ key, model, system, evidence }) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: evidence }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 4000 },
      }),
    }
  );
  const data = await r.json();

  if (!r.ok) {
    throw new Error(
      r.status === 404 ? "Modelo no encontrado. Cambia el nombre del modelo."
      : r.status === 429 ? "Límite gratuito alcanzado. Espera un minuto e intenta de nuevo."
      : data.error?.message || "Error del agente de IA"
    );
  }

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "").join("")
    .replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}
