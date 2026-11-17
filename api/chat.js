// Función del servidor para el chatbot de CV (Vercel: /api/chat).
// La clave vive en la variable de entorno GEMINI_API_KEY y nunca se manda al navegador.
// Si algo falla, responde con error y el navegador usa el guion de respaldo.

// Modelo principal y de reserva: si uno está saturado (503) o ya no existe (404), se intenta el siguiente.
const MODELS = [process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-lite-latest']
  .filter((m, i, a) => a.indexOf(m) === i);
const TIMEOUT_MS = 7500; // el navegador espera 8 s y luego usa el guion de respaldo
const MAX_TURNS = 12;
const MAX_CHARS = 600;

const BASE = `Eres el asistente de Firme, una página que ayuda a jóvenes de Querétaro a conseguir su primer empleo formal.
Ayudas a armar un primer CV con estudios, trabajos escolares, proyectos y actividades extra.
Reglas:
- Español de México, tuteo, tono cálido y directo. Sin emojis.
- Nunca pidas ni escribas nombre, teléfono, correo, dirección, CURP ni datos sensibles (salud, religión, política, situación migratoria).
- No inventes logros: usa solo lo que la persona dijo. Puedes redactarlo mejor, sin exagerar.
- Usa lenguaje neutro en género: no sabes si la persona es hombre o mujer. Evita palabras como "orgulloso", "interesado" o "bienvenido"; usa "te da orgullo", "te interesa", "te damos la bienvenida".
- Nada de política.`;

const SCHEMA_NEXT = {
  type: 'OBJECT',
  properties: { reply: { type: 'STRING' } },
  required: ['reply'],
};

const SCHEMA_CV = {
  type: 'OBJECT',
  properties: {
    resumen: { type: 'STRING' },
    educacion: { type: 'STRING' },
    proyectos: { type: 'ARRAY', items: { type: 'STRING' } },
    habilidades: { type: 'ARRAY', items: { type: 'STRING' } },
    extras: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['resumen', 'educacion', 'proyectos', 'habilidades', 'extras'],
};

function transcript(history) {
  return history
    .slice(-MAX_TURNS)
    .map((t) => `${t.role === 'bot' ? 'Asistente' : 'Joven'}: ${String(t.text || '').slice(0, MAX_CHARS)}`)
    .join('\n');
}

function buildPrompt(body) {
  const history = Array.isArray(body.history) ? body.history : [];
  if (body.mode === 'cv') {
    return {
      schema: SCHEMA_CV,
      text: `${transcript(history)}

Tarea: con lo que dijo el joven, arma su CV de primer empleo.
- resumen: 2 frases en primera persona, sin nombre.
- educacion: una línea con lo que estudia y el semestre o grado.
- proyectos: 1 a 3 viñetas que empiecen con verbo en pasado ("Armé", "Organicé") y digan qué hizo y con qué herramienta.
- habilidades: 3 a 6 habilidades cortas.
- extras: 0 a 2 viñetas de actividades extra (negocio familiar, voluntariado) redactadas como experiencia.
Usa solo lo que dijo. No agregues habilidades, cualidades, cifras, empresas ni escuelas que no mencionó (por ejemplo, no pongas "trabajo en equipo" si no lo dijo).`,
    };
  }
  const topic = String(body.nextTopic || '').slice(0, 300);
  return {
    schema: SCHEMA_NEXT,
    text: `${transcript(history)}

Tarea: en "reply" escribe máximo 2 frases. Primero reconoce en pocas palabras algo concreto de la última respuesta del joven (sin exagerar). Luego haz UNA pregunta corta sobre este tema: ${topic}`,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'sin_clave' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!['next', 'cv'].includes(body.mode)) return res.status(400).json({ error: 'modo_invalido' });

  const { text, schema } = buildPrompt(body);
  const deadline = Date.now() + TIMEOUT_MS;
  let lastError = 'ia_fallo';
  for (const model of MODELS) {
    const left = deadline - Date.now();
    if (left < 800) { lastError = 'ia_lenta'; break; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), left);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: BASE }] },
          contents: [{ role: 'user', parts: [{ text }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 700,
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        }),
      });
      if (!r.ok) { lastError = `ia_error_${r.status}`; continue; }
      const data = await r.json();
      const out = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
      const parsed = JSON.parse(out);
      return res.status(200).json({ ok: true, model, ...parsed });
    } catch (err) {
      lastError = err?.name === 'AbortError' ? 'ia_lenta' : 'ia_fallo';
    } finally {
      clearTimeout(timer);
    }
  }
  return res.status(504).json({ error: lastError });
}
