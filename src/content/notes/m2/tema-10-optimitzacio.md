---
title: "Tema 10: Optimització de Vàries Variables"
description: "Cerca de màxims i mínims: extrems relatius, punts de sella, multiplicadors de Lagrange i extrems absoluts."
order: 10
readTime: "40 min"
subject: "m2"
---

L'optimització consisteix a trobar els valors on una funció assoleix el seu màxim o mínim. En vàries variables, això requereix analitzar el gradient i la curvatura (Hessiana).

## 1. Extrems Relatius (Lliures)

Un punt $\mathbf{a}$ és un **punt crític** si el gradient és nul: $\nabla f(\mathbf{a}) = \mathbf{0}$. Els punts crítics poden ser:

### Tipus de Punts
Emprarem el determinant de la **Matriu Hessiana** $\Delta = \det(Hf(\mathbf{a}))$ i el signe de $f_{xx}$ per classificar-los:

1. **Mínim Local**: $\Delta > 0$ i $f_{xx} > 0$. La funció creix en totes direccions.
2. **Màxim Local**: $\Delta > 0$ i $f_{xx} < 0$. La funció decreix en totes direccions.
3. **Punt de Sella**: $\Delta < 0$. Creix en una direcció i decreix en una altra.

> [!TIP]
> Si $\Delta = 0$, el criteri no decideix. Cal estudiar la funció directamente (per exemple, per rectes o definició).

::grid{cols=3}
:::threeviz{type="minim_local"}
:::
:::threeviz{type="maxim_local"}
:::
:::threeviz{type="punt_sella_optim"}
:::
::

---

## 2. Extrems Condicionats (Lagrange)

Sovint no busquem l'extrem en tot el domini, sinó restringit a una corba o superfície $g(x,y) = 0$.

> **Mètode dels Multiplicadors de Lagrange**: Els extrems de $f$ subjectes a $g=0$ es troben on els gradients són paral·lels:
> $$\nabla f(\mathbf{x}) = \lambda \nabla g(\mathbf{x})$$
> On $\lambda$ s'anomena el multiplicador de Lagrange.

### Procediment:
1. Construir la funció de Lagrange: $L(\mathbf{x}, \lambda) = f(\mathbf{x}) - \lambda g(\mathbf{x})$.
2. Resoldre el sistema: $\nabla L = \mathbf{0}$, que inclou la condició $g(\mathbf{x}) = 0$.

---

## 3. Extrems Absoluts en Compactes

Si el domini $K$ és un **compacte** (tancat i acotat), el Teorema de Weierstrass garanteix que existeixen un màxim i un mínim absoluts.

### Com trobar-los?
Cal fer una llista de "candidats" i agafar el més gran i el més petit:
1. Punts crítics a l'**interior** de $K$ ($\nabla f = 0$).
2. Extrems a la **frontera** de $K$ (utilitzant el mètode de Lagrange o parametritzant la frontera).
3. Punts on la funció no sigui differentiable (si n'hi ha).

---

## 4. Estratègia d'Examen
- Primer: Calcula les parcials i iguala a zero.
- Segon: Classifica amb la Hessiana (mira bé els signes!).
- Tercer: Si hi ha restriccions, usa Lagrange.
- Quart: Compara valors per decidir els absoluts.
