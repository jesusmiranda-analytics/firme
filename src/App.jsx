import { useEffect, useState } from 'react';
import { Button } from './firme.jsx';
import Chat from './Chat.jsx';
import { Aplicar, Detalle, Inicio, ListaCorta, Metricas, Papeleo, Registro, Seguimiento } from './screens.jsx';
import { CV_EJEMPLO, PERFIL_INICIAL, PERSONA } from './data.js';

const PANTALLAS = ['Inicio', 'Registro', 'Chatbot de CV', 'Lista corta', 'Vacante y CV adaptado', 'Aplicación automática', 'Seguimiento', 'Guía de papeleo', 'Métricas'];

export default function App() {
  const [paso, setPaso] = useState(0);
  const [perfil, setPerfil] = useState(PERFIL_INICIAL);
  const [cv, setCv] = useState(null);
  const [vacanteId, setVacanteId] = useState('v1');
  const [enviadas, setEnviadas] = useState([]);
  const [demo, setDemo] = useState(0); // cambia al reiniciar para volver a montar todo

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${PANTALLAS[paso]} · Firme`;
  }, [paso]);

  const ir = (n) => setPaso(Math.max(0, Math.min(PANTALLAS.length - 1, n)));
  const reiniciar = () => {
    setPerfil(PERFIL_INICIAL);
    setCv(null);
    setVacanteId('v1');
    setEnviadas([]);
    setDemo((d) => d + 1);
    setPaso(0);
  };
  const cvActual = cv || { ...CV_EJEMPLO, fuente: 'ejemplo' };

  let pantalla;
  switch (paso) {
    case 0: pantalla = <Inicio onEmpezar={() => ir(1)} />; break;
    case 1: pantalla = <Registro perfil={perfil} setPerfil={setPerfil} onCrearCv={() => ir(2)} onSubirCv={() => { setCv({ ...CV_EJEMPLO, fuente: 'subido' }); ir(3); }} />; break;
    case 2: pantalla = <Chat cv={cv} setCv={setCv} onListo={() => ir(3)} />; break;
    case 3: pantalla = <ListaCorta perfil={perfil} enviadas={enviadas} onElegir={(id) => { setVacanteId(id); ir(4); }} />; break;
    case 4: pantalla = <Detalle vacanteId={vacanteId} perfil={perfil} cv={cvActual} enviadas={enviadas} onAplicar={() => ir(5)} />; break;
    case 5: pantalla = <Aplicar key={vacanteId} vacanteId={vacanteId} enviadas={enviadas} onEnviada={(id) => setEnviadas((e) => [...new Set([id, ...e])])} onSeguimiento={() => ir(6)} />; break;
    case 6: pantalla = <Seguimiento enviadas={enviadas} onPapeles={() => ir(7)} />; break;
    case 7: pantalla = <Papeleo />; break;
    default: pantalla = <Metricas onReiniciar={reiniciar} />;
  }

  return (
    <div className="app">
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <header className="barra">
        <button type="button" className="barra__logo" onClick={() => ir(0)} aria-label="Firme, ir al inicio">
          <picture>
            <source srcSet="/marca/firme-logo-inverso.svg" media="(prefers-color-scheme: dark)" />
            <img src="/marca/firme-logo.svg" alt="" height="32" />
          </picture>
        </button>
        <span className="barra__paso small muted" aria-live="polite">{paso + 1} de {PANTALLAS.length} · {PANTALLAS[paso]}</span>
        <Button variant="secondary" size="sm" onClick={reiniciar}>Reiniciar demo</Button>
      </header>

      <nav className="puntos-nav" aria-label="Pantallas de la demo">
        {PANTALLAS.map((p, i) => (
          <button key={p} type="button" className={i === paso ? 'is-actual' : i < paso ? 'is-visto' : ''} aria-label={`${i + 1}. ${p}`} aria-current={i === paso ? 'step' : undefined} onClick={() => ir(i)} />
        ))}
      </nav>

      <p className="cinta small">
        <strong>Demo:</strong> {PERSONA.nombre} es una persona de ejemplo ({PERSONA.descripcion.split(',')[0]}). Las empresas y vacantes también son de ejemplo.
      </p>

      <main id="contenido" key={demo}>
        {paso > 0 ? (
          <button type="button" className="atras" onClick={() => ir(paso - 1)}>
            <span aria-hidden="true">←</span> Atrás
          </button>
        ) : null}
        {pantalla}
      </main>

      <footer className="pie small muted">
        Prototipo del equipo Delions · Hackathon Cantera 2026 · Casa Fragua
      </footer>
    </div>
  );
}
