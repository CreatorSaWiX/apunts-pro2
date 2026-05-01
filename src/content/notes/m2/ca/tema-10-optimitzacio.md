---
title: "Tema 10: Optimització de vàries variables"
description: "Estudi de punts crítics, extrems relatius, condicionats (Lagrange) i absoluts en conjunts compactes."
order: 10
readTime: "45 min"
subject: "m2"
draft: false
isNew: true
---

L'optimització consisteix a trobar els valors on una funció assoleix el seu màxim o mínim. En vàries variables, distingim tres escenaris: extrems **lliures** (sense restriccions), extrems **condicionats** (sobre una corba o superfície) i extrems **absoluts** (en un domini tancat i acotat).

## 1. Extrems Relatius (Lliures)

Sigui $f: U \subseteq \mathbb{R}^n \to \mathbb{R}$ una funció definida en un obert $U$.

### Definicions
- **Màxim Relatiu**: Un punt $\mathbf{a}$ és un màxim si $f(\mathbf{x}) \leq f(\mathbf{a})$ per a tot $\mathbf{x}$ en un entorn de $\mathbf{a}$.
- **Mínim Relatiu**: Un punt $\mathbf{a}$ és un mínim si $f(\mathbf{x}) \geq f(\mathbf{a})$ per a tot $\mathbf{x}$ en un entorn de $\mathbf{a}$.
- **Punt Crític (Estacionari)**: Punt on $\nabla f(\mathbf{a}) = \mathbf{0}$, és a dir, totes les derivades parcials s'anul·len.

> **Condició Necessària**: Si $f$ és derivable i té un extrem relatiu en $\mathbf{a}$, llavors $\nabla f(\mathbf{a}) = \mathbf{0}$. El recíproc **no** és cert: un punt crític pot ser un punt de sella.

### Classificació per la Matriu Hessiana (2 variables)
Sigui $(a,b)$ un punt crític de $f \in \mathcal{C}^2$. Analitzem el determinant $\Delta = \det(Hf(a,b))$:

1. **$\Delta > 0$**: Hi ha un extrem.
   - Si $\frac{\partial^2 f}{\partial x^2}(a,b) > 0 \implies$ **Mínim Relatiu**.
   - Si $\frac{\partial^2 f}{\partial x^2}(a,b) < 0 \implies$ **Màxim Relatiu**.
2. **$\Delta < 0$**: El punt és un **Punt de Sella** (la funció creix en alguna direcció i decreix en una altra).
3. **$\Delta = 0$**: El criteri **no decideix**. Cal analitzar el comportament al voltant del punt.
 
::three{type="vis_extrems_hessiana"}
 
> [!TIP]
> **Ninja Trick: Completar Quadrats**
> Si la funció és un polinomi de grau 2 (com $f(x,y) = x^2 + 2xy + 3y^2$), pots completar quadrats per veure si és una suma de quadrats positius (mínim) o negatius (màxim). És molt més ràpid que calcular la Hessiana!

> **Quan $\Delta = 0$**: Prova d'estudiar $f$ sobre rectes que passin pel punt (e.g. $y = 0$ o $y = x$). Una altra eina molt potent és **completar quadrats**: si pots escriure $f(x,y) - f(a,b)$ com una forma que és sempre positiva (o sempre negativa), tens un mínim (o màxim) global sense necessitat de la Hessiana.

---

## 2. Extrems Condicionats (Multiplicadors de Lagrange)

Busquem els extrems de $f(\mathbf{x})$ sobre el conjunt definit per una restricció $g(\mathbf{x}) = 0$.

La idea geomètrica: els extrems condicionats es troben allà on la **corba de nivell de $f$ és tangent a la corba de restricció $g = 0$**. Quan dues corbes són tangents, els seus gradients han de ser paral·lels.

### El Teorema de Lagrange
Això es formalitza amb el sistema:
$$
\begin{cases}
\nabla f(\mathbf{x}) = \lambda \, \nabla g(\mathbf{x}) \\
g(\mathbf{x}) = 0
\end{cases}
$$
On $\lambda$ és el **multiplicador de Lagrange**. Per a múltiples restriccions $g_1 = 0, \ldots, g_m = 0$, generalitza a $\nabla f = \sum_j \lambda_j \nabla g_j$.

::three{type="vis_lagrange_multiplicadors"}

> [!IMPORTANT]
> **El Significat de $\lambda$**
> El multiplicador $\lambda$ indica la taxa de variació del valor optimitzat de $f$ respecte a canvis en la restricció $c$. Si "relaxem" una mica la restricció, quant millorarà el nostre benefici? Això és $\lambda$.

