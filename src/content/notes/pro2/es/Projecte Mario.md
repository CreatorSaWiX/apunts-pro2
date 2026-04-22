---
title: "Projecte Mario"
description: "Resumen del proyecto y solucionarios de los problemas"
readTime: "15 min"
order: 14
draft: false
isNew: true
---

## Resumen de arquitectura 

Esta tabla resume el **"dónde y qué"** del proyecto para validar tu comprensión:

| Archivo | Rol | Conceptos |
| :--- | :--- | :--- |
| **`main.cc`** | Bucle Principal | `main_loop()`: Orquestra la frecuencia y el cierre. |
| **`game.hh/cc`** | Orquestrador | Crea instancias (Mario, Plataformas). Mueve la cámara. |
| **`mario.hh/cc`** | Entidad Jugador | Lógica de salto, gravedad y control de teclas. |
| **`geometry.hh`** | Datos Base | `Pt` (posición), `Rect` (colisiones/sprites). |
| **`utils.hh/cc`** | Utilidades Pintado | Funciones de líneas y rectángulos (píxel a píxel). |

### El bucle de juego
1. **Input**: `process_keys()` detecta teclas. El cierre se controla con `finished_`.
2. **Física**: `update_objects()` aplica movimientos. La gravedad se añade a la velocidad vertical.
3. **Cámara**: `update_camera()` calcula el `topleft` de la vista siguiendo al jugador.
4. **Pintado**: `paint()` recorre objetos y dibuja. ¡El orden (capas) importa!

### Física y lógica
*   **Gravedad**: Cada frame sumamos un valor a la v. vertical. El salto consiste en poner esta velocidad en negativo.
*   **Colisiones**: Se comprueban vía `overlaps` comparando `Rect`. Mario es un `Rect` dinámico.
*   **Ejes**: Origen (0,0) arriba-izquierda. X crece a la derecha, Y crece **hacia abajo**.

---
## Parte 0: Ejercicios iniciales

:::accordion{title="**Ejercicio 0.1**: Pausa del juego"}
Se ha implementado una funcionalidad de pausa que permite congelar el estado del juego pulsando la tecla **'P'**.

```cpp [game.hh]
class Game {
    // ...
    bool finished_;
+   bool paused_; // Nuevo estado para la pausa
    // ...
};
```

```cpp [window.hh]
enum Keys {
    Space = 32,
    //...
    Left = 20,
+   //Letters
+   P = 80      // ascii de la tecla 'P'
};
```

```cpp [game.cc]
Game::Game(int width, int height)
    : mario_({width / 2, 150}),
      platforms_{
          Platform(100, 300, 200, 211),
          Platform(0, 200, 250, 261),
          Platform(250, 400, 150, 161),
      },
      finished_(false),
+     paused_(false) {
    //...
}

void Game::process_keys(pro2::Window& window) {
    // ...
+   if (window.was_key_pressed(Keys::P)) {
+       paused_ = !paused_;
+   }
}

// En update aplicamos la condición
void Game::update(pro2::Window& window) {
    process_keys(window);
-   update_objects(window);
-   update_camera(window);
+   if (!paused_) {
+       update_objects(window);
+       update_camera(window);
+   }
}
```
:::

:::accordion{title="**Ejercicio 0.2**: Dos Marios en el juego"}
Se ha añadido un segundo objeto de la clase `Mario` para observar cómo se gestionan múltiples instancias de una misma clase.

```cpp [game.hh]
class Game {
    Mario                 mario_;
+   Mario                 mario2_; // Segunda instancia
    // ...
};
```

```cpp [game.cc]
// Inicialización a 30px a la izquierda
Game::Game(int width, int height)
    : mario_({width / 2, 150}),
+     mario2_({width / 2 - 30, 150}),
      platforms_{ /*...*/ } { }

void Game::update_objects(pro2::Window& window) {
    mario_.update(window, platforms_);
+   mario2_.update(window, platforms_);
}

void Game::paint(pro2::Window& window) {
    // ...
    mario_.paint(window);
+   mario2_.paint(window);
}
```

Los dos Marios son instancias independientes en memoria, pero **no son independientes en control**, ya que ambos responden a las mismas teclas de entrada.
:::

:::accordion{title="**Ejercicio 0.3**: Controles independientes"}
Para que el juego sea realmente para dos jugadores, es necesario que cada instancia de `Mario` responda a teclas diferentes.

```cpp [mario.hh]
+   using namespace pro2; // No quiero escribir pro2:: cada vez

//...

class Mario {
private:
    // ...
+   int jump_key_, left_key_, right_key_; // Teclas para cada instancia
public:
-   Mario(pro2::Pt pos) : pos_(pos), last_pos_(pos) {}
+   Mario(Pt pos, int left, int right, int jump) 
+       : pos_(pos), 
+         last_pos_(pos),
+         jump_key_(jump),
+         left_key_(left),
+         right_key_(right) {}
}
```

```cpp [window.hh]
enum Keys {
    //...
    //Letters
    P = 80
+   A = 65,
+   D = 68,
+   W = 87,
};
```

