// ─────────────────────────────────────────────────────────────
//  El catálogo vive en products.json y se edita con el
//  administrador de escritorio (carpeta admin/).
//  La primera imagen de cada producto es la portada.
// ─────────────────────────────────────────────────────────────
import data from './products.json';

export type Product = {
  id: string;
  brand: string;
  name: string;
  btu?: number;
  inverter?: boolean;
  wifi?: boolean;
  price: number;
  withInstall: boolean;
  summary: string;
  includes?: string;
  images: string[];
  category: 'equipo' | 'accesorio';
  visible?: boolean;
};

export const products: Product[] = (data as Product[]).filter((p) => p.visible !== false);

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
