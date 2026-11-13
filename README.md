# Olivar Clima

**Clima de confianza, como en familia.** Sitio web de Olivar Clima: venta, instalación y mantención de aire acondicionado en la Sexta Región.

Hecho con [Astro](https://astro.build) + React. Se publica solo en GitHub Pages cada vez que se sube un cambio a `main`.

## Editar contenido

| Qué quieres cambiar | Archivo |
|---|---|
| Teléfono, correo, Instagram, dirección, slogan, comunas | `src/data/site.ts` |
| Precios, equipos, fotos, pasos de instalación | `src/data/products.ts` |
| Preguntas frecuentes | `src/components/Faq.astro` |
| Colores y tipografías | `src/styles/global.css` |

Las fotos van en `public/img/`.

## Trabajar en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera la carpeta dist/
```

## Dominio

El dominio está en `public/CNAME` (`olivarclima.cl`).
