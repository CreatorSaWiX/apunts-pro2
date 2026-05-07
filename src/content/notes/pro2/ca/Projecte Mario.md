---
title: "Projecte Mario"
description: "Resum del projecte i solucionaris dels problemes"
readTime: "15 min"
order: 14
draft: false
isUpdated: 2
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

//Evitar posar using namespace a un .hh, pot contaminar el namespace global.
//using namespace std; 
//using namespace pro2;

class Coin {
 private:
    pro2::Pt pos_;
    bool     collected_ = false;

    // Per l'animació sinusoidal
    double initial_y_;

    static const std::vector<std::vector<int>> coin_sprite_;

 public:
    Coin(pro2::Pt pos) : pos_(pos), initial_y_(pos.y) {}

    void paint(pro2::Window& window) const;
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

:::accordion{title="**1. Disseny i Implementació**: `Finder<T>` en O(log n)"}
La classe `Finder<T>` és un **contenidor espacial genèric** que indexa objectes per la seva posició al pla. Si el dissenyem malament (ex. reconstruint estructures lineals O(N) a cada inserció), el joc es quedarà congelat en iniciar quan hagi de carregar 1.000.000 d'objectes (O(N²)).

La clau per una implementació perfecta O(log n) tant a la inserció com a la cerca és organitzar els objectes en un `std::map` ordenat per la coordenada `left`, i mantenir l'amplada màxima (`max_width_`) dels objectes inserits:

```cpp [finder.hh]
+ #ifndef FINDER_HH
+ #define FINDER_HH
+ #include <map>
+ #include <set>
+ 
+ /**
+  * @brief Contenidor espacial genèric per a frustum culling.
+  *
+  * Emmagatzema punters a objectes del tipus T (que han de tenir un mètode
+  * `get_rect()` que retorni un `pro2::Rect`) i permet consultar en O(log n)
+  * quins objectes se solapen (total o parcialment) amb un rectangle donat.
+  *
+  * Internament s'organitzen els objectes en un arbre de segments sobre
+  * l'eix X (std::map). Mantenim l'amplada màxima (`max_width_`) per permetre
+  * una poda eficient per l'esquerra usant `lower_bound`, i tallem la cerca
+  * amb una poda per la dreta quan superem el límit del rectangle de consulta.
+  *
+  * @tparam T  Tipus dels objectes continguts. Ha de tenir `get_rect() const`.
+  */
+ 
template <typename T>
class Finder {
+ private:
+   // Clau: left del rect. Valor: punters als objectes amb aquell left
+   std::map<int, std::set<const T*>> by_left_;
+   int max_width_ = 0;     // Ajuda a acotar la cerca per l'esquerra
 public:
    Finder() {}

-  void add(const T *t);
+   /**
+    * @brief Afegeix un objecte al contenidor en O(log n).
+    * @param t Punter (const) a l'objecte a afegir.
+    */
+   void add(const T *t){
+       pro2::Rect r = t->get_rect();
+       int width = r.right - r.left;
+       if(width > max_width_) max_width_ = width;
+       by_left_[r.left].insert(t);
+   }

-  void update(const T *t);
+   /**
+    * @brief Actualitza la posició registrada d'un objecte que ja és al contenidor.
+    * @param t Punter (const) a l'objecte a actualitzar.
+    */
+   void update(const T* t) {
+       bool trobat = false;
+       for (auto it = by_left_.begin(); it != by_left_.end() && !trobat; ) {
+           if (it->second.count(t)) {
+               it->second.erase(t);
+               if (it->second.empty()) {
+                   it = by_left_.erase(it);
+               } else {
+                   ++it;
+               }
+               trobat = true;
+           } else {
+               ++it;
+           }
+       }
+       add(t);
+   }

-  void remove(const T *t);
+   /**
+    * @brief Elimina un objecte del contenidor en O(log n).
+    * @param t Punter (const) a l'objecte a eliminar.
+    */
+   void remove(const T *t){
+       pro2::Rect r = t->get_rect();
+       auto it = by_left_.find(r.left);
+       if (it != by_left_.end()) {
+           it->second.erase(t);
+           if (it->second.empty()) {
+               by_left_.erase(it);
+           }
+       }
+   }

    std::set<const T *> query(pro2::Rect rect) const;
};

+ #endif
```
:::

:::accordion{title="**2. Consultes ràpides**: poda esquerra i dreta"}
Al moment de fer `query()` d'una zona (com la càmera), utilitzem el `max_width_` per evitar començar a buscar des del primer objecte del món (poda esquerra), i parem tan bon punt superem la pantalla (poda dreta).

```cpp [finder.hh]
    std::set<const T*> query(pro2::Rect rect) const {
        std::set<const T*> result;

        // PODA ESQUERRA en O(log n): busquem des del primer objecte que
        // PODRIA solapar-se tenint en compte l'amplada màxima registrada.
        auto start_it = by_left_.lower_bound(rect.left - max_width_);

        // PODA DRETA: afegim `it->first <= rect.right` a la condició del bucle
        // per parar de buscar un cop superem la càmera
        for (auto it = start_it; it != by_left_.end() && it->first <= rect.right; ++it) {
            for (const T* t : it->second) {
                if (pro2::overlaps(t->get_rect(), rect)) result.insert(t);
            }
        }
        return result;
    }
};
```
Això garanteix que tant la cerca per pintar com la cerca per físiques sigui estrictament O(log n + k) (on k són els pocs elements visibles).
:::

:::accordion{title="**3. Integració a l'orquestrador** `Game`"}
Afegim dos membres `Finder` a `Game`:

```cpp [game.hh]
+ #include "finder.hh"

class Game {
    // ... vectors de plataformes i monedes ...
+   // Finders per a frustum culling i físiques
+   Finder<Platform> platform_finder_;
+   Finder<Coin>     coin_finder_;
};
```

Al constructor, **primer** omplim els vectors i **després** afegim els punters als Finders per evitar que una reallocació de memòria del `std::vector` invalidi els punters:

```cpp [game.cc]
Game::Game(int width, int height) : /* ... */ {
    // 1. Construïm els vectors completament
    for (int i = 1; i < 1000000; i++) {
        platforms_.push_back(Platform(250 + i * 200, 400 + i * 200, 150, 161));
        coin_.push_back(Coin({250 + i * 200 + 75, 140}));
    }

+   // 2. Afegim punters als Finders en O(log n)
+   for (const Platform& p : platforms_) platform_finder_.add(&p);
+   for (const Coin& c : coin_)          coin_finder_.add(&c);
}
```
:::

:::accordion{title="**4. Recuperant els 60 FPS**: `paint()` i `update_objects()`"}
Si només usem el Finder per dibuixar (`paint`), el joc seguirà anant a 10 FPS perquè cada frame `update_objects` iterarà tot el milió d'objectes per calcular les col·lisions i les físiques de Mario. **El Finder s'ha d'aplicar a tots dos llocs!**

```cpp [game.cc]
void Game::update_objects(pro2::Window& window) {
-    mario_.update(window, platforms_);
-    //mario2_.update(window, platforms_);
-
-    for (Coin& c : coin_) {
-        c.update(window.frame_count());
-        
-        //|| overlaps(mario2_.get_rect(), c.get_rect())
-        if (!c.is_collected() && (overlaps(mario_.get_rect(), c.get_rect()))) {
-            c.collect();
-            score_++;
-            cout << "Moneda - Puntuació: " << score_ << endl;
-        }
-    }
+    // Calculem l'àrea d'actualització (el viewport + marge per físiques)
+    Pt  tl = window.topleft();
+    int w  = window.width();
+    int h  = window.height();
+    pro2::Rect update_area = {tl.x - 100, tl.y - 100, tl.x + w + 100, tl.y + h + 100};
+
+    // 1. Obtenim NOMÉS les plataformes properes en O(log N) per a les físiques
+    std::vector<Platform> nearby_platforms;
+    for (const Platform* p : platform_finder_.query(update_area)) {
+        nearby_platforms.push_back(*p);
+    }
+
+    // Actualitzem els Marios amb un subset minúscul de plataformes (molt més ràpid)
+    mario_.update(window, nearby_platforms);
+    // mario2_.update(window, nearby_platforms);       He deixat amb només 1 mario
+
+    // 2. Actualitzem i comprovem col·lisions NOMÉS per a les monedes properes
+    for (const Coin* const_c : coin_finder_.query(update_area)) {
+        // Obtenim un punter no constant per poder modificar la moneda
+        Coin* c = const_cast<Coin*>(const_c);
+        
+        c->update(window.frame_count());
+
+        if (!c->is_collected() && (overlaps(mario_.get_rect(), c->get_rect()) /*||
+                                   overlaps(mario2_.get_rect(), c->get_rect())*/)) {
+            c->collect();
+            score_++;
+            cout << "Moneda - Puntuació: " << score_ << endl;
+        }
+    }
}

void Game::paint(pro2::Window& window) {
    window.clear(sky_blue);

-    for (const Platform& p : platforms_) {
-        p.paint(window);
-    }
-    for (const Coin& c : coin_) {
-        c.paint(window);
-    }
+    // Frustum culling: calculem el viewport actual de la càmera
+    Pt  tl = window.topleft();
+    int w  = window.width();
+    int h  = window.height();
+    // Afegim un marge de 20px per evitar aparicions brusques a la vora
+    pro2::Rect viewport = {tl.x - 20, tl.y - 20, tl.x + w + 20, tl.y + h + 20};
+
+    // Pintem NOMÉS les plataformes visibles (O(log n + k) on k = visibles)
+    for (const Platform* p : platform_finder_.query(viewport)) {
+        p->paint(window);
+    }
+
+    // Pintem NOMÉS les monedes visibles
+    for (const Coin* c : coin_finder_.query(viewport)) {
+        c->paint(window);
+    }

    mario_.paint(window);
    //mario2_.paint(window);
}
```
:::

**Complexitat** i anàlisi de rendiment:

| Operació per frame | Sense Finder | Amb Finder |
|----------|:---:|:---:|
| Físiques (`update()`) | **O(n)** | **O(log n + k)** |
| Pintat (`paint()`) | **O(n)** | **O(log n + k)** |
| `add()` a l'inici | O(1) | O(log n) |
| Memòria extra | 0 | O(n) |

On `n` = total d'objectes, `k` = objectes propers (k << n). **Per al nostre cas**: n = 1.000.000, k ≈ 50. Gràcies a usar l'arbre per a les dues coses, evitem més de 2.000.000 d'iteracions innecessàries cada segon.

> **Nota per l'exàmen**: cal saber implementar `Finder` des de zero (30–40 min). Els punts clau: usar `std::map` ordenat per X, la poda `lower_bound` per l'esquerra usant l'amplada màxima, la poda dreta integrada com a condició al bucle (`it->first <= rect.right`), i entendre que tant el *pintat* com les *físiques* necessiten aquesta optimització per mantenir els 60 FPS.