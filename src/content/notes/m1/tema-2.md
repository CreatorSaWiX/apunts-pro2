---
title: "Tema 2: Recorreguts, connexió i DFS"
description: "Camins, vèrtexs de tall, distàncies i l'algorisme de Cerca en Profunditat."
readTime: "12 Min"
order: 2
---

## 1. Conceptes

*   **Recorregut**: Viatjar d'un vèrtex a un altre mitjançant arestes (pots repetir llocs com vulguis).
*   **Camí**: Un recorregut on **no repetim cap vèrtex** (tampoc cap aresta).
*   **Cicle**: Un camí tancat (inici = final) de longitud $\ge 3$. Un graf sense cicles s'anomena **graf acíclic**.
*   **Longitud**: És exactament el nombre d'arestes que creuem, no els vèrtexs. El viatge d'un vèrtex a si mateix (sense moure's) té longitud 0.

## 2. Talls i ponts

Un graf és **connex** si sempre hi ha algun camí entre qualsevol parella de vèrtexs. Si algun no hi arriba, es fragmenta en **components connexos** separats. Qualsevol graf connex de mida real exigeix com a mínim l'ús estricte $n - 1$ arestes (si tenim un graf connex de 5 vèrtexs, aleshores té exactament 4 arestes).

*   **Vèrtex de tall**: Si esborrem aquest sol vèrtex, tallem tantes connexions que el graf es divideix instantàniament en MÉS components connexos.
*   **Aresta pont**: Si esborrem aquesta aresta en solitari, trenquem el graf en **exactament 2** components connexos.

:::graph
```json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "Tall", "color": "#ef4444" },
    { "id": "4", "color": "#3b82f6" }, { "id": "5" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "Tall" }, { "source": "1", "target": "Tall" },
    { "source": "Tall", "target": "4", "color": "#facc15", "width": 3, "label": "Pont" },
    { "source": "4", "target": "5" }
  ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2 mb-4">El vèrtex de <b>Tall</b> és vital. L'aresta groga és exclusivament un <b>Pont</b>.</div> <!-- No hi ha arestes grogues.. -->

:::tip{title="La fal·làcia d'arestes i vèrtexs"}
"Un graf connex amb vèrtexs de tall sempre té alguna aresta pont"? **FALS**. Contraexemple: el **graf papallona** (dos triangles units per un sol vèrtex). El vèrtex central és de tall, però cap aresta és pont perquè totes formen part d'un cicle. En canvi, el **recíproc sí que és cert**: si una aresta és pont, els seus extrems són vèrtexs de tall (excepte si algun extrem té grau 1, és a dir, és una fulla).
:::

## 3. Mètriques de distància
Siguin dos vèrtexs que viuen en un mateix component connex $u$ i $v$:
*   **Distància $d(u,v)$**: El valor *mínim* referent a la longitud de tota la varietat de camins per anar d'$u$ a $v$. Si no hi ha camí possible, es considera $\infty$.

A nivell global de graf tenim 4 definicions claus a avaluar depenent d'aquesta $d$:
1.  **Excentricitat $e(u)$**: Posa't a $u$. Quina és la distància d'aquell qui està més lluny? ("el pitjor dels casos"). 
2.  **Diàmetre $D(G)$**: La distància més gran que pots trobar en **tot** el graf. El màxim valor de les excentricitats juntes.
3.  **Radi $r(G)$**: Si cerquem el punt més eficient del mapa... La menor excentricitat disponible obtinguda per algun vèrtex es diu radi.
4.  **Centre del Graf**: Qualsevol i tots els vèrtexs on hagin calculat tenir de forma miraculosa justament l'excentricitat exactament igual al dit **radi**.

**Exemple:** Considerem el camí $a - b - c - d$:

| | $d(\cdot, a)$ | $d(\cdot, b)$ | $d(\cdot, c)$ | $d(\cdot, d)$ | **Excentricitat** |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **a** | 0 | 1 | 2 | 3 | **3** |
| **b** | 1 | 0 | 1 | 2 | **2** |
| **c** | 2 | 1 | 0 | 1 | **2** |
| **d** | 3 | 2 | 1 | 0 | **3** |

*   **Diàmetre** $D(G) = \max(3,2,2,3) = 3$
*   **Radi** $r(G) = \min(3,2,2,3) = 2$
*   **Centre** = $\{b, c\}$ (els vèrtexs amb excentricitat $= r$)

---

## 4. DFS: Cerca en profunditat (Depth-First Search)

L'algoritme de demostració oficial **DFS** permet trobar absolutament tot el component connex al qual pertany un inici donat $v$. Descobreix les profunditats abans de mirar pels costats contigus i es basa nativament en emprar una especie de **pila (LIFO)**. 

A cada visita s'intenta afegir un sol adjacent fresc de qui seguir-se enfonsant (push). Només si ens quedem acorralats (tots els veí revisats), fa marxa enrere desfent des de la pròpia pila per explorar per on vam venir (pop).

:::algoviz{algorithm="dfs"}
:::

## 5. BFS: Cerca en amplada (Breadth-First Search)

Mentre que el DFS baixa en picat "caient", el **BFS** es propaga radialment per capes. A l'ordinador necessita purament estructurar memòria temporal al voltant d'una **cua (FIFO)**.

Si tenim un array `D` que ens guarda quants passos portem fets:
1. Posar el node d'origen ($v$) a distància `0` dins de `D`. `D[v] = 0`.
2. Encues i afegeixes el $v$ a la llista de Visitat ($W$).
3. Quan extrems el primer de la cua (anomenat $x$), tots els nous adjacents inexplorats ($y$) prendran estrictament com a distància oficial el valor **$D[y] = D[x] + 1$**. I tu avances a un altre barri!

> Sigui el graf simple $G = (V,A)$ i el seu vèrtex $v \in V$. El vector resultori $D$ obtingut manualment durant **les rutines pures de l'algorisme BFS** garanteix esdevindre l'emmagatzematge real de la **distància mínima de camins del vèrtex original $v$ cap a qualsevol altre** ubicat a tota l'arrel de nodes connectats.

:::algoviz{algorithm="bfs2"}
:::

:::tip{title="Truc d'Examen: Executar Recorreguts a Paper"}
Sovint demanaran llistar explícit i de memòria sobre "l'ordre d'addició de vèrtexs a l'arbre generador BFS/DFS prioritzant estrictament amb ordre numèric petit de frontera". És clau no fallar ni liar-se:
*   **Arestes Generadores:** La canonada mestra o *aresta de descobriment* prové únicament des de quin vèrtex anterior has conquerit de primera l'altre desconegut!  I mai entre adjacents descoberts des d'uns mateixos fons.
*   **Ordre BFS Paper:** Llisteu els de distància 1 (ordenats de menor id a major), poseu les branquetes, feu d'origen un a un i afegiu els de distància 2. No salteu branques!
*   **Ordre DFS Paper:** Segueix la línia sense tancar fins l'últim racó menor possible. Un cop tallat el pas sense ruta (tots veïns actuals visitats), desfés darrera i busca rutes verges paral·leles descartades com recurs.
:::

---

## 6. Com saber si un graf és Bipartit?

Un graf és **bipartit** si podem pintar els seus vèrtexs amb **2 colors** (ex: Vermell i Blau) de manera que cap parell de vèrtexs del mateix color estiguin connectats entre sí.

:::tip{title="Regla d'or d'examen"}
Un graf és **Bipartit** $\iff$ **NO té cap cicle de longitud SENAR** (com un triangle $C_3$ o un pentàgon $C_5$).
:::

### Visualització: el mètode del "pintat"
Imagina que intentes pintar el graf alternant colors. Si en algun moment et veus obligat a connectar dos nodes del mateix color, és que hi ha un cicle senar i **no** és bipartit.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-emerald-500/20"}
**Bipartit**
Tots els camins tancats són parells ($C_4$). Podem separar en dos grups.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#ef4444" }, { "id": 4, "color": "#3b82f6" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 1 }
  ]
}
```
:::
::::

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-red-500/20"}
**No bipartit (Cicle $C_3$)**
Té un triangle. És impossible pintar-lo amb 2 colors sense repetir en una aresta.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#facc15" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 1 }
  ]
}
```
:::
::::

:::::

