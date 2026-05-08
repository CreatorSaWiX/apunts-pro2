---
title: "Tema 9: Taylor vàries variables"
description: "Derivades d'ordre superior, Teorema de Schwarz i l'aproximació de superfícies mitjançant polinomis de Taylor de grau n."
order: 9
readTime: "30 min"
subject: "m2"
draft: false
isUpdated: 1
---

## 1. Derivades d'ordre superior, hessiana i extrems

Si una funció $f$ admet derivades parcials en un entorn, aquestes funcions poden ser, al seu torn, derivables.

- **Derivades segones**: $\frac{\partial^2 f}{\partial x^2}, \frac{\partial^2 f}{\partial y^2}, \frac{\partial^2 f}{\partial x \partial y}, \frac{\partial^2 f}{\partial y \partial x}$.
- **Regularitat**: Com hem vist al Tema 8, diem que $f$ és de classe $C^k$ si totes les seves derivades parcials fins a ordre $k$ existeixen i són contínues. Aquesta és la **condició de seguretat** per poder fer Taylor de grau $k$.

En el cas general de $n$ variables $\mathbf{x} = (x_1, \dots, x_n)$, la **Matriu Hessiana** en un punt $\mathbf{a}$ és:

$$
Hf(\mathbf{a}) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x_1^2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_1}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_1}(\mathbf{a}) \\
\frac{\partial^2 f}{\partial x_1 \partial x_2}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2^2}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n \partial x_2}(\mathbf{a}) \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial^2 f}{\partial x_1 \partial x_n}(\mathbf{a}) & \frac{\partial^2 f}{\partial x_2 \partial x_n}(\mathbf{a}) & \dots & \frac{\partial^2 f}{\partial x_n^2}(\mathbf{a}) 
\end{pmatrix}
$$

Per al cas de dues variables $(x,y)$, que és el que usarem més sovint, la matriu es redueix a:

$$
Hf(x,y) = \begin{pmatrix} 
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2} 
\end{pmatrix}
$$

> **Teorema de Schwarz**: Si $f$ és de classe $C^2$ en un obert $U$, llavors les derivades parcials creuades coincideixen:
> $$\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}$$
> Això redueix el nombre de càlculs (de 4 a 3 derivades segones en $\mathbb{R}^2$) i garanteix que la matriu Hessiana sigui **simètrica**.

::three{type="vis_teorema_schwarz"}

### Criteri i Interpretació Visual
Sigui $\Delta = \det(Hf(a))$ el determinant:

| Criteri | Tipus d'extrem | Forma Geomètrica |
| :--- | :--- | :--- |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} > 0$ | **Mínim relatiu** | **Bol / Tassa**: Creix en totes direccions. |
| $\Delta > 0, \frac{\partial^2 f}{\partial x^2} < 0$ | **Màxim relatiu** | **Muntanya / Cúpula**: Decreix en totes direccions. |
| $\Delta < 0$ | **Punt de sella** | **Cadira de muntar**: Puja en una via i baixa en l'altra. |
| $\Delta = 0$ | **Inconcloent** | Cal fer un **estudi local** o per rectes. |
 
::three{type="vis_extrems_hessiana"}

> **Si $\Delta = 0$**: La Hessiana no ens dóna prou informació. Com hem vist a l'exercici 9.3c, cal analitzar la funció en eixos o corbes per veure si canvia de signe al voltant del punt crític.


---

## 2. El Polinomi de Taylor Multivariable

El polinomi de Taylor de grau $n$ en el punt $\mathbf{a}$ aproxima la funció $f$ prop d'aquell punt.

### Fórmula desplegada (Grau 1 i 2)
Per a càlculs manuals en dues variables prop de $(a, b)$:
$$
P_1(x, y) = f(a, b) + \left[ \frac{\partial f}{\partial x}(a,b)(x-a) + \frac{\partial f}{\partial y}(a,b)(y-b) \right] 
$$
$$
P_2(x, y) = P_1(x,y) + \frac{1}{2!} \left[ \frac{\partial^2 f}{\partial x^2}(a,b)(x-a)^2 + 2\frac{\partial^2 f}{\partial x \partial y}(a,b)(x-a)(y-b) + \frac{\partial^2 f}{\partial y^2}(a,b)(y-b)^2 \right]
$$

::three{type="vis_taylor_graun"}

