---
title: "Tema 2: Recorreguts, Connexió i DFS"
description: "Camins, vèrtexs de tall, distàncies i l'algorisme de Cerca en Profunditat."
readTime: "12 Min"
order: 2
---

Anem directes al gra per entendre com identificar parts del graf i mesurar-les ràpidament.

## 1. Com ens movem per un graf?

*   **Recorregut**: Viatjar d'un vèrtex a un altre mitjançant arestes (pots repetir llocs com vulguis).
*   **Camí**: Un recorregut on **no repetim cap vèrtex** (tampoc cap aresta).
*   **Cicle**: Un camí tancat (inici = final) de longitud $\ge 3$. Un graf sense cicles s'anomena **graf acíclic**.
*   **Longitud**: És exactament el nombre d'arestes que creuem, no els vèrtexs. El viatge d'un vèrtex a si mateix (sense moure's) té longitud 0.

## 2. Punts de fallida: Talls i Ponts

Un graf és **connex** si sempre hi ha algun camí entre qualsevol parella de vèrtexs. Si algun no hi arriba, es fragmenta en **components connexos** separats. Qualsevol graf connex de mida real exigeix com a mínim l'ús estricte d'$n - 1$ arestes.
Però, com de fràgil és el nostre graf connex?

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
<div class="text-xs text-center text-slate-400 mt-2 mb-4">El vèrtex de <b>Tall</b> és vital. L'aresta groga és exclusivament un <b>Pont</b>.</div>

## 3. Mètriques de Distància
Siguin dos vèrtexs que viuen en un mateix component connex $u$ i $v$:
*   **Distància $d(u,v)$**: El valor *mínim* referent a la longitud de tota la varietat de camins per anar d'$u$ a $v$. Si no hi ha camí possible, es considera $\infty$.

A nivell global de graf tenim 4 definicions claus a avaluar depenent d'aquesta $d$:
1.  **Excentricitat $e(u)$**: Posa't a $u$. Quina és la distància d'aquell qui està més lluny? ("el pitjor dels casos"). 
2.  **Diàmetre $D(G)$**: La distància més gran que pots trobar en **tot** el graf. El màxim valor de les excentricitats juntes.
3.  **Radi $r(G)$**: Si cerquem el punt més eficient del mapa... La menor excentricitat disponible obtinguda per algun vèrtex es diu radi.
4.  **Centre del Graf**: Qualsevol i tots els vèrtexs on hagin calculat tenir de forma miraculosa justament l'excentricitat exactament igual al dit **radi**.

---

## 4. DFS: Cerca en Profunditat (Depth-First Search)

L'algoritme de demostració oficial **DFS** permet trobar absolutament tot el component connex al qual pertany un inici donat $v$. Descobreix les profunditats abans de mirar pels costats contigus i es basa nativament en emprar una Especie de **Pila (LIFO)**. 

El concepte clau: A cada visita s'intenta afegir un sol adjacent fresc de qui seguir-se enfonsant (push). Només si ens quedem acorralats (tots els veí revisats), fa marxa enrere desfent des de la pròpia pila per explorar per on vam venir (pop).

:::algoviz{algorithm="dfs"}
:::
