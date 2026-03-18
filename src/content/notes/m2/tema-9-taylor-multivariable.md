---
title: "Tema 9: Taylor per a Vàries Variables"
description: "Derivades d'ordre superior, Teorema de Schwarz i l'aproximació de superfícies mitjançant polinomis de Taylor de grau n."
order: 9
readTime: "30 min"
subject: "m2"
---

L'objectiu d'aquest tema és estendre l'aproximació lineal (el pla tangent) a aproximacions de grau superior que capturin la curvatura de les superfícies.

## 1. Derivades d'Ordre Superior

Si una funció $f$ admet derivades parcials en un entorn, aquestes funcions poden ser, al seu torn, derivables.

- **Derivades segones**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularitat**: Diem que $f$ és de classe $C^k$ si totes les seves derivades parcials fins a ordre $k$ existeixen i són contínues.

> **Teorema de Schwarz**: Si $f$ és de classe $C^2$ en un obert $U$, llavors les derivades parcials creuades coincideixen:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> Això redueix el nombre de càlculs necessaris per trobar el polinomi de Taylor.

---

## 2. El Polinomi de Taylor Multivariable

El polinomi de Taylor de grau $n$ en el punt $\mathbf{a}$ aproxima la funció $f$ prop d'aquell punt.

### Cas de dues variables (Grau 2)
Si aproximem $f(x, y)$ prop de $(a, b)$ fins a grau 2, tenim:
$$
P_2(x, y) = f(a, b) + \underbrace{\left[ f_x(a,b)(x-a) + f_y(a,b)(y-b) \right]}_{\text{Part Lineal (Grau 1)}} + \underbrace{\frac{1}{2} \left[ f_{xx}(a,b)(x-a)^2 + 2f_{xy}(a,b)(x-a)(y-b) + f_{yy}(a,b)(y-b)^2 \right]}_{\text{Part Quadràtica (Curvatura)}}
$$

::threeviz{type="taylor_3d"}

### Interpretació Geomètrica
- El polinomi de **grau 1** és el pla tangent. És l'aproximació més simple.
- El polinomi de **grau 2** és un **paraboloide** que s'"ajusta" a la curvatura de la superfície original. Com més alt és el grau, més s'assembla el polinomi a la funció en un entorn més gran del punt.

---

## 3. Matriu Hessiana

Encara que el tema se centra en el polinomi, és fonamental introduir la **Matriu Hessiana** $Hf(a)$, que recull totes les derivades segones:

$$
Hf(a) = \begin{pmatrix} 
f_{xx}(a) & f_{xy}(a) \\
f_{yx}(a) & f_{yy}(a)
\end{pmatrix}
$$

Aquesta matriu és la que defineix la part quadràtica del polinomi i serà la clau en el següent tema per trobar màxims i mínims (extrems relatius).

---

## 4. El Resta de Taylor
Igual que en una variable, l'error de l'aproximació s'expressa mitjançant el resta $R_n(\mathbf{x})$. Per a funcions diferenciables, aquest error tendeix a zero més ràpidament que la distància al punt elevada a $n$:
$$\lim_{\mathbf{x} \to \mathbf{a}} \frac{R_n(\mathbf{x})}{\|\mathbf{x} - \mathbf{a}\|^n} = 0$$
