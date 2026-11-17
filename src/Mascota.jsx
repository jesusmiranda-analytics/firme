import { useEffect, useRef, useState } from 'react';

// Mascota de Firme. Usa la versión 3D animada (firme_mascota.glb) y cambia de clip según el
// estado de la página. Con prefers-reduced-motion o si el 3D no carga, muestra la pose fija.
// Clips: Reposo, Busca y Tecleando se repiten; Saludo, GuardaCV y Avion van una vez y vuelven a Reposo.
const POSE = {
  Reposo: 'principal',
  Saludo: 'saludo',
  Busca: 'busca',
  Tecleando: 'tecleando',
  GuardaCV: 'guarda_cv',
  Avion: 'avion',
};
const LOOPS = { Reposo: true, Busca: true, Tecleando: true };
const ALT = {
  Reposo: 'Mascota de Firme, una caja de archivo con brazos y piernas, en reposo',
  Saludo: 'Mascota de Firme saludando',
  Busca: 'Mascota de Firme buscando dentro de la caja',
  Tecleando: 'Mascota de Firme escribiendo en su escritorio',
  GuardaCV: 'Mascota de Firme guardando tu CV',
  Avion: 'Mascota de Firme lanzando un avión de papel: solicitud enviada',
};

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let loader;
function loadViewer() {
  if (!loader) loader = import('@google/model-viewer').then(() => true).catch(() => false);
  return loader;
}

export default function Mascota({ clip = 'Reposo', size = 'md', className = '' }) {
  const [use3d, setUse3d] = useState(false);
  const [ready, setReady] = useState(false);
  const mv = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let alive = true;
    loadViewer().then((ok) => alive && ok && setUse3d(true));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const el = mv.current;
    if (!el || !use3d) return;
    const play = (name) => {
      if (!el.availableAnimations?.includes(name)) return;
      el.animationName = name;
      el.currentTime = 0;
      el.play({ repetitions: LOOPS[name] ? Infinity : 1 });
    };
    const onLoad = () => { setReady(true); play(clip); };
    const onFinished = () => { if (!LOOPS[clip]) play('Reposo'); };
    el.addEventListener('load', onLoad);
    el.addEventListener('finished', onFinished);
    if (el.loaded) onLoad();
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('finished', onFinished);
    };
  }, [clip, use3d]);

  const src = `/mascota/${POSE[clip] || 'principal'}.webp`;
  return (
    <div className={`mascota mascota--${size} ${className}`}>
      {use3d ? (
        <model-viewer
          ref={mv}
          src="/mascota/firme_mascota.glb"
          poster={src}
          alt={ALT[clip]}
          camera-orbit="-25deg 80deg 135%"
          camera-target="0m 0.95m 0m"
          interaction-prompt="none"
          disable-zoom=""
          disable-pan=""
          shadow-intensity="0.6"
          exposure="0.85"
          loading="eager"
          class={ready ? 'is-ready' : ''}
        />
      ) : (
        <img src={src} alt={ALT[clip]} />
      )}
    </div>
  );
}
