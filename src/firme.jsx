// Componentes del Design System Firme (misma API y clases que project/components/bundle.js).
const cx = (...a) => a.filter(Boolean).join(' ');

export const Check = ({ strokeWidth = 2.4 }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Coin = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="2" />
    <path d="M8 5.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function Button({ variant = 'primary', size = 'md', type = 'button', className, disabled, onClick, children }) {
  return (
    <button type={type} className={cx('fm-btn', `fm-btn--${variant}`, size === 'sm' && 'fm-btn--sm', className)} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function ContractSeal({ kind = 'contrato', size }) {
  const isContract = kind === 'contrato';
  return (
    <span
      className={cx('fm-seal', `fm-seal--${kind}`, size === 'lg' && 'fm-seal--lg')}
      title={isContract ? 'La empresa indica contrato escrito y alta en el IMSS' : 'Práctica o beca con pago; no es contrato laboral'}
    >
      {isContract ? <Check /> : <Coin />}
      {isContract ? 'Con contrato · IMSS' : 'Práctica pagada'}
    </span>
  );
}

export function ScheduleChip({ label, selected, onToggle, static: isStatic }) {
  if (isStatic) return <span className="fm-chip fm-chip--static">{label}</span>;
  return (
    <button type="button" className="fm-chip" aria-pressed={selected ? 'true' : 'false'} onClick={() => onToggle && onToggle(!selected)}>
      {selected ? <Check /> : null}
      {label}
    </button>
  );
}

export function VacancyCard({ title, company, location, schedule, pay, kind = 'contrato', match, applyLabel, onApply, onView }) {
  const m = Math.max(0, Math.min(100, Math.round(match || 0)));
  return (
    <article className="fm-card" aria-label={`${title} en ${company}`}>
      <div className="fm-card__head">
        <div>
          <p className="fm-card__company">{company}</p>
          <h3 className="fm-card__title">{title}</h3>
        </div>
        <ContractSeal kind={kind} />
      </div>
      <div className="fm-card__meta">
        {location ? <span>{location}</span> : null}
        {schedule ? <ScheduleChip label={schedule} static /> : null}
        {pay ? <span className="fm-card__pay">{pay}</span> : null}
      </div>
      {match != null ? (
        <div className="fm-card__match">
          <div className="fm-card__match-row">
            <span>Compatibilidad con tu perfil y horario</span>
            <strong>{m}%</strong>
          </div>
          <div className="fm-card__bar" role="img" aria-label={`Compatibilidad ${m}%`}>
            <span style={{ width: `${m}%` }} />
          </div>
        </div>
      ) : null}
      <div className="fm-card__actions">
        <Button variant="primary" onClick={onApply}>{applyLabel || 'Postularme'}</Button>
        <Button variant="ghost" onClick={onView}>Ver vacante</Button>
      </div>
    </article>
  );
}

const STEPS = ['Enviada', 'Vista', 'Entrevista', 'Oferta'];

export function StatusTracker({ current = 0, closed, note }) {
  return (
    <div className={cx('fm-track', closed && 'fm-track--closed')}>
      <ol className="fm-track__steps">
        {STEPS.map((label, i) => {
          const done = i < current || (i === current && i === STEPS.length - 1 && !closed);
          const isCurrent = i === current && !done;
          return (
            <li key={label} className={cx('fm-track__step', done && 'is-done', isCurrent && 'is-current')} aria-current={isCurrent ? 'step' : undefined}>
              <span className="fm-track__dot">{done ? <Check /> : null}</span>
              {label}
            </li>
          );
        })}
      </ol>
      {note ? <p className="fm-track__note">{closed ? <Cross /> : null}{note}</p> : null}
    </div>
  );
}
