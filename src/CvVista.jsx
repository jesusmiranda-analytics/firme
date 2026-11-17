// Vista del CV en formato de la marca. `resaltar` marca en el CV las palabras que pide una vacante.
function Marcado({ texto, resaltar }) {
  if (!resaltar || !resaltar.length) return texto;
  const re = new RegExp(`(${resaltar.map((r) => r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return texto.split(re).map((parte, i) =>
    resaltar.some((r) => r.toLowerCase() === parte.toLowerCase()) ? <mark key={i}>{parte}</mark> : parte,
  );
}

export default function CvVista({ cv, resaltar, titulo = 'Tu CV', nota }) {
  return (
    <article className="cv" aria-label={titulo}>
      <header className="cv__cabeza">
        <p className="eyebrow">{titulo}</p>
        <p className="cv__nombre">Dani <span className="muted">(persona de ejemplo)</span></p>
        <p className="cv__resumen"><Marcado texto={cv.resumen} resaltar={resaltar} /></p>
      </header>
      <dl className="cv__secciones">
        <dt>Educación</dt>
        <dd><Marcado texto={cv.educacion} resaltar={resaltar} /></dd>
        {cv.proyectos?.length ? (
          <>
            <dt>Proyectos</dt>
            <dd><ul>{cv.proyectos.map((p, i) => <li key={i}><Marcado texto={p} resaltar={resaltar} /></li>)}</ul></dd>
          </>
        ) : null}
        {cv.extras?.length ? (
          <>
            <dt>Experiencia extra</dt>
            <dd><ul>{cv.extras.map((p, i) => <li key={i}><Marcado texto={p} resaltar={resaltar} /></li>)}</ul></dd>
          </>
        ) : null}
        {cv.habilidades?.length ? (
          <>
            <dt>Habilidades</dt>
            <dd className="cv__chips">{cv.habilidades.map((h) => <span key={h} className="fm-chip fm-chip--static"><span><Marcado texto={h} resaltar={resaltar} /></span></span>)}</dd>
          </>
        ) : null}
      </dl>
      {nota ? <p className="cv__nota">{nota}</p> : null}
    </article>
  );
}
