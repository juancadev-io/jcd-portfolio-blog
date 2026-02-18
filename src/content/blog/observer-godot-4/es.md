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

El patrón **Observer** permite que múltiples objetos reaccionen a eventos sin conocerse directamente. En Godot, las **señales** resuelven esto perfecto... hasta que necesitas **comunicación global** entre escenas, UI, gameplay y servicios.

Ahí entra el **EventBus**: un singleton que centraliza eventos y permite desacoplar completamente emisores de receptores.

En este artículo veremos **4 implementaciones progresivas**, desde la más simple hasta una con **validación UI integrada** en el Inspector de Godot:

1. **EventBus Básico** - Lo mínimo funcional
2. **EventBus con Tipado Débil** - Usando strings
3. **EventBus Tipado** - Con StringName y constantes
4. **EventBus con UI** - Integrado al Inspector de Godot

---

# 🎯 ¿Qué problemas resuelve un EventBus?

**Sin EventBus:**
```gdscript
# Player.gd necesita referencia directa al HUD
@onready var hud = get_node("/root/Main/HUD")

func take_damage(amount: int):
	health -= amount
	hud.update_health(health) # Acoplamiento directo
```

**Con EventBus:**
```gdscript
# Player.gd no conoce al HUD
func take_damage(amount: int):
	health -= amount
	EventBus.emit("health_changed", health)

# HUD.gd se suscribe al evento
func _ready():
	EventBus.on("health_changed", _update_health)
```

✅ **Beneficios:**
- Desacoplamiento total
- Fácil de testear
- Escalable para juegos grandes
- No necesitas referencias entre nodos

---

# 1️⃣ EventBus Básico - Lo mínimo funcional

La versión más simple usa señales de Godot directamente.

### `EventBus.gd` (Autoload)

```gdscript
extends Node

# Diccionario de señales dinámicas
var _signals: Dictionary = {}

func emit(event_name: String, data = null) -> void:
	if not _signals.has(event_name):
		return
	
	if data == null:
		_signals[event_name].emit()
	else:
		_signals[event_name].emit(data)

func on(event_name: String, callable: Callable) -> void:
	if not _signals.has(event_name):
		_signals[event_name] = Signal()
		add_user_signal(event_name)
	
	if not is_connected(event_name, callable):
		connect(event_name, callable)

func off(event_name: String, callable: Callable) -> void:
	if is_connected(event_name, callable):
		disconnect(event_name, callable)
```

### Uso básico

```gdscript
# Emisor - Coin.gd
func _on_collected():
	EventBus.emit("coin_collected", 5)

# Receptor - HUD.gd
func _ready():
	EventBus.on("coin_collected", _on_coin)

func _on_coin(amount: int):
	coins += amount
	label.text = "Coins: %d" % coins
```

✅ **Ventajas:**
- Código mínimo
- Funciona de inmediato
- Fácil de entender

❌ **Desventajas:**
- Sin validación de eventos
- Errores de typo silenciosos
- Sin autocompletado

---

# 2️⃣ EventBus con Tipado Débil - Strings organizados

Mejoramos usando un diccionario de listeners y validación básica.

### `EventBus.gd`

```gdscript
extends Node

var _listeners: Dictionary = {}

func emit(event_name: String, payload: Dictionary = {}) -> void:
	if not _listeners.has(event_name):
		return
	
	for listener in _listeners[event_name]:
		if is_instance_valid(listener.target):
			listener.target.call(listener.method, payload)

func on(event_name: String, target: Object, method: String) -> void:
	if not target.has_method(method):
		push_warning("Método '%s' no existe en %s" % [method, target])
		return
	
	if not _listeners.has(event_name):
		_listeners[event_name] = []
	
	_listeners[event_name].append({
		"target": target,
		"method": method
	})

func off(event_name: String, target: Object) -> void:
	if not _listeners.has(event_name):
		return
	
	_listeners[event_name] = _listeners[event_name].filter(
		func(l): return l.target != target
	)
```

