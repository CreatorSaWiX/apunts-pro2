---
title: "Tema 3: Grafs Eulerians i Hamiltonians"
description: "Camins i cicles i els seus teoremes associats."
readTime: "15 Min"
order: 3
---

Els grafs eulerians i hamiltonians responen a dos problemes clàssics: recórrer totes les arestes sense repetir-ne cap (eulerià) i recórrer tots els vèrtexs sense repetir-ne cap (hamiltonià).

## 1. Grafs eulerians: recorregut d'arestes

L'objectiu és recórrer un graf passant per **totes les arestes exactament un cop**.

*   **Senderó eulerià**: Un recorregut no tancat que passa per totes les arestes d'un graf connex sense repetir-ne cap.
*   **Circuit eulerià**: Un recorregut tancat (cicle) que passa per totes les arestes d'un graf connex sense repetir-ne cap.
*   **Graf eulerià**: Un graf que conté un circuit eulerià.

### Teorema d'Euler
Un graf connex és **eulerià** si i només si **tots els seus vèrtexs tenen grau parell**.

:::graph{height=200}
```json
{
  "nodes": [
    { "id": "A1", "label": "d=2", "color": "#3b82f6" },
    { "id": "A2", "label": "d=2", "color": "#3b82f6" },
    { "id": "B1", "label": "d=2", "color": "#ef4444" },
    { "id": "B2", "label": "d=2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }
  ]
}
```
:::

Si és un circuit, cada cop que arribes a un vèrtex per una aresta, necessites una altra aresta per sortir-ne. Per tant, les arestes incidents a cada vèrtex han d'anar en parelles (una d'entrada i una de sortida).

### Corol·lari per a senderons eulerians
Un graf connex té un **senderó eulerià** (però no circuit) si i només si té **exactament dos vèrtexs de grau senar**. 
En aquest cas, el senderó començarà obligatòriament en un dels vèrtexs de grau senar i acabarà a l'altre.

:::::grid{cols=2 gap=4}

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "A", "label": "Grau 2", "color": "#10b981" },
    { "id": "B", "label": "Grau 3", "color": "#ef4444" },
    { "id": "C", "label": "Grau 3", "color": "#ef4444" },
    { "id": "D", "label": "Grau 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "A", "target": "B" }, { "source": "A", "target": "C" },
    { "source": "B", "target": "C" }, { "source": "B", "target": "D" },
    { "source": "C", "target": "D" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-rose-400">NO eulerià (té senderó)</b><br/>Té exactament 2 nodes de grau senar (B i C).</div>
::::

::::grid{cols=1}
:::graph{height=260}
{
  "nodes": [
    { "id": "1", "label": "Grau 2", "color": "#10b981" }, { "id": "2", "label": "Grau 2", "color": "#10b981" },
    { "id": "3", "label": "Grau 2", "color": "#10b981" }, { "id": "4", "label": "Grau 2", "color": "#10b981" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "3", "target": "4" }, { "source": "4", "target": "1" }
  ]
}
:::
<div class="text-center text-sm mt-1 mb-4"><b class="text-emerald-400">Graf eulerià</b><br/>Tots els nodes tenen grau parell.</div>
::::

:::::

:::tip{title="Truc d'Examen: El joc algebraic de l'eulerià"}
Examen típic: "Per a quins valors de $n$, el graf complementari $T^c$ és eulerià?" L'examen juga on no pots veure gràfics, només equacions de lletres mortes.
Si pregunten això, invoca ràpidament el "Grau del Complementari" de Tema 1:
$$g_{T^c}(v) = (n - 1) - g_T(v)$$
I aquí apliquem Euler pur: **Per tal que $T^c$ sigui eulerià, el resultat d'aquella equació TOTS ELS COPS per TOTS els elements ha de donar obligatòriament valor PARELL.**
:::

Pots veure com s'avaluen programàticament els graus senars per decidir si és o no eulerià en l'algorisme de continuació:

:::algoviz{algorithm="eulerian_check"}
:::

---

## 2. Grafs hamiltonians: recorregut de vèrtexs

Mentre Euler es fixava en les arestes, Hamilton es fixa en els **vèrtexs**. L'objectiu és visitar cada vèrtex exactament un cop.

*   **Camí hamiltonià**: Un camí que passa per **tots els vèrtexs** del graf sense repetir-ne cap.
*   **Cicle hamiltonià**: Un cicle que passa per **tots els vèrtexs** del graf exactament un cop (excepte el vèrtex origen/destí).
*   **Graf hamiltonià**: Un graf que conté un cicle hamiltonià.

Malauradament, saber si un graf general és hamiltonià és un problema **NP-Complet**. No existeix cap regla fàcil i infal·lible (com els graus parells d'Euler) per afirmar-ho o denegar-ho a primer cop d'ull. Ens basem en condicions i exploració amb *backtracking*.

### 2.1 Condicions necessàries (Si no es compleixen, NO pot ser Hamiltonià)

1. **Grau mínim $g_{min} \ge 2$**: En un cicle hem d'entrar i sortir de cada vèrtex per dues arestes diferents. Si el graf té vèrtexs de grau 1 (fulles), és impossible que sigui hamiltonià.
2. **Teorema de l'eliminació de vèrtexs**: Si eliminem un conjunt de vèrtexs $S$, el nombre de components connexes resultants, $c(G-S)$, no pot superar el nombre de vèrtexs eliminats:
   $$c(G-S) \le |S|$$

:::tip{title="Com descartar Hamilton a l'examen"}
El Teorema de l'eliminació és la teva millor arma. Si trobes un sol vèrtex que, en eliminar-lo, deixa el graf partit en 2 o més trossos (vèrtex de tall), el graf **no és hamiltonià** perquè $c(G-S) \ge 2$ però $|S|=1$.

**Per famílies de grafs:**
- **Arbres:** Mai són hamiltonians (tenen fulles).
- **Bipartits complets ($K_{r,s}$):** Només són hamiltonians si $r = s$.
- **Roda ($W_n$):** Sempre és hamiltoniana (el cicle exterior ja ens dóna el camí).
:::

### 2.2 Condicions suficients (Si es compleixen, SÍ que ho és segur)

Aquestes condicions garanteixen l'existència d'un cicle si el graf té "moltes" arestes:

- **Teorema de Dirac**: Si tots els vèrtexs tenen grau $g(v) \ge \frac{n}{2}$, el graf és **hamiltonià**.
- **Teorema d'Ore**: Si per a cada parella de vèrtexs **no adjacents** $u, v$, la suma dels seus graus és $g(u) + g(v) \ge n$, el graf és **hamiltonià**.

### L'algorisme d'exploració (backtracking)

Per trobar un camí hamiltonià en general necessitem provar rutes a fons confiant en no equivocar-nos i fent _backtracking_ (marxa enrere) quan arribem a un cul-de-sac:

:::algoviz{algorithm="hamiltonian_backtrack"}
:::
