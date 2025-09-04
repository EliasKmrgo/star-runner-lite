# Star Runner Lite

Evaluación parcial en **JavaScript + Kaboom.js** que implementa un videojuego sencillo estilo plataforma.  
Se desarrolló aplicando principios de diseño de software (**SOLID**) y patrones de diseño (**Adapter**, **Facade**).

Presentada por los estudiantes:
* Elias Camargo Ochoa
* Arian Daza Ochoa
* Alexander niño
* Valeria Tocarruncho Mosquera

---

## Instrucciones para ejecutar el juego

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd star-runner-lite
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Ejecutar el servidor**

   ```bash
   npm start
   ```

   El servidor inicia en [http://localhost:3000](http://localhost:3000).

---
## Evidencia del conflicto resuelto

Durante el desarrollo surgió un **conflicto de rutas** (`../Resources/` con mayúscula vs `src/resources/` en minúscula).  
Esto generaba fallas al cargar mapas y sprites en entornos Linux (case-sensitive).


## Patrones y principios aplicados

### Adapter

Se utilizó en `MapManager.js` para adaptar los datos exportados desde **Tiled** (`Map.json`, `Tiles.tsx`) a objetos del motor **Kaboom**.  
El adapter traduce propiedades del mapa (`solid`, `coin`, `danger`, etc.) a componentes y etiquetas de Kaboom (`k.area()`, `k.body()`, `"coin"`, `"danger"`).

### Facade

Se aplicó en las clases:

* `GameFacade`
* `StartFacade`
* `GameOverFacade`

Estas encapsulan la lógica interna de cada pantalla y exponen métodos simples (`init()`, `run()`, `endGame()`).  
Así el resto del sistema no necesita conocer los detalles de cada manager.

### SOLID

* **S (Single Responsibility):** cada manager (`AssetsManager`, `MapManager`, `CollisionManager`, etc.) tiene una única responsabilidad.
* **O (Open/Closed):** es fácil extender el juego (ej. añadir un nuevo tipo de objeto en el mapa) sin modificar el código existente.
* **L (Liskov Substitution):** las vistas implementan contratos que podrían ser reemplazados por otras implementaciones sin romper el sistema.
* **I (Interface Segregation):** se definieron interfaces claras (`IGameView`, `IGamePresenter`) que separan responsabilidades.
* **D (Dependency Inversion):** los presenters no dependen directamente de Kaboom ni de la vista concreta, sino de interfaces (`IGameView`).

---

## Evidencia visual

* Pantalla de inicio con ingreso de nombre.
* Escenario generado con tiles de Tiled.
* Jugador moviéndose y recogiendo monedas.
* Pantalla de Game Over con opciones de reinicio y Top 10.

---

## Estado del proyecto

* Juego funcional con Kaboom.js.
* Organización en capas (Views, Presenters, Models).
* Aplicación de principios SOLID y patrones de diseño.
* Conflicto de rutas resuelto y documentado.

---