### Uso

```gdscript
# Emisor
EventBus.emit("health_changed", {"current": 80, "max": 100})

# Receptor
func _ready():
	EventBus.on("health_changed", self, "_on_health_changed")

func _on_health_changed(data: Dictionary):
	health_bar.value = data.current
	health_label.text = "%d/%d" % [data.current, data.max]
```

✅ **Ventajas:**
- Validación de métodos
- Payload estructurado (Dictionary)
- Cleanup automático

❌ **Desventajas:**
- Aún sin validación de eventos
- Sin autocompletado en el editor

---

# 3️⃣ EventBus Tipado - Constantes y validación
Ahora centralizamos los eventos disponibles en constantes para tener autocompletado y validación.

### `GameEvents.gd`

```gdscript
extends Node
class_name GameEvents

# Eventos disponibles con nombre sugerido del handler
const EVENTS := {
	&"coin_collected": "_on_coin_collected",
	&"health_changed": "_on_health_changed",
	&"enemy_died": "_on_enemy_died",
	&"level_completed": "_on_level_completed",
}

# Constantes para autocompletado
const COIN_COLLECTED := &"coin_collected"
const HEALTH_CHANGED := &"health_changed"
const ENEMY_DIED := &"enemy_died"
const LEVEL_COMPLETED := &"level_completed"

static func is_valid(event_name: StringName) -> bool:
	return EVENTS.has(event_name)

static func get_suggested_method(event_name: StringName) -> String:
	return EVENTS.get(event_name, "")
```

### `EventBus.gd` (mejorado)

```gdscript
extends Node

var _listeners: Dictionary = {}

func emit_event(event_name: StringName, payload: Dictionary = {}) -> void:
	if not GameEvents.is_valid(event_name):
		push_error("Evento no registrado: %s" % event_name)
		return
	
	if not _listeners.has(event_name):
		return
	
	for listener in _listeners[event_name]:
		if is_instance_valid(listener.target):
			listener.target.call(listener.method, payload)

func subscribe(event_name: StringName, target: Object, method: String = "") -> void:
	if not GameEvents.is_valid(event_name):
		push_error("Evento no registrado: %s" % event_name)
		return
	
	# Si no se especifica método, usa el sugerido
	if method.is_empty():
		method = GameEvents.get_suggested_method(event_name)
	
	if not target.has_method(method):
		push_error("Método '%s' no existe en %s" % [method, target.get_class()])
		return
	
	if not _listeners.has(event_name):
		_listeners[event_name] = []
	
	_listeners[event_name].append({"target": target, "method": method})

func unsubscribe(event_name: StringName, target: Object) -> void:
	if not _listeners.has(event_name):
		return
	
	_listeners[event_name] = _listeners[event_name].filter(
		func(l): return l.target != target
	)

func unsubscribe_all(target: Object) -> void:
	for event_name in _listeners.keys():
		unsubscribe(event_name, target)
```

### Uso tipado

```gdscript
# Emisor - Coin.gd
func _on_body_entered(body):
	EventBus.emit_event(GameEvents.COIN_COLLECTED, {"amount": 5})
	queue_free()

# Receptor - HUD.gd
func _ready():
	# Opción 1: método automático
	EventBus.subscribe(GameEvents.COIN_COLLECTED, self)
	
	# Opción 2: método custom
	EventBus.subscribe(GameEvents.HEALTH_CHANGED, self, "_update_hp")

func _on_coin_collected(data: Dictionary):
	coins += data.amount
	coin_label.text = str(coins)

func _update_hp(data: Dictionary):
	hp_bar.value = data.current
```

✅ **Ventajas:**
- Autocompletado con `GameEvents.`
- Validación en tiempo de ejecución
- Método sugerido automático
- Un solo lugar para definir eventos

❌ **Desventajas:**
- Todavía no visible en el Inspector

---

# 4️⃣ EventBus con UI - Integrado al Inspector

Esta es la versión más avanzada: permite seleccionar eventos desde el Inspector de Godot con un dropdown.

