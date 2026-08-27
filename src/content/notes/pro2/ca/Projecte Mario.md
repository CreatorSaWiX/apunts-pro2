---
title: "Projecte Mario"
description: "Resum del projecte i solucionaris dels problemes"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

::download{href="/mario-pro2%203.zip" label="ZIP" description="Part 1 i Part 2 (no optimitzada):"}

::download{href="/mario-pro2%204.zip" label="ZIP" description="Versió definitiva amb optimització Finder:"}


## Part 1: Un nou tipus d'objecte (monedes)

Es tracta d'implementar objectes recollibles que flotin i sumin punts en tocar-los.

:::youtubeviz{src="https://youtu.be/1IjhVkR2t5E" caption="Vídeo demostració del funcionament de les monedes."}
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

La solució és el **frustum culling**: pintar *només* els objectes visibles a la càmera.

:::youtubeviz{src="https://youtu.be/f3GnLRIwCuo" caption="Vídeo demostració del funcionament del frustum culling al projecte."}
:::

> A video tutorial, havía deixat 3 includes en el finder: `#include <map>`, `#include <set>`, i  `#include "geometry.hh"`.

## Optimització `Finder<T>`

:::youtubeviz{src="https://youtu.be/kF-VhcSZu1A" caption="Optimització finder"}
:::