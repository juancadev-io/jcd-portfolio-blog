---
applyTo: 'godot/**/*.gd'
---

# Instrucciones Técnicas - Godot Engine

**Enfoque:** Desarrollo de juegos 2D/3D con Godot 4.x y GDScript.

## 🎮 GDScript (Godot 4.x)

### Sintaxis y Tipado
- Usar GDScript 2.0 (Godot 4.x+)
- Incluir type hints siempre que sea posible
- Mejorar legibilidad y rendimiento

### Variables y Exports
- Usar `@export` para variables editables en Inspector
- Nombrado claro y descriptivo
- Comentarios que expliquen contexto en el juego

### Funciones
- Nombres descriptivos en español o inglés
- Type hints en parámetros y retorno
- Documentación de propósito

## 📁 Estructura de Proyectos

Mantener organización limpia:
```
proyecto/
├── assets/          # Sprites, texturas, sonidos
├── scenes/          # Escenas .tscn
├── scripts/         # Código GDScript
├── ui/              # Nodos de interfaz
└── config/          # Configuraciones
```

## 🔗 Conceptos de Programación

- **Señales:** Sistema de eventos (similar a event listeners en JavaScript)
- **Herencia:** Uso de clases base para reutilización
- **Physics:** CharacterBody2D, RigidBody2D, StaticBody2D
- **Tweening:** Animaciones suaves con Tween
- **Nodos:** Jerarquía clara y nombrado descriptivo

## 📚 Contenido Educativo

- Ejemplos mínimos pero funcionales
- Explicar conceptos paso a paso
- Conectar Godot con desarrollo web cuando aplique
- Código comentado para claridad
