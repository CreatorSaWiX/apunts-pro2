---
title: "Tema 4: Immersió i arbres binaris"
description: "Vèncer les limitacions de la recursivitat i domini total i ràpid dels arbres binaris."
readTime: "8 min"
order: 4
---

## 4.1 La immersió

Sovint a l'examen ens demanen una funció amb una capçalera fixa (com `reverse(string s)`), però per resoldre-la recursivament necessitem **paràmetres addicionals** (com un acumulador o comptadors).

La **immersió** consisteix en:
1. Crear una **funció auxiliar** (immersa) amb els paràmetres extra necessaris.
2. Fer que la **funció pública** només cridi la funció auxiliar amb els valors inicials.

### Exemple 1: Invertir un text (`reverse`)

Necessitem un paràmetre índex `i` per recórrer el text sense fer còpies:

:::oopviz{simulation="immersio_reverse"}
:::

### Exemple 2: Fibonacci lineal $\mathcal{O}(n)$

El Fibonacci recursiu simple té un cost exponencial $\mathcal{O}(2^n)$ perquè repeteix càlculs. Amb immersió passem els dos últims nombres i reduïm el cost a **$\mathcal{O}(n)$**:

:::oopviz{simulation="immersio_fibonacci"}
:::

---

## 4.2 L'arbre binari (`BinTree<T>`)

Un **arbre binari (`BinTree`)** és una estructura de dades recursiva: o bé està **buit**, o bé té un node **arrel** (`value()`) i dos subarbres: el **fill esquerre** (`left()`) i el **fill dret** (`right()`).

:::warning
**Els arbres `BinTree` són immutables:** un cop creats, no es poden modificar directament (no tenen mètodes com `set_value()`). Per alterar un arbre cal construir-ne un de nou combinant les branques amb el constructor `BinTree(x, left, right)`.
:::

:::bintreeviz
:::

---

## 4.3 Funcions bàsiques: cerca i alçada

Les funcions sobre `BinTree` es resolen de forma natural amb **recursivitat**:

### 1. Calcular l'alçada (`height`)
L'alçada d'un arbre buit és `0`. Si no està buit, és `1 + max(alçada(esquerre), alçada(dret))`:

:::algoviz{algorithm="height"}
:::

### 2. Cercar un element (`cerca`)
Comprova si l'arrel és el valor buscat `x`. Si no, cerca a l'esquerra o a la dreta aprofitant el curtcircuit de l'operador `||`:

:::algoviz{algorithm="cerca_height"}
:::

---

## 4.4 Els recorreguts globals

Un **recorregut** visita tots els nodes de l'arbre exactament un cop. Segons l'ordre en què es processa l'arrel respecte als seus fills:

### Cerca en profunditat (DFS)

- **Preordre:** *Arrel → Esquerre → Dret* (processa l'arrel abans de baixar als fills):
:::algoviz{algorithm="preordre"}
:::

- **Inordre:** *Esquerre → Arrel → Dret* (processa el fill esquerre, després l'arrel, i finalment el fill dret):
:::algoviz{algorithm="inordre"}
:::

- **Postordre:** *Esquerre → Dret → Arrel* (processa primer els dos fills i l'arrel al final):
:::algoviz{algorithm="postordre"}
:::

### Cerca en amplada (BFS)
Visita els nodes nivell a nivell (d'esquerra a dreta) utilitzant una **cua (`queue`)**:

:::algoviz{algorithm="bfs"}
:::

:::tip
**Consell d'examen (Càlculs en una sola passada):**
Si has de calcular dues propietats d'un arbre alhora (per exemple, la suma i el nombre de nodes per fer la mitjana, o l'alçada i si està equilibrat), **no facis dues crides recursives separades**. Fes una sola passada $\mathcal{O}(n)$ retornant un `pair<A, B>` o passant paràmetres per referència (`&`).
:::

