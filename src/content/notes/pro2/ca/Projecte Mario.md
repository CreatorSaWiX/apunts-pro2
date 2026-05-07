---
title: "Projecte Mario"
description: "Resum del projecte i solucionaris dels problemes"
readTime: "15 min"
order: 14
draft: false
isUpdated: 1
---

## Resum d'arquitectura 

Aquesta taula recull el **"on i què"** del projecte per validar la teva comprensió:

| Fitxer | Rol | Conceptes |
| :--- | :--- | :--- |
| **`main.cc`** | Bucle Principal | `main_loop()`: Orquestra la freqüència i el tancament. |
| **`game.hh/cc`** | Orquestrador | Crea instàncies (Mario, Plataformes). Mou la càmera. |
| **`mario.hh/cc`** | Entitat Jugador | Lògica de salt, gravetat i control de tecles. |
| **`geometry.hh`** | Dades Base | `Pt` (posició), `Rect` (col·lisions/sprites). |
| **`utils.hh/cc`** | Utilitats Pintat | Funcions de línies i rectangles (píxel a píxel). |

### El bucle de joc
1. **Input**: `process_keys()` detecta tecles. El tancament es controla amb `finished_`.
2. **Física**: `update_objects()` aplica moviments. La gravetat s'afegeix a la velocitat vertical.
3. **Càmera**: `update_camera()` calcula el `topleft` de la vista seguint al jugador.
4. **Pintat**: `paint()` recorre objectes i dibuixa. L'ordre (capes) importa!

### Física i lògica
*   **Gravetat**: Cada frame sumem un valor a la v. vertical. El salt és posar aquesta velocitat en negatiu.
*   **Col·lisions**: Es miren via `overlaps` comparant `Rect`. Mario és un `Rect` dinàmic.
*   **Eixos**: Origen (0,0) a dalt-esquerra. X creix a la dreta, Y creix **avall**.

### Coses que no ensenyen a classe 

*   `@brief`: Doxygen - text que surt anant a l'arxiu amb `Ctrl` + click sobre el nom de la funció.
*   `@param`: Doxygen - text que surt quan escrius paràmetres de la funció.
*   `@return`: Doxygen - text que surt quan escrius el tipus de retorn de la funció.
*   **Getter**: Mètode `const` per "llegir" la variable (ex: `get_pos()` -> retorna pos).
*   **Setter**: Mètode per "escriure" o modificar-la, sovint amb validacions (ex: `set_speed(v)` -> modifca speed).
*   **PascalCase**: Separar paraules amb majúscula (`UpdateObjects`).
*   **camelCase**: Separar paraules amb la primera lletra minúscula i resta majúscula (`updateObjects()`).
*   **snake_case_**: Separar paraules amb '_' (`update_objects`).

---
## Part 0: Exercicis inicials

:::accordion{title="**Exercici 0.1**: Pausa del joc"}
S'ha implementat una funcionalitat de pausa que permet congelar l'estat del joc prement la tecla **'P'**.

```cpp [game.hh]
class Game {
    // ...
    bool finished_;
+   bool paused_; // Nou estat per la pausa
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

// A update apliquem la condició
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

:::accordion{title="**Exercici 0.2**: Dos Marios al joc"}
S'ha afegit un segon objecte de la classe `Mario` per observar com es gestionen múltiples instàncies d'una mateixa classe.

```cpp [game.hh]
class Game {
    Mario                 mario_;
+   Mario                 mario2_; // Segona instància
    // ...
};
```

```cpp [game.cc]
// Inicialització a 30px a l'esquerra
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

Els dos Marios són instàncies independents en memòria, però **no són independents en control**, ja que tots dos responen a les mateixes tecles d'entrada.
:::

:::accordion{title="**Exercici 0.3**: Controls independents"}
Perquè el joc sigui realment per a dos jugadors, cal que cada instància de `Mario` respongui a tecles diferents.

```cpp [mario.hh]
+   using namespace pro2; // No vull escriure pro2:: cada cop

//...

class Mario {
private:
    // ...
+   int jump_key_, left_key_, right_key_; // Tecles per cada instància
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
+   if (window.is_key_down(jump_key_)) jump(); // Usem la tecla configurada

-   if (window.is_key_down(Keys::Left)) speed_.x = -4;
+   if (window.is_key_down(left_key_)) speed_.x = -4;

-   else if (window.is_key_down(Keys::Right)) speed_.x = 4;;
+   else if (window.is_key_down(right_key_)) speed_.x = 4;;
    // ...
}
```

### Què passa amb la càmera?
La càmera només segueix al `mario_` principal. Si el Jugador 2 s'allunya massa, sortirà de la pantalla. Per solucionar-ho, caldria calcular el punt mitjà entre els dos Marios a `Game::update_camera()`.
:::

