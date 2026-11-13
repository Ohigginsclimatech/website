// ─────────────────────────────────────────────────────────────
//  Catálogo. Para cambiar un precio, edita "price" (en pesos).
//  Para agregar un equipo, copia un bloque y cambia el id.
// ─────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  brand: 'Midea' | 'Hisense' | 'Genérico';
  name: string;
  btu?: 9000 | 12000 | 18000;
  inverter?: boolean;
  wifi?: boolean;
  price: number;
  withInstall: boolean;
  summary: string;
  includes?: string;
  images: string[];
  /** Imagen de la tarjeta (si no, se usa la primera de la galería) */
  cover?: string;
  category: 'equipo' | 'accesorio';
};

const kit =
  'Unidad interior (evaporadora), unidad exterior (condensadora), control remoto, kit de cañería de 4 m y cable de interconexión de 4,5 m.';

export const products: Product[] = [
  {
    id: 'midea-9000',
    cover: '/img/AIRE1.jpg',
    brand: 'Midea',
    name: 'Split muro 9.000 BTU',
    btu: 9000,
    inverter: false,
    wifi: true,
    price: 360000,
    withInstall: true,
    summary: 'Para dormitorios y espacios de hasta ~15 m².',
    includes: kit,
    images: [
      '/img/aire1/principal1.jpg',
      '/img/aire1/segunda1.jpg',
      '/img/aire1/tercera1.png',
      '/img/aire1/ultima1.jpg',
      '/img/aire1/penultima1.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'midea-9000-inverter',
    brand: 'Midea',
    name: 'Split muro 9.000 BTU Inverter',
    btu: 9000,
    inverter: true,
    wifi: true,
    price: 450000,
    withInstall: true,
    summary: 'Inverter: más silencioso y gasta menos luz. Hasta ~15 m².',
    includes: kit,
    images: [
      '/img/aire2/primera2.jpg',
      '/img/aire2/tercera2.jpg',
      '/img/aire2/segunda2.png',
      '/img/aire2/cuarta2.jpg',
      '/img/aire2/quinta2.png',
      '/img/aire2/penulatima2.jpg',
      '/img/aire2/ultima2.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'midea-12000',
    cover: '/img/AIRE1.jpg',
    brand: 'Midea',
    name: 'Split muro 12.000 BTU',
    btu: 12000,
    inverter: false,
    wifi: true,
    price: 410000,
    withInstall: true,
    summary: 'Para livings y dormitorios grandes de hasta ~22 m².',
    includes: kit,
    images: [
      '/img/aire1/principal1.jpg',
      '/img/aire1/segunda1.jpg',
      '/img/aire3/tercera3.png',
      '/img/aire3/cuarta3.jpg',
      '/img/aire3/quinta3.jpg',
      '/img/aire3/ultima3.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'midea-12000-inverter',
    brand: 'Midea',
    name: 'Split muro 12.000 BTU Inverter',
    btu: 12000,
    inverter: true,
    wifi: true,
    price: 510000,
    withInstall: true,
    summary: 'El más pedido: eficiente y silencioso. Hasta ~22 m².',
    includes: kit,
    images: [
      '/img/aire2/primera2.jpg',
      '/img/aire2/tercera2.jpg',
      '/img/aire2/segunda2.png',
      '/img/aire2/cuarta2.jpg',
      '/img/aire4/tercera4.png',
      '/img/aire4/penultima4.jpg',
      '/img/aire4/ultima4.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'hisense-12000-inverter',
    cover: '/img/AIREBRISA.jpg',
    brand: 'Hisense',
    name: 'Split muro 12.000 BTU Inverter',
    btu: 12000,
    inverter: true,
    wifi: true,
    price: 510000,
    withInstall: true,
    summary: 'Diseño compacto, modo sleep y filtro de alta densidad. Hasta ~22 m².',
    includes: kit,
    images: [
      '/img/aire7/primera6.jpg',
      '/img/aire7/segunda6.jpg',
      '/img/aire7/segunda62.jpg',
      '/img/aire7/quinta6.jpg',
      '/img/aire7/ultima6.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'midea-18000',
    cover: '/img/AIRE1.jpg',
    brand: 'Midea',
    name: 'Split muro 18.000 BTU',
    btu: 18000,
    inverter: false,
    wifi: true,
    price: 640000,
    withInstall: true,
    summary: 'Para espacios amplios, livings-comedor y locales de hasta ~35 m².',
    includes: kit,
    images: [
      '/img/aire1/principal1.jpg',
      '/img/aire1/segunda1.jpg',
      '/img/aire5/tercera5.png',
      '/img/aire3/cuarta3.jpg',
      '/img/aire5/penultima5.jpg',
      '/img/aire5/ultima5.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'midea-18000-inverter',
    brand: 'Midea',
    name: 'Split muro 18.000 BTU Inverter',
    btu: 18000,
    inverter: true,
    wifi: true,
    price: 770000,
    withInstall: true,
    summary: 'Máxima potencia con bajo consumo. Hasta ~35 m².',
    includes: kit,
    images: [
      '/img/aire2/primera2.jpg',
      '/img/aire2/tercera2.jpg',
      '/img/aire2/segunda2.png',
      '/img/aire2/cuarta2.jpg',
      '/img/aire6/tercera6.png',
      '/img/aire6/penultima6.jpg',
      '/img/aire6/ultima6.jpg',
    ],
    category: 'equipo',
  },
  {
    id: 'escuadra',
    brand: 'Genérico',
    name: 'Escuadra para unidad exterior',
    price: 25000,
    withInstall: false,
    summary: 'Par de escuadras con pernos y gomas antivibración.',
    images: ['/img/escuadra.jpg'],
    category: 'accesorio',
  },
];

export const installSteps = [
  'Montaje de la unidad interior',
  'Montaje de la unidad exterior (condensadora)',
  'Perforación del muro',
  'Desagüe de la unidad interior por gravedad',
  'Cañerías con aislación térmica (hasta 4 m)',
  'Puesta en marcha del equipo',
  'Prueba de funcionamiento',
  'Te enseñamos a usarlo y a cuidarlo',
];

export const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
