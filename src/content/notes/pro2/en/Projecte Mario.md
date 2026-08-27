---
title: "Mario Project"
description: "Project summary and problem solutions"
readTime: "15 min"
order: 14
draft: false
isUpdated: 6
---

::download{href="/mario-pro2%203.zip" label="ZIP" description="Part 1 and Part 2 (not optimized):"}

::download{href="/mario-pro2%204.zip" label="ZIP" description="Final version with Finder optimization:"}


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