:::accordion{title="**Exercici 0.4**: Simplificació de la càmera"}
Centrem la càmera exactament a la posició d'en Mario sense "caixa de confort".

```cpp [game.cc]
void Game::update_camera(pro2::Window& window) {
-   // Codi anterior amb dead zone...
+   const Pt pos = mario_.pos(); 
+   const Pt cam = window.camera_center();
+
+   // Calculem la distància directa per centrar
+   int dx = pos.x - cam.x;
+   int dy = pos.y - cam.y;
+
+   window.move_camera({dx, dy});
}
```

**Disseny**: Un seguiment tan rígid pot marejar. En disseny de videojocs es prefereix una "dead zone" per evitar moviments bruscos durant accions petites.
:::

:::accordion{title="**Exercici 0.5**: El requadre de la pantalla"}
Dibuixem un marc fix seguint la vista de la càmera (`topleft`).

```cpp [game.cc]
+   #include "utils.hh"

//...

void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);
    // ...

+   // Requadre de la pantalla (Exercici 0.5)
+   Pt tl = window.topleft(); 
+   int w = window.width();
+   int h = window.height();
+   
+   paint_hline(window, tl.x, tl.x + w - 1, tl.y, white);           // Dalt
+   paint_hline(window, tl.x, tl.x + w - 1, tl.y + h - 1, white);   // Baix
+   paint_vline(window, tl.x, tl.y, tl.y + h - 1, white);           // Esquerra
+   paint_vline(window, tl.x + w - 1, tl.y, tl.y + h - 1, white);   // Dreta
}
```
:::

:::accordion{title="**Exercici 0.6**: Pintat de rectangles"}
S'ha creat una funció d'utilitat per poder pintar rectangles plens de color d'una forma més senzilla.

```cpp [utils.hh]
namespace pro2 {
    //...
    
+   /**
+    * @brief Dibuixa un rectangle ple a la finestra.
+    *
+    * @param window Finestra a la qual es dibuixa el rectangle.
+    * @param rect Rectangle a pintar.
+    * @param color Color del rectangle (opcional, si no es posa s'assumeix `white`).
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

:::accordion{title="**Exercici 0.7 i 0.8**: Capes i animació"}
Control de l'ordre de pintat i efectes temporals amb `frame_count()`.

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

Com que el joc corre a uns 60 FPS, `frame_count() / 10` canvia l'estat cada ~0.16 segons.
:::

---

## Part 1: Un nou tipus d'objecte (monedes)

Es tracta d'implementar objectes recollibles que flotin i sumin punts en tocar-los.

:::accordion{title="**1. Estructura de la classe Coin**"}
Definim la interfície de l'objecte a `coin.hh`. Necessitem saber la seva posició, si ha estat agafat i la `initial_y_` per a l'animació.

```cpp [coin.hh]
#ifndef COIN_HH
#define COIN_HH

#include <vector>
#include "geometry.hh"
#include "window.hh"

using namespace std;
using namespace pro2;

class Coin {
 private:
    pro2::Pt pos_;
    bool     collected_ = false;

    // Per l'animació sinusoidal
    double initial_y_;

    static const vector<vector<int>> coin_sprite_;

 public:
    Coin(Pt pos) : pos_(pos), initial_y_(pos.y) {}

    void paint(Window& window) const;
    void update(int frame_count);

    bool is_collected() const {
        return collected_;
    }

    void collect() {
        collected_ = true;
    }

    pro2::Rect get_rect() const {   //MacOs issue
        // Mida aproximada de l'sprite (8x8 píxels)
        return {pos_.x - 4, pos_.y - 4, pos_.x + 4, pos_.y + 4};
    }
};

#endif
```
:::

:::accordion{title="**2. Lògica d'animació**"}
Per satisfer el requeriment d'una animació senzilla, fem que la moneda "floti" amunt i avall usant la funció `sin()`.

```cpp [coin.cc]
#include "coin.hh"
#include "utils.hh"
#include <cmath>

using namespace std;
using namespace pro2;

void Coin::update(int frame_count) {
    if (!collected_) {
        // Moviment sinusoidal: posició vertical oscil·la +/- 5 píxels
        // 0.1 controla la velocitat de l'oscil·lació
        pos_.y = initial_y_ + (5 * sin(frame_count * 0.1));
    }
}
```
:::

:::accordion{title="**3. Renderitzat i sprites** de moneda"}
Com que el joc no té imatges externes, definim l'aparença de la moneda píxel a píxel mitjançant una matriu de colors.

```cpp [window.hh]
//...

  const Color black = 0x00000000;
  //...
  const Color white = 0x00ffffff;
+ const Color grey = 0xaaaaaa;

//...
```

```cpp [coin.cc]
//...