```cpp [game.cc]

Game::Game(int width, int height)
-   : mario_({width / 2, 150}),
-   mario2_({width / 2 - 30, 150}),
+   : mario_({width / 2, 150}, Keys::Left, Keys::Right, Keys::Space),
+     mario2_({width / 2 - 30, 150}, Keys::A, Keys::D, Keys::W),
    platforms_{/* ... */},
    finished_(false),
    paused_(false) {
    //...
}

```

```cpp [mario.cc]
void Mario::update(pro2::Window& window, const vector<Platform>& platforms) {
-   if (window.is_key_down(Keys::Space)) jump();
+   if (window.is_key_down(jump_key_)) jump(); // Usamos la tecla configurada

-   if (window.is_key_down(Keys::Left)) speed_.x = -4;
+   if (window.is_key_down(left_key_)) speed_.x = -4;

-   else if (window.is_key_down(Keys::Right)) speed_.x = 4;;
+   else if (window.is_key_down(right_key_)) speed_.x = 4;;
    // ...
}
```

### ¿Qué pasa con la cámara?
La cámara solo sigue al `mario_` principal. Si el Jugador 2 se aleja demasiado, saldrá de la pantalla. Para solucionarlo, habría que calcular el punto medio entre los dos Marios en `Game::update_camera()`.
:::

:::accordion{title="**Ejercicio 0.4**: Simplificación de la cámara"}
Centramos la cámara exactamente en la posición de Mario sin "caja de confort".

```cpp [game.cc]
void Game::update_camera(pro2::Window& window) {
-   // Código anterior con dead zone...
+   const Pt pos = mario_.pos(); 
+   const Pt cam = window.camera_center();
+
+   // Calculamos la distancia directa para centrar
+   int dx = pos.x - cam.x;
+   int dy = pos.y - cam.y;
+
+   window.move_camera({dx, dy});
}
```

**Diseño**: Un seguimiento tan rígido puede marear. En diseño de videojuegos se prefiere una "dead zone" para evitar movimientos bruscos durante acciones pequeñas.
:::

:::accordion{title="**Ejercicio 0.5**: El recuadro de la pantalla"}
Dibujamos un marco fijo siguiendo la vista de la cámara (`topleft`).

```cpp [game.cc]
+   #include "utils.hh"

//...

void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);
    // ...

+   // Recuadro de la pantalla (Ejercicio 0.5)
+   Pt tl = window.topleft(); 
+   int w = window.width();
+   int h = window.height();
+   
+   paint_hline(window, tl.x, tl.x + w - 1, tl.y, white);           // Arriba
+   paint_hline(window, tl.x, tl.x + w - 1, tl.y + h - 1, white);   // Abajo
+   paint_vline(window, tl.x, tl.y, tl.y + h - 1, white);           // Izquierda
+   paint_vline(window, tl.x + w - 1, tl.y, tl.y + h - 1, white);   // Derecha
}
```
:::

:::accordion{title="**Ejercicio 0.6**: Pintado de rectángulos"}
Se ha creado una función de utilidad para poder pintar rectángulos llenos de color de una forma más sencilla.

```cpp [utils.hh]
namespace pro2 {
    //...
    
+   /**
+    * @brief Dibuja un rectángulo lleno en la ventana.
+    *
+    * @param window Ventana en la que se dibuja el rectángulo.
+    * @param rect Rectángulo a pintar.
+    * @param color Color del rectángulo (opcional, si no se pone se asume `white`).
+    */
+   void paint_rect(pro2::Window& window, pro2::Rect rect, pro2::Color color = pro2::white);

    //...
}
```

```cpp [utils.cc]
//...
+ void paint_rect(pro2::Window& window, Rect rect, Color color) {
+     for (int y = rect.top; y <= rect.bottom; y++) {
+         paint_hline(window, rect.left, rect.right, y, color);
+     }
+ }
//...
```
:::

:::accordion{title="**Ejercicio 0.7 i 0.8**: Capas y animación"}
Control del orden de pintado y efectos temporales con `frame_count()`.

```cpp [game.cc]
void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);

    //...

+   if ((window.frame_count() / 10) % 2 == 0) {
+       Pt center = window.camera_center();
+       pro2::Rect r = {center.x - 25, center.y - 25, center.x + 25, center.y + 25};
+       paint_rect(window, r, yellow);
+   }
}
```

Como el juego corre a unos 60 FPS, `frame_count() / 10` cambia el estado cada ~0.16 segundos.
:::

---

## Parte 1: Un nuevo tipo de objeto (monedas)

Se trata de implementar objetos coleccionables que floten y sumen puntos al tocarlos.

:::accordion{title="**1. Estructura de la clase collectible**"}
Definimos la interfaz del objeto en `collectible.hh`. Necesitamos saber su posición, si ha sido recogido y la `initial_y_` para la animación.

