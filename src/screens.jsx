import { useEffect, useMemo, useState } from 'react';
import { Button, ContractSeal, ScheduleChip, StatusTracker, VacancyCard, Check } from './firme.jsx';
import Mascota from './Mascota.jsx';
import CvVista from './CvVista.jsx';
import {
  EMPRESAS, FUENTES, HORARIOS, INFORMALES, INFORMALES_TOTAL, LINEA_BASE, METRICAS_SIMULADAS,
  PUESTOS, SOLICITUDES_PREVIAS, VACANTES,
} from './data.js';

const toggle = (lista, valor, on) => (on ? [...new Set([...lista, valor])] : lista.filter((x) => x !== valor));

/* ---------- 1. Inicio ---------- */
export function Inicio({ onEmpezar }) {
  return (
    <section className="pantalla inicio" aria-labelledby="t-inicio">
      <div className="inicio__texto">
        <h1 id="t-inicio" className="display-xl">Tu primer empleo, <span className="firma">firme.</span></h1>
        <p className="body-lg">
          Te mostramos solo vacantes <strong>con contrato</strong> o prácticas pagadas que caben en tu horario.
          Armamos tu CV, aplicamos por ti y damos seguimiento.
        </p>
        <ul className="promesas">
          <li><ContractSeal kind="contrato" /><span>Solo empleos formales: contrato y alta en el IMSS.</span></li>
          <li><span className="promesas__icono" aria-hidden="true">◷</span><span>Solo lo que cabe en tu horario de escuela.</span></li>
          <li><span className="promesas__icono" aria-hidden="true">↻</span><span>Te avisamos si una empresa no responde.</span></li>
        </ul>
        <div className="acciones">
          <Button onClick={onEmpezar}>Empezar</Button>
        </div>
      </div>
      <Mascota clip="Saludo" size="lg" />
    </section>
  );
}

/* ---------- 2. Registro ---------- */
function GrupoChips({ titulo, ayuda, opciones, valores, onCambio, id }) {
  return (
    <fieldset className="grupo" aria-describedby={ayuda ? `${id}-ayuda` : undefined}>
      <legend className="title">{titulo}</legend>
      {ayuda ? <p className="muted small" id={`${id}-ayuda`}>{ayuda}</p> : null}
      <div className="chips">
        {opciones.map((o) => (
          <ScheduleChip key={o} label={o} selected={valores.includes(o)} onToggle={(on) => onCambio(toggle(valores, o, on))} />
        ))}
      </div>
    </fieldset>
  );
}

export function Registro({ perfil, setPerfil, onCrearCv, onSubirCv }) {
  const sinHorario = perfil.horarios.length === 0;
  return (
    <section className="pantalla" aria-labelledby="t-registro">
      <div className="pantalla__cabeza">
        <p className="eyebrow">Registro</p>
        <h1 id="t-registro" className="heading">Cuéntanos qué buscas</h1>
        <p className="muted">Lo registras una vez y solo te mostramos vacantes que puedes cubrir.</p>
      </div>
      <GrupoChips id="g-horario" titulo="¿Cuándo puedes trabajar?" ayuda="Marca todas las franjas que puedes cubrir sin dejar la escuela."
        opciones={HORARIOS} valores={perfil.horarios} onCambio={(v) => setPerfil({ ...perfil, horarios: v })} />
      {sinHorario ? <p className="aviso" role="alert">Marca al menos un horario para buscar vacantes.</p> : null}
      <GrupoChips id="g-puestos" titulo="¿Qué puestos te interesan?" opciones={PUESTOS} valores={perfil.puestos}
        onCambio={(v) => setPerfil({ ...perfil, puestos: v })} />
      <GrupoChips id="g-empresas" titulo="¿En qué tipo de empresas?" opciones={EMPRESAS} valores={perfil.empresas}
        onCambio={(v) => setPerfil({ ...perfil, empresas: v })} />
      <fieldset className="grupo">
        <legend className="title">Tu CV</legend>
        <div className="opciones-cv">
          <div className="panel panel--destacado">
            <p className="title">No tengo CV</p>
            <p className="muted small">Un asistente con IA te hace 4 preguntas y lo arma con tus trabajos escolares y proyectos.</p>
            <Button onClick={onCrearCv} disabled={sinHorario}>Crear mi CV con IA</Button>
          </div>
          <div className="panel">
            <p className="title">Ya tengo CV</p>
            <p className="muted small">Lo subes en PDF y lo adaptamos a cada vacante. En la demo usamos un CV de ejemplo.</p>
            <Button variant="secondary" onClick={onSubirCv} disabled={sinHorario}>Subir mi CV</Button>
          </div>
        </div>
      </fieldset>
    </section>
  );
}

