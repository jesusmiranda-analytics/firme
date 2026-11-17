import { useEffect, useState } from 'react';
import { Button } from './firme.jsx';
import Chat from './Chat.jsx';
import { Aplicar, Detalle, Inicio, ListaCorta, Metricas, Papeleo, Registro, Seguimiento } from './screens.jsx';
import { CV_EJEMPLO, PERFIL_INICIAL, PERSONA } from './data.js';

const IconoLuna = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const IconoSol = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
  </svg>
);

const PANTALLAS = ['Inicio', 'Registro', 'Chatbot de CV', 'Lista corta', 'Vacante y CV adaptado', 'Aplicación automática', 'Seguimiento', 'Guía de papeleo', 'Métricas'];

export default function App() {
  const [paso, setPaso] = useState(0);
  const [perfil, setPerfil] = useState(PERFIL_INICIAL);
  const [cv, setCv] = useState(null);
  const [vacanteId, setVacanteId] = useState('v1');
  const [enviadas, setEnviadas] = useState([]);
  const [demo, setDemo] = useState(0); // cambia al reiniciar para volver a montar todo
  const [tema, setTema] = useState(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));
  const oscuro = tema === 'dark';

  // El tema es preferencia de quien presenta: "Reiniciar demo" no lo cambia.
  useEffect(() => {
    const root = document.documentElement;
    if (oscuro) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#10201f' : '#fbf6ee');
    try { localStorage.setItem('firme-tema', tema); } catch { /* sin almacenamiento: solo dura esta visita */ }
  }, [tema, oscuro]);

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
          <img src={oscuro ? '/marca/firme-logo-inverso.svg' : '/marca/firme-logo.svg'} alt="" height="32" />
        </button>
        <span className="barra__paso small muted" aria-live="polite">{paso + 1} de {PANTALLAS.length} · {PANTALLAS[paso]}</span>
        <button
          type="button"
          className="tema-btn"
          onClick={() => setTema(oscuro ? 'light' : 'dark')}
          aria-pressed={oscuro}
          aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={oscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {oscuro ? <IconoSol /> : <IconoLuna />}
        </button>
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
