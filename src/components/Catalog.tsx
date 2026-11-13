import { useEffect, useMemo, useRef, useState } from 'react';
import { products, installSteps, clp, type Product } from '../data/products';
import { waLink } from '../data/site';
import { WhatsApp, Close, Check, Wifi, Leaf, Arrow } from './icons';
import s from './Catalog.module.css';

type Filter = string; // 'todos' | 'inverter' | 'accesorio' | un número de BTU

const btuLabel = (n?: number) => (n ? `${n.toLocaleString('es-CL')} BTU` : '');

// Los filtros se arman solos según los equipos que haya en el catálogo
const filters: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  ...[...new Set(products.map((p) => p.btu).filter((b): b is number => !!b))]
    .sort((a, b) => a - b)
    .map((b) => ({ id: String(b), label: btuLabel(b) })),
  ...(products.some((p) => p.inverter) ? [{ id: 'inverter', label: 'Inverter' }] : []),
  ...(products.some((p) => p.category === 'accesorio') ? [{ id: 'accesorio', label: 'Accesorios' }] : []),
];

const placeholder = '/favicon.svg';

function matches(p: Product, f: Filter) {
  if (f === 'todos') return true;
  if (f === 'inverter') return !!p.inverter;
  if (f === 'accesorio') return p.category === 'accesorio';
  return String(p.btu) === f;
}

export default function Catalog() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [active, setActive] = useState<Product | null>(null);
  const [img, setImg] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  const list = useMemo(() => products.filter((p) => matches(p, filter)), [filter]);

  // La calculadora de BTU puede pedir un filtro
  useEffect(() => {
    const onFilter = (e: Event) => setFilter((e as CustomEvent<Filter>).detail);
    window.addEventListener('olivar:filter', onFilter);
    return () => window.removeEventListener('olivar:filter', onFilter);
  }, []);

  const open = (p: Product) => {
    setActive(p);
    setImg(0);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  const changeFilter = (f: Filter) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => setFilter(f));
    } else setFilter(f);
  };

  return (
    <>
      <div className={s.filters} role="tablist" aria-label="Filtrar equipos">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={s.filter}
            onClick={() => changeFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={s.grid}>
        {list.map((p) => (
          <article key={p.id} className={s.card} style={{ viewTransitionName: `p-${p.id}` }}>
            <button className={s.media} onClick={() => open(p)} aria-label={`Ver detalles de ${p.brand} ${p.name}`}>
              <img src={p.images[0] ?? placeholder} alt={`${p.brand} ${p.name}`} loading="lazy" decoding="async" />
              <span className={s.brand}>{p.brand}</span>
            </button>
            <div className={s.body}>
              <div className={s.tags}>
                {p.btu && <span>{btuLabel(p.btu)}</span>}
                {p.inverter && <span className={s.inv}><Leaf /> Inverter</span>}
                {p.wifi && <span><Wifi /> WiFi</span>}
              </div>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <div className={s.foot}>
                <div>
                  <strong>{clp(p.price)}</strong>
                  <small>{p.withInstall ? 'con instalación' : 'precio unitario'}</small>
                </div>
                <button className={s.more} onClick={() => open(p)} aria-label={`Ver ${p.name}`}>
                  <Arrow />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className={s.note}>
        Precios referenciales en pesos chilenos. Confirma stock y valor final por WhatsApp antes de comprar.
      </p>

      <dialog ref={dialog} className={s.dialog} onClose={() => setActive(null)} onClick={(e) => e.target === dialog.current && close()}>
        {active && (
          <div className={s.sheet}>
            <button className={s.close} onClick={close} aria-label="Cerrar">
              <Close />
            </button>

            <div className={s.gallery}>
              <div className={s.main}>
                <img src={active.images[img] ?? placeholder} alt={`${active.brand} ${active.name}, imagen ${img + 1}`} />
              </div>
              {active.images.length > 1 && (
                <div className={s.thumbs}>
                  {active.images.map((src, i) => (
                    <button key={src + i} aria-current={i === img} onClick={() => setImg(i)} aria-label={`Imagen ${i + 1}`}>
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={s.info}>
              <span className={s.kicker}>{active.brand}</span>
              <h3>{active.name}</h3>
              <div className={s.tags}>
                {active.btu && <span>{btuLabel(active.btu)}</span>}
                {active.inverter && <span className={s.inv}><Leaf /> Inverter</span>}
                {active.wifi && <span><Wifi /> WiFi</span>}
              </div>
              <p className={s.price}>
                {clp(active.price)} <small>{active.withInstall ? 'con instalación' : ''}</small>
              </p>
              <p className={s.muted}>{active.summary}</p>

              {active.includes && (
                <>
                  <h4>Incluye</h4>
                  <p className={s.muted}>{active.includes}</p>
                </>
              )}

              {active.withInstall && (
                <>
                  <h4>Instalación estándar</h4>
                  <ul className={s.steps}>
                    {installSteps.map((st) => (
                      <li key={st}><Check /> {st}</li>
                    ))}
                  </ul>
                </>
              )}

              <a
                className="btn btn-wa"
                href={waLink(`Hola Olivar Clima, me interesa el ${active.brand} ${active.name} (${clp(active.price)}). ¿Está disponible?`)}
                target="_blank"
                rel="noopener"
              >
                <WhatsApp /> Lo quiero, cotizar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
