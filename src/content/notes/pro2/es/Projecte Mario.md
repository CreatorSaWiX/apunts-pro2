---
title: "Proyecto Mario"
description: "Resumen del proyecto y solucionarios de los problemas"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

::download{href="/mario-pro2%203.zip" label="ZIP" description="Parte 1 y Parte 2 (no optimizada):"}

::download{href="/mario-pro2%204.zip" label="ZIP" description="Versión definitiva con optimización Finder:"}


## Parte 1: Un nuevo tipo de objeto (monedas)

Se trata de implementar objetos recogibles que floten y sumen puntos al tocarlos.

:::youtubeviz{src="https://youtu.be/1IjhVkR2t5E" caption="Vídeo demostración del funcionamiento de las monedas."}
:::

---

## Parte 2: Frustum Culling con `Finder<T>`

El juego tiene un loop de dibujado que recorre *todos* los objetos cada frame, y con 1.000.000 de plataformas y monedas, iterarlas todas cada frame en `paint()` es inaceptable. En un momento dado, la cámara ve como máximo ~50 plataformas. Si hay un millón, estamos haciendo mucho trabajo innecesario. Necesitamos una estructura de datos que nos permita encontrar los objetos visibles en **O(log n)** en lugar de O(n). 

```cpp
// PROBLEMA: O(n) donde n = 1.000.000 — ¡demasiado lento!
for (const Platform& p : platforms_) {
    p.paint(window); // Se dibuja incluso si está a km de la cámara
}
```

La solución es el **frustum culling**: dibujar *solo* los objetos visibles en la cámara.

:::youtubeviz{src="https://youtu.be/f3GnLRIwCuo" caption="Vídeo demostración del funcionamiento del frustum culling en el proyecto."}
:::

> En video tutorial, había dejado 3 includes en el finder: `#include <map>`, `#include <set>`, y `#include "geometry.hh"`.

## Optimización `Finder<T>`

:::youtubeviz{src="https://youtu.be/kF-VhcSZu1A" caption="Optimización finder"}
:::