```cpp [collectible.hh]
#ifndef COLLECTIBLE_HH
#define COLLECTIBLE_HH

#include <vector>
#include "geometry.hh"
#include "window.hh"

class Collectible {
 private:
    pro2::Pt pos_;
    bool     collected_ = false;

    // Para la animación sinusoidal
    float initial_y_;

    static const std::vector<std::vector<int>> coin_sprite_;

 public:
    Collectible(pro2::Pt pos) : pos_(pos), initial_y_(pos.y) {}

    void paint(pro2::Window& window) const;
    void update(int frame_count);

    bool is_collected() const {
        return collected_;
    }

    void collect() {
        collected_ = true;
    }

    pro2::Rect get_rect() const {
        // Tamaño aproximado del sprite (8x8 píxeles)
        return {pos_.x - 4, pos_.y - 4, pos_.x + 4, pos_.y + 4};
    }
};

#endif
```
:::

:::accordion{title="**2. Lógica de animación**"}
Para satisfacer el requerimiento de una animación sencilla, hacemos que la moneda "flote" hacia arriba y abajo usando la función `sin()`.

```cpp [collectible.cc]
#include "collectible.hh"
#include "utils.hh"
#include <cmath>

using namespace std;
using namespace pro2;

void Collectible::update(int frame_count) {
    if (!collected_) {
        // Movimiento sinusoidal: posición vertical oscila +/- 5 píxeles
        // 0.1f controla la velocidad de la oscilación
        pos_.y = initial_y_ + (int)(5.0f * sin(frame_count * 0.1f));
    }
}
```
:::

:::accordion{title="**3. Renderizado y sprites** de moneda"}
Como el juego no tiene imágenes externas, definimos la apariencia de la moneda píxel a píxel mediante una matriz de colores.

```cpp [collectible.cc]
//...

+ const int _ = -1;
+ const int y = pro2::yellow;
+ const int g = 0xaaaaaa; // Gris por el borde
+ 
+ const vector<vector<int>> Collectible::coin_sprite_ = {
+    {_, _, g, g, g, g, _, _},
+    {_, g, y, y, y, y, g, _},
+    {g, y, y, y, y, y, y, g},
+    {g, y, y, y, y, y, y, g},
+    {g, y, y, y, y, y, y, g},
+    {g, y, y, y, y, y, y, g},
+    {_, g, y, y, y, y, g, _},
+    {_, _, g, g, g, g, _, _},
+ };
+ 
+ void Collectible::paint(pro2::Window& window) const {
+    if (!collected_) {
+        const Pt top_left = {pos_.x - 4, pos_.y - 4};
+        paint_sprite(window, top_left, coin_sprite_, false);
+    }
+ }

//...
```
:::

:::accordion{title="**4. Sistema de colisiones** y puntuación"}
Para recoger las monedas, primero necesitamos una función genérica para saber si dos rectángulos se solapan, y después integrarlo en el bucle del juego.

```cpp [geometry.hh]
namespace pro2 {
    //...
+ /**
+  * @brief Determina si dos rectángulos se solapan.
+  */
+ inline bool overlaps(const Rect& a, const Rect& b) {
+     return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
+ }
    //...
}
```

```cpp [game.hh]
+ #include "collectible.hh"
//includes de game.hh

class Game {
    Mario                 mario_;
    Mario                 mario2_;
    std::vector<Platform> platforms_;
+   std::vector<Collectible> collectibles_;
+   int                   score_;
    //...
}
```

```cpp [mario.hh]
class Mario {
    //...
public:
    //... (otros métodos)
+    pro2::Rect get_rect() const {
+        // El sprite es de 12 (ancho) x 16 (alto)
+        // El punto pivote (pos_) está centrado en x y abajo en y
+        return {pos_.x - 6, pos_.y - 15, pos_.x + 5, pos_.y};
+    }
    //...
}
```

En `game.cc`, gestionamos el vector de monedas e incrementamos el `score_`:

```cpp [game.cc]
Game::Game(int width, int height)
    : //...
-     paused_(false)
+     paused_(false),
+     score_(0) {
    //...
    for (int i = 1; i < 20; i++) {
        platforms_.push_back(Platform(250 + i * 200, 400 + i * 200, 150, 161));
        // Añadimos una moneda sobre cada plataforma nueva
+       collectibles_.push_back(Collectible({250 + i * 200 + 75, 140}));
    }
}

void Game::update_objects(pro2::Window& window) {
    // ... update Marios ...
+   for (Collectible& c : collectibles_) {
+       c.update(window.frame_count());
+
+       // Comprobamos colisión contra ambos jugadores
+       if (!c.is_collected() && (overlaps(mario_.get_rect(), c.get_rect()) || 
+                                 overlaps(mario2_.get_rect(), c.get_rect()))) {
+           c.collect();
+           score_++;
+           std::cout << "Moneda - Puntuación: " << score_ << std::endl;
+       }
+   }
}

void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);
    for (const Platform& p : platforms_) {
        p.paint(window);
    }
+   for (const Collectible& c : collectibles_) {
+       c.paint(window);
+   }
    //...
}
```
:::

---