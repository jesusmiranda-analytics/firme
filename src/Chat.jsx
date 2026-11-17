import { useEffect, useRef, useState } from 'react';
import { Button } from './firme.jsx';
import Mascota from './Mascota.jsx';
import CvVista from './CvVista.jsx';
import { CHAT_TEMAS, PERSONA, cvDeRespaldo } from './data.js';

const LIMITE_MS = 8000; // RF-04: si la IA tarda más, sigue el guion de respaldo

async function llamarIA(payload) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), LIMITE_MS);
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d && d.ok ? d : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const esLista = (x) => Array.isArray(x) && x.every((s) => typeof s === 'string');
function cvValido(d) {
  return d && typeof d.resumen === 'string' && typeof d.educacion === 'string' && esLista(d.proyectos) && esLista(d.habilidades) && esLista(d.extras);
}

export default function Chat({ onListo, cv, setCv }) {
  const [mensajes, setMensajes] = useState(() => [
    { role: 'bot', text: `Hola, ${PERSONA.nombre}. Vamos a armar tu CV con lo que ya hiciste en la escuela y fuera de ella. Son 4 preguntas.` },
    { role: 'bot', text: CHAT_TEMAS[0].pregunta },
  ]);
  const [paso, setPaso] = useState(cv ? CHAT_TEMAS.length : 0);
  const [estado, setEstado] = useState(cv ? 'listo' : 'inicio'); // inicio | esperando | pensando | escribiendo | listo
  const [texto, setTexto] = useState('');
  const [fuente, setFuente] = useState(cv?.fuente || null); // 'ia' | 'respaldo'
  const fin = useRef(null);

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensajes, estado]);

  const respuestas = mensajes.filter((m) => m.role === 'user').map((m) => m.text);

  async function enviar(valor) {
    const limpio = valor.trim().slice(0, 400);
    if (!limpio || estado === 'pensando' || estado === 'escribiendo' || paso >= CHAT_TEMAS.length) return;
    const historial = [...mensajes, { role: 'user', text: limpio }];
    setMensajes(historial);
    setTexto('');
    const siguiente = paso + 1;

    if (siguiente < CHAT_TEMAS.length) {
      setEstado('pensando');
      const d = await llamarIA({ mode: 'next', history: historial, nextTopic: CHAT_TEMAS[siguiente].tema });
      const ok = d && typeof d.reply === 'string' && d.reply.trim();
      setFuente(ok ? 'ia' : 'respaldo');
      setMensajes((m) => [...m, { role: 'bot', text: ok ? d.reply.trim() : CHAT_TEMAS[siguiente].pregunta }]);
      setPaso(siguiente);
      setEstado('esperando');
      return;
    }

    setPaso(siguiente);
    setEstado('escribiendo');
    const d = await llamarIA({ mode: 'cv', history: historial });
    const ok = cvValido(d);
    const nuevo = ok
      ? { resumen: d.resumen, educacion: d.educacion, proyectos: d.proyectos.slice(0, 3), habilidades: d.habilidades.slice(0, 6), extras: d.extras.slice(0, 2) }
      : cvDeRespaldo([...respuestas, limpio]);
    setFuente(ok ? 'ia' : 'respaldo');
    setCv({ ...nuevo, fuente: ok ? 'ia' : 'respaldo' });
    setMensajes((m) => [...m, { role: 'bot', text: 'Listo. Este es tu CV. No agregué nada que no me hayas dicho; puedes editarlo cuando quieras.' }]);
    setEstado('listo');
  }

  const clip = { inicio: 'Saludo', esperando: 'Reposo', pensando: 'Busca', escribiendo: 'Tecleando', listo: 'GuardaCV' }[estado];
  const ejemplo = paso < CHAT_TEMAS.length ? CHAT_TEMAS[paso].ejemplo : null;
  const ocupado = estado === 'pensando' || estado === 'escribiendo';

  return (
    <section className="pantalla chat" aria-labelledby="t-chat">
      <div className="pantalla__cabeza con-mascota">
        <div>
          <p className="eyebrow">Chatbot de CV</p>
          <h1 id="t-chat" className="heading">Armemos tu CV juntos</h1>
          <p className="muted">Con trabajos escolares, proyectos y lo que haces fuera de la escuela.</p>
          <p className={`chat__fuente ${fuente === 'respaldo' ? 'is-respaldo' : ''}`} aria-live="polite">
            {fuente === 'respaldo' ? 'Respuestas guionadas (la IA no respondió a tiempo)' : 'Respuestas con IA (Gemini)'}
          </p>
        </div>
        <Mascota clip={clip} size="sm" />
      </div>

      <div className="chat__hilo" role="log" aria-live="polite" aria-label="Conversación con el asistente de CV">
        {mensajes.map((m, i) => (
          <p key={i} className={`burbuja burbuja--${m.role}`}>{m.text}</p>
        ))}
        {ocupado ? (
          <p className="burbuja burbuja--bot burbuja--pensando">
            <span className="puntos" aria-hidden="true"><i /><i /><i /></span>
            {estado === 'escribiendo' ? 'Redactando tu CV…' : 'Pensando…'}
          </p>
        ) : null}
        {estado === 'listo' && cv ? <CvVista cv={cv} /> : null}
        <div ref={fin} />
      </div>

      {estado !== 'listo' ? (
        <form
          className="chat__form"
          onSubmit={(e) => { e.preventDefault(); enviar(texto); }}
        >
          {ejemplo && !ocupado ? (
            <button type="button" className="sugerencia" onClick={() => enviar(ejemplo)}>
              <span className="sugerencia__etiqueta">Respuesta de ejemplo</span>
              {ejemplo}
            </button>
          ) : null}
          <div className="chat__fila">
            <label className="sr-only" htmlFor="chat-input">Tu respuesta</label>
            <input
              id="chat-input"
              className="campo"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu respuesta"
              autoComplete="off"
              maxLength={400}
              disabled={ocupado}
            />
            <Button type="submit" variant="secondary" disabled={ocupado || !texto.trim()}>Enviar</Button>
          </div>
          <p className="ayuda">Demo: no escribas datos personales reales (nombre, teléfono, dirección).</p>
        </form>
      ) : (
        <div className="acciones">
          <Button onClick={onListo}>Ver mis vacantes</Button>
        </div>
      )}
    </section>
  );
}
