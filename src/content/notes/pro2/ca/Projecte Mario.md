---
title: "Projecte Mario"
description: "Resum del projecte i solucionaris dels problemes"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Part 1 i Part 2 (NO OPTIMITZADA):</span>
  <a href="/mario-pro2%203.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Projecte definitiva amb optimització finder</span>
  <a href="/mario-pro2%204.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>


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