### `GameEvents.gd` (mejorado con hints)

```gdscript
extends Node
class_name GameEvents

# Eventos disponibles
enum EventType {
	COIN_COLLECTED,
	HEALTH_CHANGED,
	ENEMY_DIED,
	LEVEL_COMPLETED,
	PLAYER_DIED,
	GAME_PAUSED,
}

# Mapeo de enum a StringName
const EVENT_NAMES := {
	EventType.COIN_COLLECTED: &"coin_collected",
	EventType.HEALTH_CHANGED: &"health_changed",
	EventType.ENEMY_DIED: &"enemy_died",
	EventType.LEVEL_COMPLETED: &"level_completed",
	EventType.PLAYER_DIED: &"player_died",
	EventType.GAME_PAUSED: &"game_paused",
}

# Métodos sugeridos
const SUGGESTED_METHODS := {
	EventType.COIN_COLLECTED: "_on_coin_collected",
	EventType.HEALTH_CHANGED: "_on_health_changed",
	EventType.ENEMY_DIED: "_on_enemy_died",
	EventType.LEVEL_COMPLETED: "_on_level_completed",
	EventType.PLAYER_DIED: "_on_player_died",
	EventType.GAME_PAUSED: "_on_game_paused",
}

static func get_event_name(event_type: EventType) -> StringName:
	return EVENT_NAMES.get(event_type, &"")

static func get_suggested_method(event_type: EventType) -> String:
	return SUGGESTED_METHODS.get(event_type, "")

static func is_valid(event_type: EventType) -> bool:
	return EVENT_NAMES.has(event_type)
```

### `EventListener.gd` - Nodo para conectar desde Inspector

```gdscript
@tool
extends Node
class_name EventListener

@export var event_type: GameEvents.EventType = GameEvents.EventType.COIN_COLLECTED
@export var custom_method: String = ""
@export var auto_connect: bool = true

var _connected := false

func _ready():
	if Engine.is_editor_hint():
		return
	
	if auto_connect:
		connect_to_event()

func connect_to_event() -> void:
	if _connected:
		return
	
	var method := custom_method if not custom_method.is_empty() else ""
	var target := get_parent()
	
	if target:
		EventBus.subscribe(event_type, target, method)
		_connected = true

func disconnect_from_event() -> void:
	if not _connected:
		return
	
	var event_name := GameEvents.get_event_name(event_type)
	EventBus.unsubscribe(event_name, get_parent())
	_connected = false

func _exit_tree():
	if not Engine.is_editor_hint():
		disconnect_from_event()
```

### `EventEmitter.gd` - Nodo para emitir desde Inspector

```gdscript
@tool
extends Node
class_name EventEmitter

@export var event_type: GameEvents.EventType = GameEvents.EventType.COIN_COLLECTED
@export var payload_data: Dictionary = {}

func emit_event(custom_payload: Dictionary = {}) -> void:
	if Engine.is_editor_hint():
		return
	
	var data := custom_payload if not custom_payload.is_empty() else payload_data
	EventBus.emit_event(event_type, data)
```

### `EventBus.gd` (versión final con enum)

