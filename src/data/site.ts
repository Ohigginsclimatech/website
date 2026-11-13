// ─────────────────────────────────────────────────────────────
//  Datos del negocio. Edita aquí y se actualiza en todo el sitio.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Olivar Clima',
  slogan: 'Clima de confianza, como en familia.',
  tagline:
    'Somos vecinos de Olivar. Vendemos, instalamos y mantenemos aire acondicionado en los hogares y negocios de la Sexta Región, con el trato cercano de siempre.',
  url: 'https://olivarclima.cl',

  phoneDisplay: '+56 9 6711 7131',
  phoneHref: 'tel:+56967117131',
  whatsapp: '56967117131',

  // TODO: cuando tengas un correo con el dominio nuevo (ej. contacto@olivarclima.cl), cámbialo aquí.
  email: 'ohigginsclimatech@gmail.com',
  // TODO: si renombras la cuenta de Instagram, actualiza este enlace.
  instagram: 'https://www.instagram.com/ohiggins_climatech/',

  address: {
    street: 'Pasaje Guzmán 25',
    locality: 'Olivar Bajo',
    region: "Región del Libertador General Bernardo O'Higgins",
    country: 'CL',
  },
} as const;

export const comunas = [
  'Olivar Alto',
  'Olivar Bajo',
  'Rancagua',
  'Coinco',
  'Doñihue',
  'Lo Miranda',
  'Coltauco',
  'Graneros',
  'Requínoa',
  'Rengo',
  'Quinta de Tilcoco',
  'Chillehue',
  'Copequén',
  'Millahue',
  'El Rulo',
] as const;

export function waLink(message = 'Hola Olivar Clima, me gustaría cotizar.') {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