+ const int _ = -1;
+ const int y = yellow;
+ const int g = grey; 
+ 
+ const vector<vector<int>> Coin::coin_sprite_ = {
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
+ void Coin::paint(Window& window) const {
+    if (!collected_) {
+        const Pt top_left = {pos_.x - 4, pos_.y - 4};
+        paint_sprite(window, top_left, coin_sprite_, false);
+    }
+ }

//...
```
:::

:::accordion{title="**4. Sistema de col·lisions** i puntuació"}
Per recollir les monedes, primer ens cal una funció genèrica per saber si dos rectangles se solapen, i després integrar-ho al bucle del joc.

```cpp [geometry.hh]
namespace pro2 {
    //...
+ /**
+  * @brief Determina si dos rectangles se solapen.
+  */
+ inline bool overlaps(const Rect& a, const Rect& b) {
+     return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
+ }
    //...
}
```

```cpp [game.hh]
+ #include "coin.hh"
//includes de game.hh

class Game {
    Mario                 mario_;
    Mario                 mario2_;
    std::vector<Platform> platforms_;
+   std::vector<Coin>     coin_;
+   int                   score_;
    //...
}
```

```cpp [mario.hh]
class Mario {
    //...
public:
    //...
+    pro2::Rect get_rect() const {
+        return { pos_.x - 6, pos_.y - 15, pos_.x + 5, pos_.y }; 
+    }
    //...
}
```

A `game.cc`, gestionem el vector de monedes i incrementem el `score_`:

```cpp [game.cc]
Game::Game(int width, int height)
    : //...
-     paused_(false)
+     paused_(false),
+     score_(0) {
    //...
    for (int i = 1; i < 20; i++) {
        platforms_.push_back(Platform(250 + i * 200, 400 + i * 200, 150, 161));
        // Afegim una moneda sobre cada plataforma nova
+       coin_.push_back(Coin({250 + i * 200 + 75, 140}));
    }
}

void Game::update_objects(pro2::Window& window) {
    // ... update Marios ...
+   for (Coin& c : coin_) {
+       c.update(window.frame_count());
+
+       // Comprovem col·lisió contra ambdós jugadors
+       if (!c.is_collected() && (overlaps(mario_.get_rect(), c.get_rect()) || 
+                                 overlaps(mario2_.get_rect(), c.get_rect()))) {
+           c.collect();
+           score_++;
+           cout << "Moneda - Puntuació: " << score_ << endl;
+       }
+   }
}

void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);
    for (const Platform& p : platforms_) {
        p.paint(window);
    }
+   for (const Coin& c : coin_) {
+       c.paint(window);
+   }
    //...
}
```
:::

---

## Part 2: Frustum Culling amb `Finder<T>`

El joc té un loop de pintat que recorre *tots* els objectes cada frame, i amb 1.000.000 de plataformes i monedes, iterar-les totes cada frame a `paint()` és inacceptable. En un moment donat, la càmera veu com a màxim ~50 plataformes. Si n'hi ha un milió, estem fent molta feina innecessària. Necessitem una estructura de dades que ens permeti trobar els objectes visibles en **O(log n)** en lloc de O(n). 

```cpp
// PROBLEMA: O(n) on n = 1.000.000 — massa lent!
for (const Platform& p : platforms_) {
    p.paint(window); // Es pinta fins i tot si és a km de la càmera
}
```

La solució és el **frustum culling**: pintar *només* els objectes visibles a la càmera. Aquí tens un exemple real del frustum culling en un videojoc 3D (Jettelly Inc.):

:::linkedinviz{src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7433368353206992896?compact=1" height="399" caption="Frustum culling en acció en un motor 3D real — el mateix concepte que apliquem nosaltres en 2D amb Finder."}
:::

:::accordion{title="**Disseny**: la classe `Finder<T>`"}
La classe `Finder<T>` és un **contenidor espacial genèric** que indexa objectes per la seva posició al pla. La interfície pública que demana la pràctica és:

```cpp [finder.hh]
template <typename T>
class Finder {
    // Estructura interna (arbre sobre l'eix X)
 public:
    Finder() {}

    void add(const T* t);       // Afegeix un objecte
    void update(const T* t);    // Actualitza (re-indexa) un objecte mogut
    void remove(const T* t);    // Elimina un objecte

    /**
     * @brief Retorna el conjunt d'objectes amb rectangles total o
     *        parcialment dins de `rect`.
     *
     * Si el nombre de rectangles del contenidor és `n`, el cost
     * de l'algorisme ha de ser O(log n).
     *
     * @param rect El rectangle de cerca
     * @returns Un conjunt de punters a objectes que tenen un rectangle
     *          parcial o totalment dins de `rect`
     */
    std::set<const T*> query(pro2::Rect rect) const;
};
```

El tipus `T` pot ser qualsevol classe que tingui **`get_rect() const`** — tant `Platform` com `Coin` el tenen, per tant podem usar `Finder<Platform>` i `Finder<Coin>`.
:::

:::accordion{title="**Implementació interna**: arbre ordenat per X"}
Internament, `Finder<T>` organitza els objectes en un `std::map` ordenat per la coordenada `left` del seu rectangle. Això és clau per la poda:

```cpp [finder.hh]
template <typename T>
class Finder {
 private:
    // Clau: left del rect. Valor: punters als objectes amb aquell left
    std::map<int, std::set<const T*>> by_left_;