### Com resoldre el sistema
Resoldre $\nabla f = \lambda \nabla g$ pot ser algebraicament pesat. Tres estratègies que sovint simplifiquen molt:

1. **Elimina $\lambda$**: Aïlla $\lambda$ de cada equació i iguala-les. Això dona una relació directa entre $x$ i $y$. Compte: no divideixis per zero; tracta $x = 0$ i $y = 0$ com a casos separats.

2. **Aprofita simetries**: Si les equacions per $x$ i per $y$ són gairebé idèntiques, prova $x = \pm y$ com a candidat. Molts exercicis d'examen estan construïts amb aquesta simetria oculta.

3. **Substitució directa en lloc de Lagrange**: Si la restricció és una recta (e.g. $y = 1 - x$) o permet aïllar fàcilment una variable, substitueix-la directament a $f$ i converteix el problema en una funció d'**una sola variable**. És més ràpid i segur.

> **Substitució parcial per a circumferències**: Si la restricció és $x^2 + y^2 = R^2$ i la funció $f$ conté el terme $x^2 + y^2$, pots substituir-lo directament per $R^2$ i reduir $f$ a una expressió molt més senzilla abans de derivar.

---

## 3. Optimització en Dominis Compactes (Weierstrass)

El **Teorema de Weierstrass** garanteix que si una funció és contínua en un domini tancat i acotat (compacte), aleshores té un **màxim i un mínim absoluts**.

### Procediment de cerca
Per trobar-los, no n'hi ha prou amb mirar l'interior; cal un rastreig exhaustiu:

1.  **Interior**: Busquem punts crítics on $\nabla f = (0,0)$.
    > Comprova sempre si el punt crític cau **dins** del domini. Si cau fora, s'ignora per a la cerca d'extrems absoluts.

2.  **Frontera de $K$**: Aplica Lagrange o parametritza la frontera per reduir-la a una variable.

3.  **Vèrtexs i Punts de Trencament**:

    > Si el domini és un polígon (triangle, quadrat...), **Lagrange no detecta els vèrtexs automàticament** perquè la frontera no és derivable en aquells punts. Has d'avaluar $f$ en cada vèrtex manualment. Sovint el màxim o mínim absolut es troba precisament en una cantonada.

::three{type="vis_optimitzacio_compacte"}

Un cop tens tots els candidats, el valor més gran és el **màxim absolut** i el més petit el **mínim absolut**.

> Si el domini **no** és compacte (per exemple, tot $\mathbb{R}^2$), el Teorema de Weierstrass no s'aplica i els extrems absoluts podrien no existir.

---

## 4. Problema Model: Estratègia Completa

Amb tota la teoria a mà, apliquem-la de dalt a baix. Volem els extrems absoluts de $f(x,y) = x^2 + y^2 - 2x$ en el disc tancat $D = \{(x,y) : x^2 + y^2 \leq 4\}$.

### Pas 1: Interior — Punts Crítics Lliures
Calculem $\nabla f = (2x - 2,\ 2y)$ i igualem a zero:
$$2x - 2 = 0 \implies x = 1, \quad 2y = 0 \implies y = 0$$
**Punt crític**: $(1, 0)$. Comprovem que és interior: $1^2 + 0^2 = 1 \leq 4$. ✓

Valor: $f(1, 0) = 1 + 0 - 2 = -1$.

### Pas 2: Frontera — Extrems Condicionats
La frontera és la circumferència $x^2 + y^2 = 4$.

Apliquem la substitució parcial: com que a la frontera $x^2 + y^2 = 4$, substituïm directament:
$$f(x,y) = \underbrace{(x^2 + y^2)}_{=4} - 2x = 4 - 2x$$
Com que sobre la circumferència $x \in [-2, 2]$, els extrems de $h(x) = 4 - 2x$ s'assoleixen als extrems de l'interval:
- $x = 2 \implies f(2, 0) = 0$
- $x = -2 \implies f(-2, 0) = 8$

### Pas 3: Comparació Final

| Punt | Origen | $f$ |
|------|--------|-----|
| $(1, 0)$ | Interior | $-1$ |
| $(2, 0)$ | Frontera | $0$ |
| $(-2, 0)$ | Frontera | $8$ |

- **Mínim Absolut**: $\mathbf{-1}$ al punt $(1, 0)$.
- **Màxim Absolut**: $\mathbf{8}$ al punt $(-2, 0)$.