```gdscript
extends Node

var _listeners: Dictionary = {}

func emit_event(event_type: GameEvents.EventType, payload: Dictionary = {}) -> void:
	if not GameEvents.is_valid(event_type):
		push_error("Evento no válido: %d" % event_type)
		return
	
	var event_name := GameEvents.get_event_name(event_type)
	
	if not _listeners.has(event_name):
		return
	
	for listener in _listeners[event_name]:
		if is_instance_valid(listener.target):
			listener.target.call(listener.method, payload)

func subscribe(event_type: GameEvents.EventType, target: Object, method: String = "") -> void:
	if not GameEvents.is_valid(event_type):
		push_error("Evento no válido: %d" % event_type)
		return
	
	var event_name := GameEvents.get_event_name(event_type)
	
	# Método sugerido si no se especifica
	if method.is_empty():
		method = GameEvents.get_suggested_method(event_type)
	
	if not target.has_method(method):
		push_error("Método '%s' no existe en %s" % [method, target.get_class()])
		return
	
	if not _listeners.has(event_name):
		_listeners[event_name] = []
	
	_listeners[event_name].append({"target": target, "method": method})
	print("✅ Suscrito: %s -> %s.%s()" % [event_name, target.name, method])

func unsubscribe(event_name: StringName, target: Object) -> void:
	if not _listeners.has(event_name):
		return
	
	_listeners[event_name] = _listeners[event_name].filter(
		func(l): return l.target != target
	)

func get_listener_count(event_type: GameEvents.EventType) -> int:
	var event_name := GameEvents.get_event_name(event_type)
	return _listeners.get(event_name, []).size()

func debug_print_listeners() -> void:
	print("\n=== EventBus Listeners ===")
	for event_name in _listeners.keys():
		print("%s: %d listeners" % [event_name, _listeners[event_name].size()])
		for l in _listeners[event_name]:
			print("  - %s.%s()" % [l.target.name, l.method])
```

### Uso desde el Inspector

**Ejemplo 1: Listener desde UI**

1. Crea un nodo `HUD` con script
2. Añade un hijo `EventListener`
3. En el Inspector:
   - `Event Type`: `COIN_COLLECTED`
   - `Auto Connect`: ✅

```gdscript
# HUD.gd
extends Control

func _on_coin_collected(data: Dictionary):
	$CoinLabel.text = "Coins: %d" % data.amount
```

**Ejemplo 2: Emitter desde nodo**

1. Crea un nodo `Coin` con `Area2D`
2. Añade un hijo `EventEmitter`
3. En el Inspector:
   - `Event Type`: `COIN_COLLECTED`
   - `Payload Data`: `{"amount": 5}`

```gdscript
# Coin.gd
extends Area2D

@onready var emitter = $EventEmitter

func _on_body_entered(body):
	emitter.emit_event()
	queue_free()
```

### Screenshots conceptuales del Inspector

```
┌─────────────────────────────┐
│ EventListener               │
├─────────────────────────────┤
│ Event Type: [COIN_COLLECTED▼]│
│ Custom Method: (vacío)      │
│ Auto Connect: ☑             │
└─────────────────────────────┘

┌─────────────────────────────┐
│ EventEmitter                │
├─────────────────────────────┤
│ Event Type: [HEALTH_CHANGED▼]│
│ Payload Data:               │
│   current: 80               │
│   max: 100                  │
└─────────────────────────────┘
```

✅ **Ventajas:**
- Dropdown visual en el Inspector
- No necesitas escribir strings
- Imposible cometer typos
- Validación automática
- Ideal para diseñadores

---

# 📊 Comparación de las 4 implementaciones

| Característica | Básico | Tipado Débil | Tipado | Con UI |
|---|---|---|---|---|
| Complejidad | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Autocompletado | ❌ | ❌ | ✅ | ✅ |
| Validación | ❌ | Parcial | ✅ | ✅ |
| Inspector | ❌ | ❌ | ❌ | ✅ |
| Typo-safe | ❌ | ❌ | ✅ | ✅ |
| Para diseñadores | ❌ | ❌ | ❌ | ✅ |

### ¿Cuál usar?

- **Básico**: Prototipado rápido, juegos pequeños
- **Tipado Débil**: Proyectos medianos sin UI
- **Tipado**: Código limpio, proyectos grandes
- **Con UI**: Equipos, diseñadores sin código

---

# 🛠️ Configuración paso a paso (versión UI)

### 1. Configurar Autoload

En `Project > Project Settings > Autoload`:
- Añade `EventBus.gd` como `EventBus`

### 2. Registrar GameEvents como clase

Asegúrate de que `GameEvents.gd` tenga `class_name GameEvents` para que aparezca en el autocompletado.

### 3. Crear nodos helper

Guarda `EventListener.gd` y `EventEmitter.gd` en tu carpeta de scripts.

