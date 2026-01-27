# JCD Portfolio & Blog

Sitio personal de JuancaDev (JCD) construido con Astro. Incluye portafolio, blog, etiquetas, páginas multi‑idioma y RSS.

## ✨ Secciones

- Inicio y presentación
- Portafolio / trabajos
- Blog con paginación y tags
- Contenido multi‑idioma (ES/EN)
- RSS y robots

## 🧱 Estructura del proyecto

```text
/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── blog/
│   ├── i18n/
│   ├── layouts/
│   ├── pages/
│   │   └── [lang]/
│   └── styles/
└── package.json
```

## 🚀 Comandos

| Comando           | Acción                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Instala dependencias                        |
| `npm run dev`     | Servidor local en `localhost:4321`          |
| `npm run build`   | Construye a `./dist/`                       |
| `npm run preview` | Previsualiza el build local                 |

## 📝 Contenido del blog

Los posts viven en `src/content/blog/` y soportan ES/EN. Cada entrada tiene su carpeta con `es.md` y `en.md` (y assets si aplica).

## 📦 Tecnologías

- Astro
- TypeScript
- CSS (tokens y estilos globales)

## 📬 Contacto

Si ves algo para mejorar, abre un issue en GitHub o envíame un mensaje.

- Issues: https://github.com/juancadev-io/jcd-portfolio-blog/issues
- Contacto: /es/about y /en/about
