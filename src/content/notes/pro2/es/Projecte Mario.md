---
title: "Proyecto Mario"
description: "Resumen del proyecto y solucionarios de los problemas"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Parte 1 y Parte 2 (NO OPTIMIZADA):</span>
  <a href="/mario-pro2%203.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Proyecto definitivo con optimización finder</span>
  <a href="/mario-pro2%204.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>


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