### 4. Ejemplo completo de juego

**Estructura de escena:**

```
Game
├── Player
│   └── EventEmitter (COIN_COLLECTED)
├── HUD
│   ├── EventListener (COIN_COLLECTED)
│   └── EventListener (HEALTH_CHANGED)
└── Enemy
    └── EventEmitter (ENEMY_DIED)
```

**Player.gd:**
```gdscript
extends CharacterBody2D

@onready var coin_emitter = $EventEmitter

func collect_coin():
	coin_emitter.emit_event({"amount": 10})
```

**HUD.gd:**
```gdscript
extends Control

var coins := 0
var health := 100

# Automáticamente conectado por EventListener
func _on_coin_collected(data: Dictionary):
	coins += data.amount
	$CoinLabel.text = "💰 %d" % coins

func _on_health_changed(data: Dictionary):
	health = data.current
	$HealthBar.value = health
```

---

# 🧪 Testing y Debug

### Ver listeners activos

```gdscript
func _ready():
	# En desarrollo
	EventBus.debug_print_listeners()
```

Output:
```
=== EventBus Listeners ===
coin_collected: 2 listeners
  - HUD._on_coin_collected()
  - ScoreManager._update_score()
health_changed: 1 listeners
  - HUD._on_health_changed()
```

### Contador de listeners

```gdscript
var count = EventBus.get_listener_count(GameEvents.EventType.COIN_COLLECTED)
print("Listeners para monedas: %d" % count)
```

---

# ⚠️ Buenas prácticas

### 1. Cleanup automático
```gdscript
# ❌ MAL: Memory leak
func _ready():
	EventBus.subscribe(GameEvents.EventType.COIN_COLLECTED, self)

# ✅ BIEN: Con EventListener hijo se limpia solo
# O si usas subscribe manual:
func _exit_tree():
	EventBus.unsubscribe_all(self)
```

### 2. Evitar suscripciones múltiples
```gdscript
var _subscribed := false

func _ready():
	if not _subscribed:
		EventBus.subscribe(GameEvents.EventType.COIN_COLLECTED, self)
		_subscribed = true
```

### 3. Payload consistente
```gdscript
# ✅ BIEN: Siempre usa las mismas keys
EventBus.emit_event(GameEvents.EventType.HEALTH_CHANGED, {
	"current": 80,
	"max": 100
})

# ❌ MAL: Keys inconsistentes
EventBus.emit_event(GameEvents.EventType.HEALTH_CHANGED, {
	"hp": 80  # ← nombre diferente
})
```

### 4. Documentar payloads esperados
```gdscript
# En GameEvents.gd agrega comentarios:
const EVENT_NAMES := {
	# Payload: {"amount": int}
	EventType.COIN_COLLECTED: &"coin_collected",
	
	# Payload: {"current": int, "max": int}
	EventType.HEALTH_CHANGED: &"health_changed",
}
```

---

# 🎯 Conclusión

El patrón **Observer con EventBus** te da:
- ✅ **Desacoplamiento total** entre sistemas
- ✅ **Escalabilidad** para proyectos grandes
- ✅ **Flexibilidad** desde código simple hasta UI integrada

### Cuando usar cada versión:

**EventBus Básico** → Prototipos, game jams, proyectos de fin de semana

**EventBus Tipado Débil** → Proyectos medianos donde solo programadores tocan el código

**EventBus Tipado** → Proyectos serios con múltiples programadores

**EventBus con UI** → Equipos con diseñadores, artistas, o productores que configuran eventos

---

# 📚 Recursos adicionales

- [Documentación oficial de señales en Godot](https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html)
- [GDQuest - Event Bus Pattern](https://www.gdquest.com/)
- [Patrón Observer - RefactoringGuru](https://refactoring.guru/design-patterns/observer)

---

# 💬 ¿Preguntas?

Si este artículo te ayudó, compártelo. Si tienes dudas o mejoras, déjame un comentario.

**Happy coding! 🎮**