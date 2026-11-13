import { useMemo, useState } from 'react';
import { waLink } from '../data/site';
import { WhatsApp, Arrow } from './icons';
import s from './BtuCalculator.module.css';

const suns = [
  { id: 'poco', label: 'Poco sol', factor: 1 },
  { id: 'medio', label: 'Sol de tarde', factor: 1.1 },
  { id: 'mucho', label: 'Mucho sol', factor: 1.2 },
] as const;

const rooms = [
  { id: 'dormitorio', label: 'Dormitorio' },
  { id: 'living', label: 'Living / comedor' },
  { id: 'oficina', label: 'Oficina / local' },
] as const;

// Regla práctica referencial para split muro (cielo de ~2,4 m)
function estimate(m2: number, people: number, sun: number) {
  return Math.round(m2 * 500 * sun + Math.max(0, people - 2) * 500);
}

export default function BtuCalculator() {
  const [m2, setM2] = useState(16);
  const [people, setPeople] = useState(2);
  const [sun, setSun] = useState<(typeof suns)[number]['id']>('medio');
  const [room, setRoom] = useState<(typeof rooms)[number]['id']>('dormitorio');

  const factor = suns.find((x) => x.id === sun)!.factor;
  const btu = useMemo(() => estimate(m2, people, factor), [m2, people, factor]);
  const tier = btu <= 9000 ? 9000 : btu <= 12000 ? 12000 : btu <= 18000 ? 18000 : null;
  const fill = Math.min(100, (btu / 20000) * 100);

  const seeEquipment = () => {
    if (!tier) return;
    window.dispatchEvent(new CustomEvent('olivar:filter', { detail: String(tier) }));
    document.getElementById('equipos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const roomLabel = rooms.find((r) => r.id === room)!.label.toLowerCase();
  const msg = `Hola Olivar Clima, tengo un ${roomLabel} de ${m2} m² (${people} personas, ${suns
    .find((x) => x.id === sun)!
    .label.toLowerCase()}). La calculadora me recomienda ${tier ? `${tier.toLocaleString('es-CL')} BTU` : 'más de 18.000 BTU'}. ¿Me pueden cotizar?`;

  return (
    <div className={s.wrap}>
      <form className={s.form} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={s.group}>
          <legend>Tipo de espacio</legend>
          <div className={s.seg}>
            {rooms.map((r) => (
              <label key={r.id}>
                <input type="radio" name="room" checked={room === r.id} onChange={() => setRoom(r.id)} />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.group}>
          <label htmlFor="m2" className={s.rowLabel}>
            Tamaño del espacio <output>{m2} m²</output>
          </label>
          <input id="m2" type="range" min={6} max={50} value={m2} onChange={(e) => setM2(+e.target.value)} />
          <div className={s.scale}><span>6 m²</span><span>50 m²</span></div>
        </div>

        <div className={s.group}>
          <label htmlFor="people" className={s.rowLabel}>
            Personas que lo usan normalmente <output>{people}</output>
          </label>
          <input id="people" type="range" min={1} max={8} value={people} onChange={(e) => setPeople(+e.target.value)} />
        </div>

        <fieldset className={s.group}>
          <legend>¿Cuánto sol le llega?</legend>
          <div className={s.seg}>
            {suns.map((x) => (
              <label key={x.id}>
                <input type="radio" name="sun" checked={sun === x.id} onChange={() => setSun(x.id)} />
                <span>{x.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className={s.result} aria-live="polite">
        <span className={s.kicker}>Te recomendamos</span>
        <p className={s.big}>{tier ? `${tier.toLocaleString('es-CL')}` : '18.000+'}<small>BTU</small></p>
        <div className={s.meter}><span style={{ width: `${fill}%` }} /></div>
        <p className={s.detail}>
          Tu espacio necesita aprox. <b>{btu.toLocaleString('es-CL')} BTU</b>.{' '}
          {tier
            ? `Un equipo de ${tier.toLocaleString('es-CL')} BTU lo climatiza bien. Si lo usarás a diario, elige inverter para ahorrar luz.`
            : 'Para espacios así de grandes conviene una visita técnica o más de un equipo. Escríbenos y lo vemos juntos.'}
        </p>
        <div className={s.actions}>
          {tier && (
            <button type="button" className="btn btn-primary" onClick={seeEquipment}>
              Ver equipos de {tier.toLocaleString('es-CL')} BTU <Arrow />
            </button>
          )}
          <a className="btn btn-wa" href={waLink(msg)} target="_blank" rel="noopener">
            <WhatsApp /> Consultar este cálculo
          </a>
        </div>
        <p className={s.disclaimer}>Cálculo referencial. Al cotizar confirmamos la capacidad según tu espacio real.</p>
      </div>
    </div>
  );
}
