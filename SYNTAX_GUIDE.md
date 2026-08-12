# 📝 Guia de Sintaxi per a Contribuïdors

> Aquesta guia defineix tota la sintaxi suportada per escriure contingut a **Apunts**.
> Llegeix-la sencera abans de contribuir solucionaris, apunts o posts de la comunitat.

---

## Sintaxi Bàsica (Markdown)

| Sintaxi | Resultat |
|---|---|
| `**text**` | **Negreta** |
| `*text*` | *Cursiva* |
| `~~text~~` | ~~Ratllat~~ |
| `` `codi` `` | `codi inline` |
| `[text](url)` | Enllaç |
| `> text` | Cita (blockquote) |

---

## ⚠️ Highlighting vs LaTeX — IMPORTANT

### Highlighting de text → `==text==`

Per ressaltar text important, usa doble igual:

```markdown
Això és un ==concepte molt important== que cal recordar.
```

> **NO** usis `$text$` per a highlights. La sintaxi `$...$` està **reservada exclusivament per a LaTeX**.

### LaTeX matemàtic → `$...$` i `$$...$$`

```markdown
La complexitat és $O(n \log n)$ en el cas mitjà.

$$
\sum_{i=0}^{n} i = \frac{n(n+1)}{2}
$$
```

| Sintaxi | Ús | Exemple |
|---|---|---|
| `==text==` | Highlight visual (fons ambre) | `==Cua de prioritat==` |
| `$formula$` | LaTeX inline (KaTeX) | `$O(n^2)$` |
| `$$formula$$` | LaTeX block (centrat) | `$$\int_0^1 x\,dx$$` |

---

## Blocs de Codi

````markdown
```cpp [Nom del fitxer]
#include <iostream>
int main() { return 0; }
```
````

Llenguatges suportats: `cpp`, `c`, `python`, `java`, `javascript`, `typescript`, `html`, `css`, `sql`, `json`, `bash`.

El text entre `[...]` apareix com a títol del bloc de codi.

---

## Directives Personalitzades

### Callouts / Avisos

```markdown
::callout[type="tip" title="Consell"]
Usa `const&` per evitar còpies innecessàries.
::
```

Tipus disponibles: `tip`, `note`, `warning`, `danger`, `info`.

### Accordions

```markdown
::accordion[title="Mostra la solució"]
Aquí va la solució...
::
```

### Vídeos

```markdown
::videoviz[src="/m2/video.webm" delay="3500"]
```

### YouTube

```markdown
::youtubeviz[src="https://youtube.com/watch?v=..." caption="Títol"]
```

---

## Visualitzadors Interactius

| Directiva | Ús |
|---|---|
| `::graph[edges="..." nodes="..."]` | Grafs interactius |
| `::stackviz[...]` | Pila (Stack) |
| `::queueviz[...]` | Cua (Queue) |
| `::vectorviz[...]` | Vector |
| `::linkedlistviz[...]` | Llista enllaçada |
| `::bintreeviz[...]` | Arbre binari |
| `::pointerviz[...]` | Punters / Referències |
| `::algoviz[algorithm="..."]` | Reproductor d'algorismes |
| `::oopviz[simulation="..."]` | Simulador OOP |
| `::mafs[type="..."]` | Gràfics matemàtics (Mafs) |
| `::threeviz[type="..."]` | Visualització 3D (Three.js) |

---

## Taules (GFM)

```markdown
| Columna 1 | Columna 2 |
|---|---|
| Dada 1 | Dada 2 |
```

---

## Llistes de Tasques (Task Lists)

```markdown
- [x] Tasca completada
- [ ] Tasca pendent
```

---

## Regles Generals

1. **No barregis `$` i `==`** — Cada un té el seu propòsit específic.
2. **Usa blocs de codi amb títol** — Ajuda els lectors a entendre el context.
3. **Afegeix callouts per conceptes clau** — Milloren la retenció.
4. **No usis HTML directe** — El sanitizer l'eliminarà.
5. **Prova el teu contingut localment** abans de fer push (`npm run dev`).
