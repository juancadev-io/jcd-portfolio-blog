# 📁 Configuración GitHub - Juancadev Portfolio & Blog

Esta carpeta contiene la configuración, instrucciones y documentación para el repositorio de Juancadev.

## 📂 Estructura

```
.github/
├── instructions/                      # Reglas técnicas por contexto
│   ├── juancadev-io.instructions.md  # Directrices generales (aplica a todo)
│   ├── webdev.instructions.md        # Reglas técnicas: Desarrollo Web
│   └── godot.instructions.md         # Reglas técnicas: Godot Engine
│
├── prompts/                          # Contexto de negocio para AI
│   ├── general.prompt.txt            # Contexto general del proyecto
│   ├── webdev.prompt.txt             # Contexto: Desarrollo Web
│   └── godot.prompt.txt              # Contexto: Godot Engine
│
├── docs/                             # Documentación estratégica
│   └── Estrategia Transmedia...      # Plan de contenido para múltiples plataformas
│
└── workflows/                        # GitHub Actions (futuro)
```

## 🎯 Diferencia entre Carpetas

### `instructions/` - Reglas Técnicas
- Qué estándares seguir
- Cómo escribir código
- Estructura de proyectos
- Se usan con `applyTo` para dirigirse a archivos específicos

### `prompts/` - Contexto de Negocio
- Por qué hacemos esto
- Objetivos del proyecto
- Audiencia y plataformas
- Tecnologías priorizadas

### `docs/` - Documentación Estratégica
- Plan de contenido
- Estrategia transmedia
- Visión del proyecto

## 📋 Cómo Usar

### Para Copilot / AI
1. Lee `instructions/juancadev-io.instructions.md` (siempre)
2. Complementa con la instrucción específica según contexto:
   - Web Dev → `instructions/webdev.instructions.md`
   - Godot → `instructions/godot.instructions.md`
3. Revisa `prompts/` para entender el contexto de negocio

### Para el Equipo
- **Contexto General:** `prompts/general.prompt.txt`
- **Tecnologías:** `instructions/juancadev-io.instructions.md`
- **Plan Estratégico:** `docs/Estrategia Transmedia...`

## 🎨 Identidad de Marca (Referencia Rápida)

- **Colores:** Azul `#007FFF` | Naranja `#FFA500`
- **Tipografía:** Lato
- **Pilares:** Desarrollo Web + Godot Engine
- **Tono:** Profesional, educativo, entusiasta y accesible

---

*Última actualización: Enero 2026*
