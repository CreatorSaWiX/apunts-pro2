---
title: "Mario Project"
description: "Project summary and problem solutions"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Part 1 and Part 2 (NOT OPTIMIZED):</span>
  <a href="/mario-pro2%203.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>

<div class="flex items-center gap-4 mb-8 mt-4">
  <span class="text-slate-300 text-[15px] font-bold">Final project with finder optimization</span>
  <a href="/mario-pro2%204.zip" download class="flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all select-none bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-300 shadow-md shadow-blue-950/10 group no-underline w-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-300"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    <span>ZIP</span>
  </a>
</div>


## Part 1: A new type of object (coins)

It is about implementing collectible objects that float and add points when touched.

:::youtubeviz{src="https://youtu.be/1IjhVkR2t5E" caption="Video demonstration of how coins work."}
:::

---

## Part 2: Frustum Culling with `Finder<T>`

The game has a draw loop that iterates through *all* objects every frame, and with 1,000,000 platforms and coins, iterating through all of them every frame in `paint()` is unacceptable. At any given time, the camera sees at most ~50 platforms. If there are a million, we are doing a lot of unnecessary work. We need a data structure that allows us to find visible objects in **O(log n)** instead of O(n). 

```cpp
// PROBLEM: O(n) where n = 1,000,000 — too slow!
for (const Platform& p : platforms_) {
    p.paint(window); // It is drawn even if it is miles away from the camera
}
```

The solution is **frustum culling**: drawing *only* the objects visible to the camera.

:::youtubeviz{src="https://youtu.be/f3GnLRIwCuo" caption="Video demonstration of how frustum culling works in the project."}
:::

> In the video tutorial, I had left 3 includes in the finder: `#include <map>`, `#include <set>`, and `#include "geometry.hh"`.

## `Finder<T>` Optimization

:::youtubeviz{src="https://youtu.be/kF-VhcSZu1A" caption="Finder optimization"}
:::
