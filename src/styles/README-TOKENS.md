# Design Tokens - Guía de Uso

Sistema de tokens de diseño centralizado para el Portfolio & Blog de Juancadev. Todos los tokens están definidos en CSS puro y pueden usarse directamente en cualquier archivo CSS o en componentes Astro.

## 📁 Estructura

- `src/styles/tokens.css` - Definición de todos los tokens
- `src/layouts/Layout.astro` - Importa tokens en el layout principal

## 🎨 Categorías de Tokens

### Colores
```css
/* Marca */
--color-primary: #007FFF;      /* Azul */
--color-secondary: #FFA500;    /* Naranja */

/* UI */
--color-background
--color-surface
--color-text-primary
--color-text-secondary
--color-border

/* Semánticos */
--color-success
--color-warning
--color-error
--color-info
```

### Tipografía
```css
--font-family-primary: 'Lato'
--font-family-mono: 'Fira Code'
--font-size-base: 1rem
--font-weight-normal: 400
--line-height-normal: 1.5
```

### Espaciado
```css
--spacing-xs: 0.25rem   (4px)
--spacing-sm: 0.5rem    (8px)
--spacing-md: 1rem      (16px)
--spacing-lg: 1.5rem    (24px)
--spacing-xl: 2rem      (32px)
```

### Otros
```css
--radius-md        /* Border radius */
--shadow-md        /* Sombras */
--transition-base  /* Animaciones */
--z-modal          /* Z-index */
```

## 💡 Cómo Usar

### En CSS puro:
```css
.mi-componente {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  font-family: var(--font-family-primary);
  transition: all var(--transition-base);
}
```

### En componentes Astro (con atributo style):
```astro
<div style={`
  background-color: var(--color-primary);
  padding: var(--spacing-md);
`}>
  Contenido
</div>
```

### En componentes Astro (con clase CSS):
```astro
<div class="card card-elevated">
  <h2>Título</h2>
  <p class="text-secondary">Descripción</p>
</div>
```

## 🌓 Modo Oscuro

Los tokens se adaptan automáticamente al modo oscuro del sistema. No necesitas hacer nada especial, los valores se ajustan en `@media (prefers-color-scheme: dark)`.

## ✅ Ventajas

- ✅ **Consistencia**: Un único sistema para toda la aplicación
- ✅ **Mantenimiento**: Cambio centralizado de valores
- ✅ **Flexibilidad**: Funciona con CSS puro, Tailwind o Sass
- ✅ **Rendimiento**: Variables CSS nativas, sin overhead
- ✅ **Escalabilidad**: Fácil añadir nuevos tokens

## 📝 Ejemplo de Componente Completo

```astro
---
// Componente Astro usando tokens
---

<button class="btn btn-primary">
  Haz clic
</button>

<style>
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    border-radius: var(--radius-lg);
    transition: all var(--transition-base);
  }

  .btn:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }
</style>
```

## 🔧 Personalización

Para cambiar los tokens globalmente, edita `src/styles/tokens.css` en la sección `:root {}`.

Por ejemplo, cambiar el color primario:
```css
:root {
  --color-primary: #1a5490; /* Nuevo color */
}
```

El cambio se refleja automáticamente en toda la aplicación.

---

## 📚 Ejemplos de Componentes

### Botones

```astro
---
// Componente Astro - Botón usando tokens
---

<button class="btn btn-primary">Botón Primario</button>
<button class="btn btn-secondary">Botón Secundario</button>
<button class="btn btn-outline">Botón Outline</button>

<style>
  .btn {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    text-decoration: none;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .btn-primary:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    background-color: var(--color-secondary);
    color: var(--color-text-primary);
  }

  .btn-secondary:hover {
    background-color: var(--color-secondary-dark);
    box-shadow: var(--shadow-md);
  }

  .btn-outline {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  .btn-outline:hover {
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
  }
</style>
```

### Tarjetas

```astro
---
// Componente Astro - Tarjeta usando tokens
---

<article class="card">
  <h2>Título de la Tarjeta</h2>
  <p>Descripción del contenido de la tarjeta</p>
</article>

<style>
  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
  }

  .card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-border-hover);
    transform: translateY(-2px);
  }

  .card h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .card p {
    color: var(--color-text-secondary);
  }
</style>
```

### Formularios

```astro
---
// Componente Astro - Input usando tokens
---

<input 
  type="email" 
  placeholder="Tu correo..."
  class="input"
/>

<style>
  .input {
    width: 100%;
    padding: var(--spacing-sm);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    transition: border-color var(--transition-base);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 127, 255, 0.1);
  }
</style>
```

### Grid de Contenido

```astro
---
// Componente Astro - Grid responsivo
---

<section class="grid-container">
  <article class="card">
    <h3>Item 1</h3>
    <p>Contenido...</p>
  </article>
  <article class="card">
    <h3>Item 2</h3>
    <p>Contenido...</p>
  </article>
  <article class="card">
    <h3>Item 3</h3>
    <p>Contenido...</p>
  </article>
</section>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
  }

  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    transition: all var(--transition-base);
  }

  .card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr;
      padding: var(--spacing-md);
      gap: var(--spacing-md);
    }
  }
</style>
```

### Hero Section

```astro
---
// Componente Astro - Hero usando tokens
---

<section class="hero">
  <div class="hero-content">
    <h1>Bienvenido a Juancadev</h1>
    <p class="subtitle">Aprende desarrollo web y Godot Engine</p>
    <button class="btn btn-primary btn-lg">Comenzar</button>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-secondary) 100%
    );
    color: var(--color-text-inverse);
    padding: var(--spacing-4xl) var(--spacing-md);
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: var(--radius-2xl);
  }

  .hero h1 {
    font-size: var(--font-size-5xl);
    margin-bottom: var(--spacing-md);
    font-weight: var(--font-weight-bold);
  }

  .hero .subtitle {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-xl);
    opacity: 0.95;
  }

  .btn-lg {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-lg);
  }

  @media (max-width: 768px) {
    .hero {
      padding: var(--spacing-2xl) var(--spacing-md);
      min-height: auto;
    }

    .hero h1 {
      font-size: var(--font-size-3xl);
    }

    .hero .subtitle {
      font-size: var(--font-size-lg);
    }
  }
</style>
```

### Espaciado Utilities

```astro
---
// Clases utilitarias para espaciado rápido
---

<div class="p-lg mt-md mb-xl">
  <h2>Contenido con espaciado</h2>
</div>

<style>
  /* Padding */
  .p-xs { padding: var(--spacing-xs); }
  .p-sm { padding: var(--spacing-sm); }
  .p-md { padding: var(--spacing-md); }
  .p-lg { padding: var(--spacing-lg); }
  .p-xl { padding: var(--spacing-xl); }

  /* Margin Top */
  .mt-xs { margin-top: var(--spacing-xs); }
  .mt-sm { margin-top: var(--spacing-sm); }
  .mt-md { margin-top: var(--spacing-md); }
  .mt-lg { margin-top: var(--spacing-lg); }
  .mt-xl { margin-top: var(--spacing-xl); }

  /* Margin Bottom */
  .mb-xs { margin-bottom: var(--spacing-xs); }
  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
  .mb-xl { margin-bottom: var(--spacing-xl); }
</style>
```