<!-- ### Notació Matricial (Compacta)
Molt útil en computació i per a més de 2 variables:
$$P_2(\mathbf{x}) = f(\mathbf{a}) + \nabla f(\mathbf{a})^T (\mathbf{x}-\mathbf{a}) + \frac{1}{2} (\mathbf{x}-\mathbf{a})^T Hf(\mathbf{a}) (\mathbf{x}-\mathbf{a})$$

> **Estratègia d'Examen: El "Truc de la Substitució"**
> Si has de calcular el polinomi a l'origen $(0,0)$ d'una funció composta com $f(x,y) = \ln(1+2x+3y)$, **no derivis 5 vegades!** 
> 1. Identifica el cor de la funció: $\ln(1+t)$.
> 2. Usa el desenvolupament de Taylor 1D: $t - \frac{t^2}{2} + \dots$
> 3. Substitueix $t = 2x+3y$ i desenvolupa algebraicament.
> *Aquesta tècnica és molt més ràpida i segura.*

::threeviz{type="taylor_3d"} -->

---

## 3. Resta de Lagrange

L'error comès en usar el polinomi $P_n$ s'anomena **Resta de Lagrange**. Utilitzem una notació basada en una **identitat notable** (com el binomi de Newton) per fer-la més fàcil de recordar:

$$
R_n(x,y) = \frac{1}{(n+1)!} \left[ h \frac{\partial}{\partial x} + k \frac{\partial}{\partial y} \right]^{n+1} f(c,d)
$$

On $h=(x-a)$ i $k=(y-b)$. El punt $(c,d)$ pertany al segment que uneix el punt d'aproximació amb el centre. Segons el grau, s'expandeix així:

**Resta de grau 1 ($n=1$):** Sembla un quadrat perfecte $(\alpha+\beta)^2$:
$$
R_1(x,y) = \frac{1}{2!} \left[ h^2 \frac{\partial^2 f}{\partial x^2}(c,d) + 2hk \frac{\partial^2 f}{\partial y \partial x}(c,d) + k^2 \frac{\partial^2 f}{\partial y^2}(c,d) \right]
$$

**Resta de grau 2 ($n=2$):** Sembla un cub perfecte $(\alpha+\beta)^3$:
$$
R_2(x,y) = \frac{1}{6} \left[ h^3 \frac{\partial^3 f}{\partial x^3}(c,d) + 3h^2k \frac{\partial^3 f}{\partial y \partial x^2}(c,d) + 3hk^2 \frac{\partial^3 f}{\partial y^2 \partial x}(c,d) + k^3 \frac{\partial^3 f}{\partial y^3}(c,d) \right]
$$

Per calcular la fita superior $|R_n| \leq \dots$, apliquem el valor absolut a l'expansió corresponent i substituïm cada derivada pel seu **valor màxim absolut ($M$)** en el segment que uneix l'origen amb el punt $(x,y)$.

**Fita per a grau 1:**
$$
|R_1(x,y)| \leq \frac{1}{2} \left[ M_{\frac{\partial^2 f}{\partial x^2}} |h|^2 + 2M_{\frac{\partial^2 f}{\partial y \partial x}} |hk| + M_{\frac{\partial^2 f}{\partial y^2}} |k|^2 \right]
$$

**Fita per a grau 2:**
$$
|R_2(x,y)| \leq \frac{1}{6} \left[ M_{\frac{\partial^3 f}{\partial x^3}} |h|^3 + 3M_{\frac{\partial^3 f}{\partial y \partial x^2}} |h^2 k| + 3M_{\frac{\partial^3 f}{\partial y^2 \partial x}} |h k^2| + M_{\frac{\partial^3 f}{\partial y^3}} |k|^3 \right]
$$

::three{type="vis_fita_error_lagrange"}

<!-- Per simplificar càlculs en exàmens, sovint s'usa una fita més relaxada:
$$|R_1| \leq \frac{1}{2} M_{global} (|h| + |k|)^2$$ -->


---

## 4. El Diferencial i l'Increment
Una interpretació clau de Taylor és separar la funció en part constant, lineal i error:

$$
f(x,y) = f(a,b) + \underbrace{\frac{\partial f}{\partial x} dx + \frac{\partial f}{\partial y} dy}_{df \text{ (Diferencial)}} + R_1
$$

::three{type="vis_diferencial_increment"}

El **Diferencial** ($df$) representa l'increment aproximat de la funció quan ens movem una distància petita $(dx, dy)$ des del punt inicial.