/* ---------- 4. Lista corta ---------- */
export function calcularMatch(v, perfil) {
  return Math.min(98, v.base + (perfil.puestos.includes(v.area) ? 6 : -4));
}

export function ListaCorta({ perfil, onElegir, enviadas }) {
  const [soloFormales, setSoloFormales] = useState(true);
  const enHorario = VACANTES.filter((v) => perfil.horarios.includes(v.horario));
  const fueraHorario = VACANTES.length - enHorario.length;
  const lista = enHorario
    .map((v) => ({ ...v, match: calcularMatch(v, perfil) }))
    .sort((a, b) => b.match - a.match);
  const informales = INFORMALES.filter((v) => perfil.horarios.includes(v.horario));

  return (
    <section className="pantalla" aria-labelledby="t-lista">
      <div className="pantalla__cabeza con-mascota">
        <div>
          <p className="eyebrow">Lista corta</p>
          <h1 id="t-lista" className="heading">Tu lista corta de hoy</h1>
          <p className="muted">
            Revisamos vacantes de {FUENTES.join(', ')} (en la demo, simuladas). Quedaron <strong>{lista.length}</strong> formales que caben en tu horario.
          </p>
        </div>
        <Mascota clip="Busca" size="sm" />
      </div>

      <div className="filtro">
        <label className="switch">
          <input type="checkbox" checked={soloFormales} onChange={(e) => setSoloFormales(e.target.checked)} />
          <span className="switch__pista" aria-hidden="true"><span /></span>
          <span className="switch__texto">Solo con contrato o práctica pagada</span>
        </label>
        <p className="small muted">
          {soloFormales ? `Ocultamos ${INFORMALES_TOTAL} vacantes que no indican contrato ni pago` : 'Estás viendo también vacantes sin contrato'}
          {fueraHorario > 0 ? ` y ${fueraHorario} que no caben en tu horario.` : '.'}
        </p>
      </div>

      {lista.length === 0 ? (
        <p className="aviso">No hay vacantes formales en tus horarios hoy. Prueba marcar otra franja en el registro.</p>
      ) : null}
      <div className="tarjetas">
        {lista.map((v) => (
          <VacancyCard
            key={v.id}
            title={v.titulo}
            company={v.empresa}
            location={v.zona}
            schedule={v.horarioTexto}
            pay={v.pago}
            kind={v.formal}
            match={v.match}
            applyLabel={enviadas.includes(v.id) ? 'Ya te postulaste' : 'Postularme'}
            onApply={() => onElegir(v.id)}
            onView={() => onElegir(v.id)}
          />
        ))}
      </div>

      {!soloFormales ? (
        <div className="informales">
          <p className="title">Sin contrato indicado</p>
          <p className="small muted">Así se ven los anuncios que Firme normalmente no te muestra.</p>
          {informales.map((v) => (
            <div key={v.id} className="informal">
              <p className="informal__titulo">{v.titulo}</p>
              <p className="small muted">{v.empresa} · {v.zona} · {v.horario}</p>
              <p className="small informal__nota">{v.nota}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

/* ---------- 5. Detalle y CV adaptado ---------- */
function adaptarCv(cv, v) {
  const texto = [cv.resumen, cv.educacion, ...cv.proyectos, ...cv.extras, ...cv.habilidades].join(' ').toLowerCase();
  // Si la frase completa está en el CV se resalta completa; si no, solo sus palabras importantes.
  const presentes = [...new Set(v.claves.flatMap((k) =>
    texto.includes(k.toLowerCase()) ? [k] : k.split(' ').filter((w) => w.length > 4 && texto.includes(w.toLowerCase()))))];
  const clavesFaltan = v.claves.filter((k) => !texto.includes(k.toLowerCase()) && !k.split(' ').some((w) => w.length > 4 && texto.includes(w.toLowerCase())));
  const pesa = (h) => (presentes.some((p) => h.toLowerCase().includes(p.toLowerCase())) ? 0 : 1);
  const habilidades = [...cv.habilidades].sort((a, b) => pesa(a) - pesa(b));
  const resumen = `${cv.resumen.trim()} Me interesa el puesto de ${v.titulo.toLowerCase()} y puedo cubrir el horario de ${v.horario.toLowerCase()}.`;
  return { cv: { ...cv, habilidades, resumen }, presentes, clavesFaltan };
}

export function Detalle({ vacanteId, perfil, cv, onAplicar, enviadas }) {
  const v = VACANTES.find((x) => x.id === vacanteId) || VACANTES[0];
  const { cv: adaptado, presentes, clavesFaltan } = useMemo(() => adaptarCv(cv, v), [cv, v]);
  const yaEnviada = enviadas.includes(v.id);
  return (
    <section className="pantalla" aria-labelledby="t-detalle">
      <div className="pantalla__cabeza">
        <p className="eyebrow">Vacante · vía {v.fuente} (simulado)</p>
        <div className="detalle__titulo">
          <div>
            <p className="muted">{v.empresa}</p>
            <h1 id="t-detalle" className="heading">{v.titulo}</h1>
          </div>
          <ContractSeal kind={v.formal} size="lg" />
        </div>
        <div className="fm-card__meta">
          <span>{v.zona}</span>
          <ScheduleChip label={v.horarioTexto} static />
          <span className="fm-card__pay">{v.pago}</span>
          <span>Compatibilidad <strong className="brand">{calcularMatch(v, perfil)}%</strong></span>
        </div>
      </div>

      <div className="dos-columnas">
        <div className="panel">
          <p className="title">Qué piden</p>
          <ul className="lista-check">{v.requisitos.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="title">Qué ofrece</p>
          <ul className="lista-check lista-check--seal">{v.prestaciones.map((r) => <li key={r}><Check />{r}</li>)}</ul>
        </div>
        <div className="panel">
          <p className="title">Qué ajustamos de tu CV para esta vacante</p>
          <ul className="ajustes">
            <li>El resumen ahora menciona el puesto y tu horario.</li>
            {presentes.length ? <li>Pusimos primero lo que pide la vacante y ya tienes: {presentes.map((p) => <mark key={p}>{p}</mark>).reduce((a, b) => [a, ', ', b])}.</li> : null}
            {clavesFaltan.length ? <li>La vacante también menciona {clavesFaltan.join(', ')}. No lo agregamos porque no lo dijiste; si lo sabes hacer, agrégalo.</li> : null}
          </ul>
        </div>
      </div>

      <CvVista cv={adaptado} resaltar={presentes} titulo="CV adaptado para esta vacante" nota="Lo resaltado coincide con lo que pide la vacante. No inventamos experiencia." />

      <div className="acciones">
        <Button onClick={onAplicar} disabled={yaEnviada}>{yaEnviada ? 'Ya enviaste esta solicitud' : 'Aplicar por mí'}</Button>
      </div>
    </section>
  );
}

/* ---------- 6. Aplicación automática (simulada) ---------- */
export function Aplicar({ vacanteId, onEnviada, onSeguimiento, enviadas }) {
  const v = VACANTES.find((x) => x.id === vacanteId) || VACANTES[0];
  const pasos = [
    `Abrimos el formulario de la empresa en ${v.fuente}`,
    'Llenamos tus datos de contacto',
    'Adjuntamos tu CV adaptado',
    'Respondimos 3 preguntas de filtro con tu perfil',
  ];
  const [hecho, setHecho] = useState(enviadas.includes(v.id) ? pasos.length : 0);
  const [enviada, setEnviada] = useState(enviadas.includes(v.id));
  useEffect(() => {
    if (hecho >= pasos.length) return undefined;
    const t = setTimeout(() => setHecho((h) => h + 1), 750);
    return () => clearTimeout(t);
  }, [hecho, pasos.length]);
  const listo = hecho >= pasos.length;

  return (
    <section className="pantalla" aria-labelledby="t-aplicar">
      <div className="pantalla__cabeza con-mascota">
        <div>
          <p className="eyebrow">Aplicación automática · simulada</p>
          <h1 id="t-aplicar" className="heading">{enviada ? '¡Solicitud enviada!' : listo ? 'Todo listo. Solo falta tu aprobación' : 'Llenando el formulario de la empresa…'}</h1>
          <p className="muted">{v.titulo} · {v.empresa}</p>
        </div>
        <Mascota clip={enviada ? 'Avion' : listo ? 'Reposo' : 'GuardaCV'} size="sm" />
      </div>

      <ol className="progreso" aria-live="polite">
        {pasos.map((p, i) => (
          <li key={p} className={i < hecho ? 'is-done' : i === hecho ? 'is-current' : ''}>
            <span className="progreso__punto">{i < hecho ? <Check /> : null}</span>
            {p}
          </li>
        ))}
        <li className={enviada ? 'is-done' : ''}>
          <span className="progreso__punto">{enviada ? <Check /> : null}</span>
          {enviada ? 'Enviada hoy. Te avisamos cuando la empresa la vea.' : 'Tú apruebas el envío'}
        </li>
      </ol>

      {listo && !enviada ? (
        <div className="panel">
          <p className="small muted">Nada se envía sin tu clic. Revisamos que la vacante siga abierta y que tu CV adaptado esté adjunto.</p>
          <div className="acciones">
            <Button onClick={() => { setEnviada(true); onEnviada(v.id); }}>Aprobar y enviar</Button>
          </div>
        </div>
      ) : null}
      {enviada ? (
        <div className="acciones">
          <Button onClick={onSeguimiento}>Ver mi seguimiento</Button>
        </div>
      ) : null}
    </section>
  );
}

/* ---------- 7. Seguimiento ---------- */
export function Seguimiento({ enviadas, onPapeles }) {
  const [escrito, setEscrito] = useState(null); // null | 'borrador' | 'enviado'
  const nuevas = enviadas.map((id) => {
    const v = VACANTES.find((x) => x.id === id);
    return { id, titulo: v.titulo, empresa: v.empresa, formal: v.formal, current: 0, nota: 'Enviada hoy por Firme. Te avisamos cuando la vean.', tipo: 'nueva' };
  });
  const todas = [...nuevas, ...SOLICITUDES_PREVIAS];
  const entrevistas = todas.filter((s) => s.tipo === 'entrevista').length;
  const ofertas = todas.filter((s) => s.tipo === 'oferta').length;

  return (
    <section className="pantalla" aria-labelledby="t-seg">
      <div className="pantalla__cabeza con-mascota">
        <div>
          <p className="eyebrow">Seguimiento</p>
          <h1 id="t-seg" className="heading">Tus solicitudes</h1>
          <p className="muted">{todas.length} solicitudes · {entrevistas} entrevista · {ofertas} oferta. Nunca te quedas esperando sin saber qué pasa.</p>
        </div>
        <Mascota clip="Reposo" size="sm" />
      </div>
      <div className="solicitudes">
        {todas.map((s) => (
          <article key={s.id} className={`solicitud ${s.tipo === 'sin-respuesta' ? 'solicitud--alerta' : ''}`}>
            <div className="solicitud__cabeza">
              <div>
                <p className="small muted">{s.empresa}</p>
                <p className="title">{s.titulo}</p>
              </div>
              <ContractSeal kind={s.formal} />
            </div>
            <StatusTracker current={s.current} note={s.nota} />
            {s.tipo === 'oferta' ? (
              <Button variant="ghost" onClick={onPapeles}>Ver qué papeles necesito</Button>
            ) : null}
            {s.tipo === 'sin-respuesta' ? (
              escrito === null ? (
                <div className="acciones">
                  <Button variant="secondary" size="sm" onClick={() => setEscrito('borrador')}>Sí, escríbeles</Button>
                </div>
              ) : (
                <div className="borrador">
                  <p className="small muted">Mensaje que enviaríamos por el portal de la empresa:</p>
                  <blockquote>
                    Hola. Hace dos semanas envié mi solicitud para {s.titulo.toLowerCase()}. Sigo con interés en el puesto y tengo disponibilidad por las tardes.
                    ¿Me podrían decir en qué etapa va el proceso? Gracias.
                  </blockquote>
                  {escrito === 'enviado' ? (
                    <p className="small ok"><Check /> Mensaje enviado (simulado). Te avisamos si responden.</p>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setEscrito('enviado')}>Enviar mensaje</Button>
                  )}
                </div>
              )
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 8. Guía de papeleo ---------- */
const TRAMITES = [
  {
    id: 'curp', nombre: 'CURP', para: 'Es la base de los demás trámites.', tiempo: 'Unos minutos, en línea', costo: 'Gratis',
    pasos: ['Entra a gob.mx/curp.', 'Busca tu CURP con tus datos.', 'Descárgala en PDF y guárdala en tu celular.'],
    enlace: 'https://www.gob.mx/curp/', enlaceTexto: 'gob.mx/curp',
  },
  {
    id: 'rfc', nombre: 'RFC y Constancia de Situación Fiscal', para: 'La empresa la pide para pagarte tu nómina.', tiempo: 'Unos minutos en línea; si el sistema lo pide, con cita', costo: 'Gratis',
    pasos: [
      'Entra al portal del SAT y busca «Inscripción al RFC con CURP».',
      'Captura tu CURP, tu código postal, tu correo y los datos que pide el formulario.',
      'Te llega por correo el acuse de inscripción y tu Constancia de Situación Fiscal, que es la que te piden en el trabajo.',
      'Si el portal no te deja terminar, el SAT te pide agendar una cita en una oficina.',
    ],
    enlace: 'https://www.sat.gob.mx/', enlaceTexto: 'sat.gob.mx',
  },
  {
    id: 'nss', nombre: 'Número de Seguridad Social (NSS)', para: 'Con él la empresa te da de alta en el IMSS.', tiempo: 'Unos minutos, en línea', costo: 'Gratis',
    pasos: [
      'Entra al trámite del IMSS «Asignación o localización del Número de Seguridad Social».',
      'Captura tu CURP y un correo personal al que tengas acceso.',
      'Recibes tu NSS en pantalla o en tu correo. Guarda el documento.',
      'Si no se puede en línea, ve a tu clínica o subdelegación del IMSS con tu CURP y una identificación.',
    ],
    enlace: 'https://www.imss.gob.mx/tramites/imss02008', enlaceTexto: 'imss.gob.mx',
  },
];
const DOCUMENTOS = [
  'Identificación oficial (INE, si eres mayor de edad)',
  'Acta de nacimiento',
  'Comprobante de domicilio',
  'CURP',
  'Constancia de Situación Fiscal (RFC)',
  'Número de Seguridad Social (NSS)',
  'Cuenta bancaria para tu nómina (a veces la abre la empresa)',
];

export function Papeleo() {
  const [abierto, setAbierto] = useState('rfc');
  const [tengo, setTengo] = useState(['Acta de nacimiento', 'CURP', 'Comprobante de domicilio']);
  return (
    <section className="pantalla" aria-labelledby="t-pap">
      <div className="pantalla__cabeza">
        <p className="eyebrow">Guía de papeleo</p>
        <h1 id="t-pap" className="heading">Tus papeles para un empleo formal</h1>
        <p className="muted">Paso a paso y en los portales oficiales. Todos son gratis.</p>
      </div>
      <div className="tramites">
        {TRAMITES.map((t) => {
          const open = abierto === t.id;
          return (
            <div key={t.id} className={`tramite ${open ? 'is-open' : ''}`}>
              <button type="button" className="tramite__boton" aria-expanded={open} aria-controls={`tr-${t.id}`} onClick={() => setAbierto(open ? null : t.id)}>
                <span>
                  <span className="title">{t.nombre}</span>
                  <span className="small muted d-block">{t.para}</span>
                </span>
                <span className="tramite__flecha" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              {open ? (
                <div id={`tr-${t.id}`} className="tramite__cuerpo">
                  <ol>{t.pasos.map((p) => <li key={p}>{p}</li>)}</ol>
                  <p className="small"><strong>Tiempo:</strong> {t.tiempo} · <strong>Costo:</strong> {t.costo}</p>
                  <a className="enlace" href={t.enlace} target="_blank" rel="noreferrer">Ir a {t.enlaceTexto} (sitio oficial)</a>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <fieldset className="grupo">
        <legend className="title">Lo que suelen pedir en un primer empleo formal</legend>
        <p className="small muted">{tengo.length} de {DOCUMENTOS.length} listos</p>
        <ul className="checklist">
          {DOCUMENTOS.map((d) => (
            <li key={d}>
              <label>
                <input type="checkbox" checked={tengo.includes(d)} onChange={(e) => setTengo(toggle(tengo, d, e.target.checked))} />
                <span>{d}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <p className="small muted">Los requisitos pueden cambiar. Revisa siempre el portal oficial antes de hacer un trámite.</p>
    </section>
  );
}

/* ---------- 9. Métricas ---------- */
const INDICADORES = [
  { k: 'formal', nombre: 'Empleo formal', detalle: 'Jóvenes con contrato o alta en el IMSS ÷ registrados', tipo: 'Principal' },
  { k: 'practica', nombre: 'Práctica remunerada', detalle: 'Jóvenes en práctica o beca con pago ÷ registrados', tipo: 'Se reporta aparte' },
  { k: 'ingreso', nombre: 'Ingreso propio', detalle: 'Jóvenes que generan ingreso propio ÷ registrados', tipo: 'Secundario' },
  { k: 'respuesta', nombre: 'Tasa de respuesta', detalle: 'Solicitudes con respuesta ÷ solicitudes enviadas', tipo: 'Proceso' },
];

export function Metricas({ onReiniciar }) {
  const [corte, setCorte] = useState(90);
  const m = METRICAS_SIMULADAS[corte];
  return (
    <section className="pantalla" aria-labelledby="t-met">
      <div className="pantalla__cabeza">
        <p className="eyebrow">Métricas</p>
        <h1 id="t-met" className="heading">Cómo medimos si Firme funciona</h1>
        <p className="muted">La pregunta: ¿el joven consigue empleo formal, o genera su propio ingreso, en menos de tres meses?</p>
      </div>

      <div className="panel panel--base">
        <p className="label">Línea base · dato real de campo</p>
        {LINEA_BASE.map((l) => <p key={l.dato} className="body-lg base__dato">{l.dato}</p>)}
        <p className="small muted">{LINEA_BASE[0].fuente}</p>
      </div>

      <div className="simulado" role="note">
        <span className="label">Datos simulados de ejemplo</span>
        <span className="small">No son resultados. Las metas se fijarán con los datos del piloto.</span>
      </div>

      <div className="segmentos" role="group" aria-label="Corte en días desde el registro">
        {[30, 60, 90].map((d) => (
          <button key={d} type="button" aria-pressed={corte === d} onClick={() => setCorte(d)}>{d} días</button>
        ))}
      </div>

      <div className="indicadores">
        {INDICADORES.map((i) => (
          <div key={i.k} className="indicador">
            <div className="indicador__fila">
              <span>
                <span className="title">{i.nombre}</span>
                <span className="small muted d-block">{i.tipo} · {i.detalle}</span>
              </span>
              <strong className="indicador__valor">{m[i.k]}%<span className="indicador__sim">simulado</span></strong>
            </div>
            <div className="fm-card__bar" role="img" aria-label={`${i.nombre}: ${m[i.k]}% (simulado)`}>
              <span style={{ width: `${m[i.k]}%` }} />
            </div>
          </div>
        ))}
        <div className="indicador">
          <div className="indicador__fila">
            <span>
              <span className="title">Tiempo a la primera respuesta</span>
              <span className="small muted d-block">Proceso · días entre el envío y la primera respuesta</span>
            </span>
            <strong className="indicador__valor">{m.dias} días<span className="indicador__sim">simulado</span></strong>
          </div>
        </div>
      </div>
      <p className="small muted">Cómo se verifica: contrato o constancia de alta en el IMSS (solo se confirma, no se guarda), carta de la empresa para prácticas y el tablero de seguimiento.</p>
      <div className="acciones">
        <Button onClick={onReiniciar}>Reiniciar demo</Button>
      </div>
    </section>
  );
}
