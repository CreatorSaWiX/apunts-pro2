---
title: "Tema 9: Taylor vàries variables"
description: "Derivades d'ordre superior, Teorema de Schwarz i l'aproximació de superfícies mitjançant polinomis de Taylor de grau n."
order: 9
readTime: "30 min"
subject: "m2"
draft: false
isNew: true
---

L'objectiu d'aquest tema és estendre l'aproximació lineal (el pla tangent) a aproximacions de grau superior que capturin la curvatura de les superfícies.

## 1. Derivades d'Ordre Superior

Si una funció $f$ admet derivades parcials en un entorn, aquestes funcions poden ser, al seu torn, derivables.

- **Derivades segones**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularitat**: Com hem vist al Tema 8, diem que $f$ és de classe $C^k$ si totes les seves derivades parcials fins a ordre $k$ existeixen i són contínues. Aquesta és la **condició de seguretat** per poder fer Taylor de grau $k$.

> **Teorema de Schwarz**: Si $f$ és de classe $C^2$ en un obert $U$, llavors les derivades parcials creuades coincideixen:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> Això redueix el nombre de càlculs (de 4 a 3 derivades segones en $\mathbb{R}^2$) i garanteix que la matriu Hessiana sigui **simètrica**.

::three{type="vis_teorema_schwarz"}

---

## 2. El Polinomi de Taylor Multivariable

El polinomi de Taylor de grau $n$ en el punt $\mathbf{a}$ aproxima la funció $f$ prop d'aquell punt.

### Fórmula desplegada (Grau 2)
Per a càlculs manuals en dues variables prop de $(a, b)$:
$$
P_2(x, y) = f(a, b) + \left[ f_x(a,b)(x-a) + f_y(a,b)(y-b) \right] + \frac{1}{2} \left[ f_{xx}(a,b)(x-a)^2 + 2f_{xy}(a,b)(x-a)(y-b) + f_{yy}(a,b)(y-b)^2 \right]
$$

::three{type="vis_taylor_graun"}

### Notació Matricial (Compacta)
Molt útil en computació i per a més de 2 variables:
$$P_2(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^T (\mathbf{x}-\mathbf{a}) + \frac{1}{2} (\mathbf{x}-\mathbf{a})^T Hf(\mathbf{a}) (\mathbf{x}-\mathbf{a})$$

> [!TIP]
> **Estratègia d'Examen: El "Truc de la Substitució"**
> Si has de calcular el polinomi a l'origen $(0,0)$ d'una funció composta com $f(x,y) = \ln(1+2x+3y)$, **no derivis 5 vegades!** 
> 1. Identifica el cor de la funció: $\ln(1+t)$.
> 2. Usa el desenvolupament de Taylor 1D: $t - \frac{t^2}{2} + \dots$
> 3. Substitueix $t = 2x+3y$ i desenvolupa algebraicament.
> *Aquesta tècnica és molt més ràpida i segura.*

::threeviz{type="taylor_3d"}

---

## 3. El Diferencial i l'Increment
Una interpretació clau de Taylor és separar la funció en part constant, lineal i error:
$$f(x,y) = f(a,b) + \underbrace{f_x dx + f_y dy}_{df \text{ (Diferencial)}} + R_1$$

::three{type="vis_diferencial_increment"}

El **Diferencial** ($df$) representa l'increment aproximat de la funció quan ens movem una distància petita $(dx, dy)$ des del punt inicial.

---

## 4. Matriu Hessiana i Geometria dels Extrems

La **Matriu Hessiana** defineix la "corba" de la superfície en totes les direccions simultàniament.

### Criteri i Interpretació Visual
Sigui $\Delta = \det(Hf(a))$ el determinant:

| Criteri | Tipus d'extrem | Forma Geomètrica |
| :--- | :--- | :--- |
| $\Delta > 0, f_{xx} > 0$ | **Mínim relatiu** | **Bol / Tassa**: Creix en totes direccions. |
| $\Delta > 0, f_{xx} < 0$ | **Màxim relatiu** | **Muntanya / Cúpula**: Decreix en totes direccions. |
| $\Delta < 0$ | **Punt de sella** | **Cadira de muntar**: Puja en una via i baixa en l'altra. |
| $\Delta = 0$ | **Inconcloent** | Cal fer un **estudi local** o per rectes. |
 
::three{type="vis_extrems_hessiana"}

> **Si $\Delta = 0$**: La Hessiana no ens dóna prou informació. Com hem vist a l'exercici 9.3c, cal analitzar la funció en eixos o corbes per veure si canvia de signe al voltant del punt crític.

---

## 5. Aproximació i Fita de l'Error

L'error comès en usar $P_n$ s'anomena **Resta de Lagrange**. Per a una aproximació lineal (grau 1), l'error es fita per:

$$|R_1(x,y)| \leq \frac{1}{2} \left[ M_{xx} |h|^2 + 2M_{xy} |hk| + M_{yy} |k|^2 \right]$$

On $h = x-a, k = y-b$ i les $M$ són el **valor màxim absolut** de les derivades segones en el segment que connecta $(a,b)$ amb el punt d'aproximació.

::three{type="vis_fita_error_lagrange"}

Per simplificar càlculs en exàmens, sovint s'usa una fita més relaxada:
$$|R_1| \leq \frac{1}{2} M_{global} (|h| + |k|)^2$$

