---
title: "Observer en Godot 4: EventBus tipado con eventos constantes"
description: "Implementa Observer con un EventBus global, eventos definidos en constantes y validación simple desde la UI de Godot."
pubDate: "2026-02-03"
updatedDate: "2026-02-03"
author: "JuancaDev"
lang: "es"
tags:
  [
    "godot4",
    "patrones-de-diseno",
    "observer",
    "event-bus",
    "arquitectura",
    "gdscript",
    "game-dev",
  ]
---

El patrón **Observer** en Godot normalmente se resuelve con **señales**, y funciona perfecto cuando los nodos están en la misma escena o se conocen entre sí. El problema aparece cuando quieres **comunicación global** entre escenas, UI, gameplay y servicios sin acoplarlos.

Aquí es donde entra un **EventBus**: un singleton que centraliza los eventos y permite que cualquier nodo **emita** y **escuche** sin saber quién está del otro lado.

La idea de este post es: **Observer + EventBus tipado** usando **eventos constantes** para que el editor valide desde la UI y sea fácil de mantener.

---

# ✅ Objetivo
Queremos un bus con eventos **predefinidos** y **validables**, así:

```gdscript
const BUS := {
	"coin_collected": "_on_coin",
	"health_changed": "_on_hp",
}

EventBus.emit_event(&"coin_collected", {"amount": 5})
EventBus.emit_event(&"health_changed", {"current": 80, "max": 100})
```

Esto nos permite:
- ✅ Autocompletado en el editor (StringName)
- ✅ Validación simple desde UI
- ✅ Menos errores por strings mal escritos

---

# 1️⃣ Definir eventos como constantes
Vamos a centralizar los eventos en un script dedicado.

### `GameEvents.gd`

```gdscript
extends Node
class_name GameEvents

# Mapa de evento -> método recomendado (convención)
const BUS := {
	&"coin_collected": "_on_coin",
	&"health_changed": "_on_hp",
}

# (Opcional) constantes para autocompletado rápido
const COIN_COLLECTED := &"coin_collected"
const HEALTH_CHANGED := &"health_changed"

static func is_valid_event(event_name: StringName) -> bool:
	return BUS.has(event_name)
```

✅ **Ventaja:** si cambias el nombre de un evento, lo haces en un solo lugar.

---

# 2️⃣ Crear el EventBus global
Lo más práctico es registrarlo como **Autoload**.

### `EventBus.gd`

```gdscript
extends Node
class_name EventBus

var _listeners: Dictionary = {}

func subscribe(event_name: StringName, target: Object, method: String) -> void:
	if not GameEvents.is_valid_event(event_name):
		push_warning("Evento no registrado: %s" % event_name)
		return

	if not target.has_method(method):
		push_warning("Método no existe: %s" % method)
		return

	if not _listeners.has(event_name):
		_listeners[event_name] = []

	_listeners[event_name].append({"target": target, "method": method})

func unsubscribe(event_name: StringName, target: Object) -> void:
	if not _listeners.has(event_name):
		return

	_listeners[event_name] = _listeners[event_name].filter(func(l):
		return l.target != target
	)

func emit_event(event_name: StringName, payload := {}) -> void:
	if not _listeners.has(event_name):
		return

	for l in _listeners[event_name]:
		l.target.call(l.method, payload)
```

---

# 3️⃣ Conectar desde scripts (Observer real)

### `Coin.gd`

```gdscript
func _on_collected():
	EventBus.emit_event(GameEvents.COIN_COLLECTED, {"amount": 5})
```

### `HUD.gd`

```gdscript
func _ready():
	EventBus.subscribe(GameEvents.COIN_COLLECTED, self, "_on_coin")
	EventBus.subscribe(GameEvents.HEALTH_CHANGED, self, "_on_hp")

func _on_coin(data: Dictionary) -> void:
	coin_label.text = str(data.amount)

func _on_hp(data: Dictionary) -> void:
	hp_label.text = "%s / %s" % [data.current, data.max]
```

---

# 4️⃣ Validación desde UI (Inspector friendly)
Si quieres que un nodo pueda escoger el evento desde el inspector, usa `StringName` y valida contra el `BUS`.

### `EventListener.gd`

```gdscript
extends Node

@export var event_name: StringName = GameEvents.COIN_COLLECTED

func _ready():
	if not GameEvents.is_valid_event(event_name):
		push_error("Evento inválido: %s" % event_name)
		return

	var method_name := GameEvents.BUS[event_name]
	EventBus.subscribe(event_name, self, method_name)
```

✅ Así puedes cambiar el evento desde la UI y no romper el flujo.

---

# 🧠 ¿Por qué esto ayuda?

- **Tipado básico** con `StringName`.
- **Centralización** de eventos en un solo archivo.
- **Validación** fácil antes de suscribirte.
- **Escalabilidad** cuando el juego crece.

---

# 🎯 Conclusión
Usar Observer con EventBus en Godot te da **desacoplamiento real** entre sistemas. Si además defines los eventos como constantes, tendrás **menos errores**, **mejor autocompletado** y **validación desde la UI**.

El patrón no es complejo, pero sí muy poderoso cuando el proyecto crece.

---