    std::map<int, int> max_right_prefix_; // Màxim right acumulat

 public:
    std::set<const T*> query(pro2::Rect rect) const {
        std::set<const T*> result;

        for (auto it = by_left_.begin(); it != by_left_.end(); ++it) {
            int obj_left = it->first;

            // PODA: si left de l'objecte > right del viewport,
            // cap objecte d'aquí en endavant pot solapar → parem
            if (obj_left > rect.right) break;

            for (const T* t : it->second) {
                if (pro2::overlaps(t->get_rect(), rect)) {
                    result.insert(t);
                }
            }
        }
        return result;
    }
};
```

La poda `if (obj_left > rect.right) break;` garanteix que no visitem objectes que estan clarament a la dreta del viewport. La funció `overlaps()` filtra els que queden a l'esquerra.
:::

:::accordion{title="**Integració** a `Game`"}
Afegim dos membres `Finder` a la classe `Game`:

```cpp [game.hh]
+ #include "finder.hh"

class Game {
    Mario                 mario_;
    Mario                 mario2_;
    std::vector<Platform> platforms_;
    std::vector<Coin>     coin_;
    int                   score_;
    bool                  finished_;
    bool                  paused_;

+   // Finders per a frustum culling
+   Finder<Platform> platform_finder_;
+   Finder<Coin>     coin_finder_;
    // ...
};
```

Al constructor, **primer** omplim els vectors completament i **després** afegim els punters als Finders. Això és crític: si afegíssim punters durant `push_back`, una reallocation invalidaria tots els punters existents!

```cpp [game.cc]
Game::Game(int width, int height) : /* ... */ {
    // 1. Construïm el vector completament
    for (int i = 1; i < 1000000; i++) {
        platforms_.push_back(Platform(250 + i * 200, 400 + i * 200, 150, 161));
        coin_.push_back(Coin({250 + i * 200 + 75, 140}));
    }

+   // 2. Ara que el vector és estable, afegim punters als Finders
+   for (const Platform& p : platforms_) {
+       platform_finder_.add(&p);
+   }
+   for (const Coin& c : coin_) {
+       coin_finder_.add(&c);
+   }
}
```
:::

:::accordion{title="**Frustum culling** a `paint()`"}
A `paint()`, substituïm les iteracions lineals per consultes al Finder amb el viewport de la càmera:

```cpp [game.cc]
void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);

+   // Calculem el viewport (amb marge de 20px per evitar pop-in)
+   Pt  tl      = window.topleft();
+   int w       = window.width();
+   int h       = window.height();
+   pro2::Rect viewport = {tl.x - 20, tl.y - 20, tl.x + w + 20, tl.y + h + 20};

-   // ABANS: O(n) — iteràvem TOTS els objectes
-   for (const Platform& p : platforms_) { p.paint(window); }
-   for (const Coin& c : coin_)          { c.paint(window); }

+   // ARA: O(log n + k) — només els k objectes visibles
+   for (const Platform* p : platform_finder_.query(viewport)) {
+       p->paint(window);
+   }
+   for (const Coin* c : coin_finder_.query(viewport)) {
+       c->paint(window);
+   }

    mario_.paint(window);
    mario2_.paint(window);
}
```

**Resultat**: amb 1.000.000 d'objectes i ~50 visibles, passem de pintar 1.000.000 sprites a pintar ~50. El joc ara funciona de manera fluida independentment de la mida del nivell.
:::

**Complexitat** i anàlisi de rendiment:

| Operació | Sense Finder | Amb Finder |
|----------|:---:|:---:|
| `paint()` cada frame | **O(n)** | **O(log n + k)** |
| `add()` objecte | O(1) | O(log n) |
| `remove()` objecte | O(n) | O(log n) |
| Memòria extra | 0 | O(n) |

On `n` = total d'objectes, `k` = objectes visibles (k << n). **Per al nostre cas**: n = 1.000.000, k ≈ 50. Sense Finder fem ~20.000x més feina per frame que la necessària.

> **Nota per l'exàmen**: cal saber implementar `Finder` des de zero (30–40 min). Els punts clau: usar `std::map` ordenat per X, la poda `break` quan `obj_left > rect.right`, i entendre per què cal afegir punters *després* que el vector estigui complet.